const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 1800 }); // Cache shelter results for 30 minutes

// Multiple Overpass endpoints to try if one is rate-limited
// Ordered by reliability — kumi and mail.ru first, then main mirrors
const OVERPASS_ENDPOINTS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];


async function queryNearby(lat, lng, radiusKm) {
  // Round to nearest 0.05 degrees for caching (approx 5km grid) to improve hit rate immensely
  const cacheKey = `${Math.round(lat*20)/20},${Math.round(lng*20)/20},${radiusKm}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const [osmResult, femaResult] = await Promise.allSettled([
    queryOSM(lat, lng, radiusKm),
    queryFEMA(lat, lng, radiusKm),
  ]);
  const osm = osmResult.status === 'fulfilled' ? osmResult.value : [];
  const fema = femaResult.status === 'fulfilled' ? femaResult.value : [];
  let combined = [...fema, ...osm].sort((a, b) => a.distance_km - b.distance_km);

  // Deduplicate redundant shelter/hospital entries from Overpass mapping overlap
  const uniqueRes = [];
  const seenStr = new Set();
  for (const item of combined) {
    const key = item.name 
      ? `${item.type}|${item.name.toLowerCase()}` 
      : `${item.type}|${Math.round(item.lat*100)},${Math.round(item.lng*100)}`;
    if (!seenStr.has(key)) {
      seenStr.add(key);
      uniqueRes.push(item);
    }
  }
  
  cache.set(cacheKey, uniqueRes);
  return uniqueRes;
}

async function queryFEMA(lat, lng, radiusKm) {
  try {
    const res = await axios.get(
      'https://gis.fema.gov/REST/services/NSS/FEMA_NSS/MapServer/0/query',
      {
        params: {
          where: "SHELTER_STATUS = 'Open'",
          outFields: 'SHELTER_NAME,ADDRESS,CITY,STATE,LATITUDE,LONGITUDE,CAPACITY,SHELTER_TYPE',
          f: 'json',
          returnGeometry: false,
        },
        timeout: 8000,
      }
    );
    return (res.data?.features || []).map(item => {
      const elLat = parseFloat(item.attributes.LATITUDE);
      const elLng = parseFloat(item.attributes.LONGITUDE);
      if (!elLat || !elLng) return null;
      const dist = haversine(lat, lng, elLat, elLng);
      if (dist > radiusKm) return null;
      return {
        id: `fema-${elLat}-${elLng}`,
        name: item.attributes.SHELTER_NAME || 'FEMA Shelter',
        lat: elLat, lng: elLng, type: 'shelter',
        address: [item.attributes.ADDRESS, item.attributes.CITY, item.attributes.STATE].filter(Boolean).join(', '),
        capacity: item.attributes.CAPACITY || null,
        source: 'FEMA/Red Cross',
        distance_km: Math.round(dist * 10) / 10,
      };
    }).filter(Boolean);
  } catch { return []; }
}

async function queryOSM(lat, lng, radiusKm) {
  const radiusM = Math.min(radiusKm * 1000, 500000);
  const timeout = 10; // Fast-fail so we quickly try next mirror
  
  // High-performance Regex syntax combined NWR request
  const query = `[out:json][timeout:${timeout}];(nwr["amenity"~"^(shelter|hospital|clinic|doctors|nursing_home|social_facility|police|fire_station|pharmacy)$"](around:${radiusM},${lat},${lng}););out center 200;`;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await axios.post(
        endpoint,
        `data=${encodeURIComponent(query)}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 12000 }
      );
      // If we got HTML back, this endpoint is rate-limited, try next
      if (typeof res.data === 'string' && res.data.includes('<html')) continue;
      const elements = res.data?.elements || [];
      if (elements.length === 0 && res.data?.remark) continue; // Out of quota
      const typeMap = {
        shelter:'shelter', hospital:'hospital', clinic:'clinic', doctors:'clinic',
        nursing_home:'nursing_home', social_facility:'shelter',
        police:'police', fire_station:'fire_station', pharmacy:'pharmacy',
      };
      return elements.map(el => {
        const elLat = el.lat ?? el.center?.lat;
        const elLng = el.lon ?? el.center?.lon;
        if (!elLat || !elLng) return null;
        const amenity = el.tags?.amenity || 'shelter';
        return {
          id: `osm-${el.id}`,
          name: el.tags?.name || null,
          lat: elLat, lng: elLng,
          type: typeMap[amenity] || 'shelter',
          address: el.tags?.['addr:street'] || el.tags?.['addr:full'] || null,
          capacity: null,
          source: 'OpenStreetMap',
          distance_km: Math.round(haversine(lat, lng, elLat, elLng) * 10) / 10,
        };
      }).filter(Boolean).sort((a, b) => a.distance_km - b.distance_km);
    } catch (err) {
      console.warn(`Overpass endpoint ${endpoint} failed:`, err.message);
      continue;
    }
  }
  return [];
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

module.exports = { queryNearby };