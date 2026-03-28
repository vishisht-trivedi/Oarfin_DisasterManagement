import { useEffect, useState } from "react";
import axios from "axios";
import "./NewsArticles.css";

// Uses GNews public API (free tier, no key needed for basic use)
// Falls back to GDACS event list as disaster news source
const GDACS_NEWS_URL =
  "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?limit=30&eventlist=EQ,TC,FL,VO,DR,WF&alertlevel=Red,Orange,Green";

const RELIEFWEB_URL =
  "https://api.reliefweb.int/v1/reports?appname=oarfin&filter[field]=disaster&limit=20&fields[include][]=title&fields[include][]=body-html&fields[include][]=url&fields[include][]=date&fields[include][]=source&sort[]=date:desc";

const EVENT_LABELS = { EQ: "Earthquake", FL: "Flood", TC: "Cyclone", VO: "Volcano", WF: "Wildfire", DR: "Drought" };
const ALERT_COLORS = { Red: "#D32F2F", Orange: "#E65100", Green: "#2E7D32" };

export default function NewsArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState("gdacs");

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (source === "gdacs") {
      axios
        .get(GDACS_NEWS_URL)
        .then((res) => {
          const features = res.data?.features || [];
          const items = features.map((f) => {
            const p = f.properties || {};
            return {
              id: p.eventid || Math.random(),
              title: p.htmldescription || p.title || "Unknown Event",
              content: `${EVENT_LABELS[p.eventtype] || p.eventtype} — Alert level: ${p.alertlevel || "N/A"}. ${p.description || ""}`.trim(),
              url: `https://www.gdacs.org/report.aspx?eventtype=${p.eventtype}&eventid=${p.eventid}`,
              source: "GDACS",
              alertLevel: p.alertlevel || "Green",
              type: p.eventtype,
              date: p.fromdate || p.eventdate || "",
            };
          });
          setArticles(items);
        })
        .catch(() => setError("Failed to load GDACS news."))
        .finally(() => setLoading(false));
    } else {
      axios
        .get(RELIEFWEB_URL)
        .then((res) => {
          const data = res.data?.data || [];
          const items = data.map((item) => ({
            id: item.id,
            title: item.fields?.title || "Untitled",
            content: item.fields?.["body-html"]?.replace(/<[^>]+>/g, "").slice(0, 300) || "No content available.",
            url: item.fields?.url || "#",
            source: item.fields?.source?.[0]?.name || "ReliefWeb",
            alertLevel: "Orange",
            date: item.fields?.date?.created || "",
          }));
          setArticles(items);
        })
        .catch(() => setError("Failed to load ReliefWeb news."))
        .finally(() => setLoading(false));
    }
  }, [source]);

  if (loading) return (
    <div className="news-loading">
      <div className="news-spinner"></div>
      <p>Loading disaster news...</p>
    </div>
  );

  if (error) return (
    <div className="news-error">
      <p>{error}</p>
      <button onClick={() => setSource(source)} className="retry-button">Retry</button>
    </div>
  );

  return (
    <div className="news-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <h2 className="news-header" style={{ margin: 0 }}>Live Disaster News</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[["gdacs", "GDACS Events"], ["reliefweb", "ReliefWeb Reports"]].map(([val, label]) => (
            <button key={val} onClick={() => setSource(val)}
              style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem", borderRadius: 4, border: `1px solid ${source === val ? "#005EA2" : "#BDBDBD"}`, background: source === val ? "#005EA2" : "#fff", color: source === val ? "#fff" : "#424242", fontWeight: source === val ? 700 : 400, cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="news-grid">
        {articles.map((article) => {
          const color = ALERT_COLORS[article.alertLevel] || "#616161";
          const date = article.date ? new Date(article.date).toLocaleDateString() : "";
          return (
            <article key={article.id} className="news-card" style={{ borderLeft: `4px solid ${color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span className="news-source-tag">{article.source}</span>
                {article.alertLevel && (
                  <span style={{ background: color, color: "#fff", fontSize: "0.65rem", fontWeight: 800, padding: "0.1rem 0.4rem", borderRadius: 2 }}>
                    {article.alertLevel.toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="news-title">{article.title}</h3>
              <p className="news-content">
                {article.content.length > 200 ? `${article.content.slice(0, 200)}...` : article.content}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
                  Read Full Story <span className="external-icon">↗</span>
                </a>
                {date && <span style={{ fontSize: "0.72rem", color: "#9E9E9E" }}>{date}</span>}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
