import { useState, useEffect } from 'react';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const TICKER_ITEMS = [
  'Hurricane Maya — Category 4 — Evacuation ordered for coastal zones',
  'Wildfire CA-47 — 15,240 acres — 35% contained — Updated 4 min ago',
  'Flash Flood Warning — Mumbai Region — 12 districts affected',
];

// ── TopBar ──────────────────────────────────────────────────────
function TopBar({ onDarkToggle, darkMode }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TICKER_ITEMS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: 'var(--topbar-bg)', borderBottom: '1px solid var(--topbar-border)', transition: 'background 0.4s ease' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0.45rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, overflow: 'hidden' }}>
          <span style={{ background: '#D32F2F', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 3, whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
            ● ACTIVE ALERTS: 3
          </span>
          <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--topbar-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.4s ease' }}>
            {TICKER_ITEMS[idx]}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', whiteSpace: 'nowrap' }}>
          <select style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.78rem', borderRadius: 4, background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-active)' }}>
            <option>English</option><option>Hindi</option><option>Spanish</option>
          </select>
          {/* Dark mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <i className="fa-solid fa-sun" style={{ fontSize: '0.75rem', color: 'var(--topbar-text)', opacity: darkMode ? 0.4 : 1, transition: 'opacity 0.3s' }}></i>
            <button className={`theme-toggle ${darkMode ? 'active' : ''}`} onClick={onDarkToggle} title="Toggle Dark Mode" aria-label="Toggle dark mode" />
            <i className="fa-solid fa-moon" style={{ fontSize: '0.75rem', color: 'var(--topbar-text)', opacity: darkMode ? 1 : 0.4, transition: 'opacity 0.3s' }}></i>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--topbar-text)', marginLeft: '0.2rem' }}>
              {darkMode ? 'Dark' : 'Light'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


// ── Navbar ──────────────────────────────────────────────────────
function Navbar({ onLoginClick, onRegisterClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const navLinks = ['Dashboard', 'Alerts', 'Resources', 'Preparedness', 'About'];
  return (
    <nav style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 100, boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: 62, gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <i className="fa-solid fa-shield-halved" style={{ color: 'var(--color-primary)', fontSize: '1.4rem' }}></i>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', letterSpacing: '0.06em' }}>SURAKSHAYAN</span>
        </div>
        <div style={{ display: 'flex', gap: '0.1rem', flex: 1, justifyContent: 'center' }} className="desktop-nav">
          {navLinks.map(l => (
            <a key={l} href="#" style={{ padding: '0.4rem 0.8rem', fontSize: '0.88rem', color: 'var(--nav-link)', borderRadius: 6, fontWeight: 500, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = 'var(--bg-section)'; e.target.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = 'var(--nav-link)'; }}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
          <button className="btn-modern" onClick={onLoginClick} style={{ background: 'none', border: 'none', fontSize: '0.88rem', color: 'var(--color-primary)', fontWeight: 600, padding: '0.4rem 0.6rem' }}>
            Sign In
          </button>
          <button className="btn-modern" onClick={onRegisterClick} style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.45rem 1.2rem', fontSize: '0.85rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}>
            Emergency Login
          </button>
        </div>
        <button onClick={() => setMenuOpen(o => !o)} style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--text-primary)' }} className="hamburger">
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>
      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--nav-bg)', padding: '0.5rem 1.5rem 1rem' }}>
          {navLinks.map(l => (
            <a key={l} href="#" style={{ display: 'block', padding: '0.6rem 0', fontSize: '0.95rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>{l}</a>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button onClick={onLoginClick} style={{ flex: 1, background: 'none', border: '1px solid var(--color-primary)', borderRadius: 6, padding: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}>Sign In</button>
            <button onClick={onRegisterClick} style={{ flex: 1, background: 'var(--color-primary)', border: 'none', borderRadius: 6, padding: '0.5rem', color: '#fff', fontWeight: 600 }}>Emergency Login</button>
          </div>
        </div>
      )}
    </nav>
  );
}


// ── Hero ─────────────────────────────────────────────────────────
function Hero({ onLoginClick }) {
  const pins = [
    { top: '30%', left: '22%', color: '#EF4444', label: 'Hurricane' },
    { top: '48%', left: '15%', color: '#F59E0B', label: 'Wildfire' },
    { top: '38%', left: '72%', color: '#3B82F6', label: 'Flood' },
  ];
  return (
    <section style={{ background: 'var(--hero-bg)', borderBottom: '1px solid var(--hero-border)', transition: 'background 0.4s ease' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Left */}
        <div style={{ flex: '1 1 340px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-section)', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: '0.3rem 0.9rem', marginBottom: '1.5rem' }}>
            <span className="animate-pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.04em' }}>SYSTEM OPERATIONAL — 98.5% UPTIME</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1.1rem', letterSpacing: '-0.02em' }}>
            Protecting Communities<br />
            <span style={{ color: 'var(--color-primary)' }}>Before Disaster Strikes</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 480, lineHeight: 1.7 }}>
            Official emergency coordination platform. Real-time alerts, evacuation orders, and resource management for responders and civilians.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.25rem' }} className="animate-fade-in delay-200">
            <button className="btn-modern" onClick={onLoginClick} style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem 1.6rem', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
              <i className="fa-solid fa-gauge-high" style={{ marginRight: '0.5rem' }}></i>View Live Dashboard
            </button>
            <button className="btn-modern" style={{ background: 'transparent', color: 'var(--color-critical)', border: '2px solid var(--color-critical)', borderRadius: 10, padding: '0.75rem 1.6rem', fontWeight: 700, fontSize: '0.95rem' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-critical)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-critical)'; }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.5rem' }}></i>Report Emergency
            </button>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[['fa-building-columns', 'Operated by Surakshayan'], ['fa-clock', '24/7 Monitoring'], ['fa-server', '98.5% Uptime']].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <i className={`fa-solid ${icon}`} style={{ color: 'var(--color-primary)' }}></i>{text}
              </div>
            ))}
          </div>
        </div>
        {/* Right — Map Widget */}
        <div style={{ flex: '1 1 300px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-card)', transition: 'background 0.4s ease' }}>
          <div style={{ background: 'var(--color-navy)', padding: '0.7rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
              <i className="fa-solid fa-map-location-dot" style={{ marginRight: '0.4rem', color: 'var(--color-primary)' }}></i>Active Incident Map
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
              <span className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>Live
            </span>
          </div>
          <div style={{ position: 'relative', height: 260, background: 'var(--map-bg)', overflow: 'hidden', transition: 'background 0.4s ease' }}>
            <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%', opacity: 0.3 }}>
              <rect width="800" height="400" fill="var(--map-bg)" />
              <ellipse cx="200" cy="200" rx="120" ry="140" fill="#a8c4b8" />
              <ellipse cx="420" cy="180" rx="160" ry="120" fill="#a8c4b8" />
              <ellipse cx="620" cy="200" rx="100" ry="130" fill="#a8c4b8" />
              <ellipse cx="680" cy="300" rx="60" ry="50" fill="#a8c4b8" />
            </svg>
            {pins.map((pin, i) => (
              <div key={i} title={pin.label} className="animate-float" style={{ animationDelay: `${i * 400}ms`, position: 'absolute', top: pin.top, left: pin.left, transform: 'translate(-50%,-100%)' }}>
                <i className="fa-solid fa-location-dot" style={{ color: pin.color, fontSize: '1.6rem', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}></i>
              </div>
            ))}
          </div>
          <div style={{ padding: '0.65rem 1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', transition: 'background 0.4s ease' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[['#EF4444', 'Hurricane'], ['#F59E0B', 'Wildfire'], ['#3B82F6', 'Flood']].map(([c, l]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }}></span>{l}
                </span>
              ))}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Updated 2 min ago</span>
          </div>
        </div>
      </div>
    </section>
  );
}


// ── Active Alerts ────────────────────────────────────────────────
const ALERTS = [
  { color: '#EF4444', badge: 'CRITICAL', badgeBg: '#EF4444', icon: 'fa-hurricane', title: 'Hurricane Maya', meta: 'Category 4 — ETA 18 hours', detail: 'Evacuation ordered for all coastal zones within 50km. Shelters open at designated centers.', status: 'Evacuation Ordered', source: 'National Hurricane Center', updated: '8 minutes ago' },
  { color: '#F59E0B', badge: 'HIGH', badgeBg: '#D97706', icon: 'fa-fire', title: 'Wildfire CA-47', meta: '15,240 acres — 35% contained', detail: 'Air quality index critical. Residents advised to stay indoors. Firefighting crews deployed.', status: 'Active Response', source: 'CAL FIRE', updated: '4 minutes ago' },
  { color: '#3B82F6', badge: 'MODERATE', badgeBg: '#2563EB', icon: 'fa-water', title: 'Flash Flood Warning', meta: 'Mumbai Region — 12 districts', detail: 'Heavy rainfall expected for next 6 hours. Avoid low-lying areas and river banks.', status: 'Watch Active', source: 'India Meteorological Dept', updated: '12 minutes ago' },
];

function ActiveAlerts() {
  const [expanded, setExpanded] = useState(null);
  return (
    <section style={{ background: 'var(--alert-section-bg)', borderBottom: '1px solid var(--border-subtle)', padding: '3.5rem 0', transition: 'background 0.4s ease' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ color: 'var(--color-critical)' }}></i>
            Current Emergency Declarations
          </h2>
          <a href="#" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View Archive <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem' }}></i>
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {ALERTS.map((alert, i) => (
            <div key={i} onClick={() => setExpanded(expanded === i ? null : i)}
              className="card-hover animate-slide-up"
              style={{ animationDelay: `${i * 150}ms`, background: 'var(--bg-card)', borderLeft: `4px solid ${alert.color}`, borderRadius: 10, padding: '1.25rem', cursor: 'pointer', border: `1px solid var(--card-border)`, borderLeft: `4px solid ${alert.color}`, transition: 'background 0.4s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className={`fa-solid ${alert.icon}`} style={{ color: alert.color, fontSize: '1rem' }}></i>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{alert.title}</span>
                </div>
                <span style={{ background: alert.badgeBg, color: '#fff', fontSize: '0.66rem', fontWeight: 800, padding: '0.18rem 0.55rem', borderRadius: 4, letterSpacing: '0.06em' }}>{alert.badge}</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{alert.meta}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: alert.color }}>{alert.status}</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Updated {alert.updated}</span>
              </div>
              {expanded === i && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--expanded-border)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--expanded-text)', marginBottom: '0.5rem', lineHeight: 1.6 }}>{alert.detail}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Source: {alert.source}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ── Quick Actions ────────────────────────────────────────────────
const ACTIONS = [
  { icon: 'fa-list-check', title: 'Make a Plan', desc: 'Build a household emergency plan for your family and community.', color: '#2563EB' },
  { icon: 'fa-kit-medical', title: 'Build a Kit', desc: 'Prepare a 72-hour emergency supply kit with essential items.', color: '#10B981' },
  { icon: 'fa-house-chimney', title: 'Find Shelter', desc: 'Locate nearest designated emergency shelters in your area.', color: '#F59E0B' },
  { icon: 'fa-road-barrier', title: 'Road Closures', desc: 'View current road closures and alternate evacuation routes.', color: '#EF4444' },
];

function QuickActions({ onLoginClick }) {
  return (
    <section style={{ background: 'var(--hero-bg)', borderBottom: '1px solid var(--border-subtle)', padding: '3.5rem 0', transition: 'background 0.4s ease' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fa-solid fa-bolt" style={{ color: 'var(--color-warning)' }}></i>Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {ACTIONS.map((a, i) => (
            <button key={i} onClick={onLoginClick}
              className="card-hover animate-slide-up"
              style={{ animationDelay: `${i * 100}ms`, background: 'var(--bg-card)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '1.5rem', textAlign: 'left', transition: 'background 0.4s ease' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <i className={`fa-solid ${a.icon}`} style={{ color: a.color, fontSize: '1.25rem' }}></i>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{a.title}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.1rem', lineHeight: 1.6 }}>{a.desc}</div>
              <span style={{ fontSize: '0.84rem', color: a.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Learn more <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.72rem' }}></i>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Stats Bar ────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { icon: 'fa-users', value: '2.4M+', label: 'People Protected' },
    { icon: 'fa-bell', value: '18,500+', label: 'Alerts Sent' },
    { icon: 'fa-house-chimney-medical', value: '3,200+', label: 'Shelters Mapped' },
    { icon: 'fa-clock-rotate-left', value: '< 2 min', label: 'Avg Alert Time' },
  ];
  return (
    <section style={{ background: 'var(--color-primary)', padding: '2.5rem 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms`, textAlign: 'center' }}>
            <i className={`fa-solid ${s.icon}`} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.4rem', marginBottom: '0.5rem', display: 'block' }}></i>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.3rem', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


// ── Footer ───────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: 'var(--footer-bg)', color: 'var(--footer-text)', padding: '2.5rem 0 1.5rem', transition: 'background 0.4s ease' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <i className="fa-solid fa-shield-halved" style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}></i>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.06em' }}>SURAKSHAYAN</span>
            </div>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--footer-text)' }}>Official emergency management platform. Operated 24/7 by certified emergency coordinators.</p>
          </div>
          {[['Platform', ['Dashboard', 'Live Alerts', 'Incident Map', 'Resources']], ['Support', ['Help Center', 'Contact Us', 'Accessibility', 'Privacy Policy']]].map(([title, links]) => (
            <div key={title} style={{ flex: '1 1 140px' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{title}</div>
              {links.map(l => <div key={l} style={{ marginBottom: '0.45rem' }}><a href="#" style={{ color: 'var(--footer-link)', fontSize: '0.84rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'var(--footer-link)'}>{l}</a></div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--footer-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem' }}>© 2026 Surakshayan Emergency Management Platform. All rights reserved.</span>
          <span style={{ fontSize: '0.78rem' }}>This is an official emergency management system. Unauthorized use is prohibited.</span>
        </div>
      </div>
    </footer>
  );
}


// ── Auth Modal ───────────────────────────────────────────────────
function AuthModal({ tab, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState(tab || 'login');
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => { setActiveTab(tab || 'login'); }, [tab]);
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); setServerError(''); };

  const validateLogin = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };
  const validateRegister = () => {
    const e = {};
    if (!form.firstName) e.firstName = 'Required';
    if (!form.lastName) e.lastName = 'Required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.mobile) e.mobile = 'Mobile is required for alerts';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.userType) e.userType = 'Please select a user type';
    if (!form.terms) e.terms = 'You must accept the terms';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = activeTab === 'login' ? validateLogin() : validateRegister();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (activeTab === 'login') {
        const res = await axios.post(`${SERVER_URL}/api/users/login`, { email: form.email, password: form.password });
        localStorage.setItem('guardian_token', res.data.token);
        localStorage.setItem('guardian_user', JSON.stringify(res.data.user));
        onSuccess(res.data.user);
      } else {
        await axios.post(`${SERVER_URL}/api/users/register`, { firstName: form.firstName, lastName: form.lastName, email: form.email, mobile: form.mobile, password: form.password, userType: form.userType });
        const res = await axios.post(`${SERVER_URL}/api/users/login`, { email: form.email, password: form.password });
        localStorage.setItem('guardian_token', res.data.token);
        localStorage.setItem('guardian_user', JSON.stringify(res.data.user));
        onSuccess(res.data.user);
      }
    } catch (err) {
      setServerError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '0.9rem' }}>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--label-color)', marginBottom: '0.3rem' }}>{label}</label>
      <input type={type} value={form[key] || ''} onChange={e => set(key, e.target.value)} placeholder={placeholder}
        style={{ borderColor: errors[key] ? 'var(--color-critical)' : undefined, background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
      {errors[key] && <span style={{ fontSize: '0.75rem', color: 'var(--color-critical)', marginTop: '0.2rem', display: 'block' }}>{errors[key]}</span>}
    </div>
  );

  return (
    <div className="animate-fade-in" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'var(--modal-overlay)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} className="animate-slide-up" style={{ background: 'var(--modal-bg)', borderRadius: 14, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', transition: 'background 0.4s ease' }}>
        <div style={{ padding: '1.25rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-shield-halved" style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}></i>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem', letterSpacing: '0.05em' }}>SURAKSHAYAN</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.1rem', color: 'var(--text-secondary)', padding: '0.25rem' }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', margin: '1rem 1.5rem 0', gap: '1.5rem' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setActiveTab(t); setErrors({}); setServerError(''); }}
              style={{ background: 'none', border: 'none', padding: '0.5rem 0', fontSize: '0.9rem', fontWeight: 700, color: activeTab === t ? 'var(--color-primary)' : 'var(--text-secondary)', borderBottom: activeTab === t ? '2px solid var(--color-primary)' : '2px solid transparent', marginBottom: -1, transition: 'all 0.2s' }}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem' }}>
          {serverError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '0.6rem 0.75rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-critical)' }}>
              {serverError}
            </div>
          )}
          {activeTab === 'login' ? (
            <>
              {field('email', 'Email Address', 'email', 'you@example.com')}
              {field('password', 'Password', 'password')}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--label-color)' }}>
                  <input type="checkbox" style={{ width: 'auto' }} onChange={e => set('remember', e.target.checked)} /> Keep me signed in
                </label>
                <a href="#" style={{ fontSize: '0.82rem', color: 'var(--color-primary)' }}>Forgot password?</a>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
                {field('firstName', 'First Name')}
                {field('lastName', 'Last Name')}
              </div>
              {field('email', 'Email Address', 'email', 'you@example.com')}
              {field('mobile', 'Mobile Number (required for alerts)', 'tel', '+1 555 000 0000')}
              {field('password', 'Password', 'password')}
              {field('confirm', 'Confirm Password', 'password')}
              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--label-color)', marginBottom: '0.3rem' }}>User Type</label>
                <select value={form.userType || ''} onChange={e => set('userType', e.target.value)} style={{ borderColor: errors.userType ? 'var(--color-critical)' : undefined }}>
                  <option value="">Select user type</option>
                  <option value="civilian">Civilian</option>
                  <option value="responder">First Responder</option>
                  <option value="agency">Government Agency</option>
                  <option value="ngo">NGO / Relief Organization</option>
                </select>
                {errors.userType && <span style={{ fontSize: '0.75rem', color: 'var(--color-critical)', marginTop: '0.2rem', display: 'block' }}>{errors.userType}</span>}
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--label-color)', marginBottom: '1.25rem' }}>
                <input type="checkbox" style={{ width: 'auto', marginTop: 2 }} onChange={e => set('terms', e.target.checked)} />
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
              </label>
              {errors.terms && <span style={{ fontSize: '0.75rem', color: 'var(--color-critical)', display: 'block', marginTop: '-1rem', marginBottom: '0.75rem' }}>{errors.terms}</span>}
            </>
          )}
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: loading ? 'var(--text-muted)' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem', fontWeight: 700, fontSize: '0.95rem', transition: 'background 0.2s', boxShadow: loading ? 'none' : '0 4px 12px rgba(37,99,235,0.25)' }}>
            {loading ? 'Please wait...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div style={{ padding: '0.75rem 1.5rem 1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-lock" style={{ marginRight: '0.3rem' }}></i>
            This is a secure government system. Unauthorized use is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── HomePage (main export) ───────────────────────────────────────
export default function HomePage({ onLogin }) {
  const [modal, setModal] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('surakshayan_theme') === 'dark' ||
      (!localStorage.getItem('surakshayan_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('surakshayan_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('surakshayan_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const fn = () => {
      if (window.location.hash === '#login') setModal('login');
      else if (window.location.hash === '#register') setModal('register');
    };
    fn();
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  }, []);

  const openModal = (tab) => { setModal(tab); window.location.hash = tab; };
  const closeModal = () => { setModal(null); window.location.hash = ''; };
  const handleSuccess = (user) => { closeModal(); onLogin(user); };

  return (
    <div className="bg-mesh-flow min-h-screen">
      <TopBar onDarkToggle={() => setDarkMode(d => !d)} darkMode={darkMode} />
      <Navbar onLoginClick={() => openModal('login')} onRegisterClick={() => openModal('register')} />
      <main>
        <Hero onLoginClick={() => openModal('login')} />
        <ActiveAlerts />
        <StatsBar />
        <QuickActions onLoginClick={() => openModal('login')} />
      </main>
      <Footer />
      {modal && <AuthModal tab={modal} onClose={closeModal} onSuccess={handleSuccess} />}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </div>
  );
}
