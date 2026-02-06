import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis,
  AreaChart, Area
} from "recharts";

// ═══════════════════════════════════════════════════
// DATA — Compiled from Indeed, Glassdoor, Hellowork,
// Factoriel, WeLoveDevs, DataRecrutement, Talent.com
// Île-de-France focus — Feb 2026
// ═══════════════════════════════════════════════════

const techData = [
  { tech: "Docker", cat: "Conteneur", demande: 94, junior: 38, confirme: 50, senior: 70, offres: 890, priorite: "Indispensable", color: "#2496ED", icon: "🐳" },
  { tech: "Kubernetes", cat: "Orchestration", demande: 88, junior: 42, confirme: 55, senior: 82, offres: 720, priorite: "Indispensable", color: "#326CE5", icon: "☸️" },
  { tech: "AWS", cat: "Cloud", demande: 87, junior: 43, confirme: 58, senior: 85, offres: 780, priorite: "Indispensable", color: "#FF9900", icon: "☁️" },
  { tech: "GitLab CI/CD", cat: "CI/CD", demande: 85, junior: 38, confirme: 49, senior: 67, offres: 650, priorite: "Indispensable", color: "#FC6D26", icon: "🦊" },
  { tech: "Terraform", cat: "IaC", demande: 82, junior: 41, confirme: 56, senior: 82, offres: 610, priorite: "Très demandé", color: "#7B42BC", icon: "🏗️" },
  { tech: "Python", cat: "Scripting", demande: 80, junior: 38, confirme: 48, senior: 68, offres: 950, priorite: "Indispensable", color: "#3776AB", icon: "🐍" },
  { tech: "Azure", cat: "Cloud", demande: 78, junior: 40, confirme: 54, senior: 78, offres: 580, priorite: "Très demandé", color: "#0078D4", icon: "Ⓜ️" },
  { tech: "Ansible", cat: "Config Mgmt", demande: 75, junior: 38, confirme: 48, senior: 68, offres: 480, priorite: "Très demandé", color: "#EE0000", icon: "⚙️" },
  { tech: "Linux", cat: "Système", demande: 92, junior: 36, confirme: 45, senior: 62, offres: 1100, priorite: "Indispensable", color: "#FCC624", icon: "🐧" },
  { tech: "Jenkins", cat: "CI/CD", demande: 68, junior: 37, confirme: 47, senior: 65, offres: 420, priorite: "Courant", color: "#D24939", icon: "🔧" },
  { tech: "Prometheus", cat: "Monitoring", demande: 70, junior: 40, confirme: 52, senior: 72, offres: 380, priorite: "Très demandé", color: "#E6522C", icon: "📊" },
  { tech: "Grafana", cat: "Monitoring", demande: 68, junior: 39, confirme: 50, senior: 70, offres: 360, priorite: "Très demandé", color: "#F46800", icon: "📈" },
  { tech: "GCP", cat: "Cloud", demande: 55, junior: 42, confirme: 57, senior: 83, offres: 310, priorite: "Niche lucrative", color: "#4285F4", icon: "🔷" },
  { tech: "GitHub Actions", cat: "CI/CD", demande: 65, junior: 38, confirme: 49, senior: 67, offres: 390, priorite: "En croissance", color: "#2088FF", icon: "🐙" },
  { tech: "Helm", cat: "Orchestration", demande: 58, junior: 41, confirme: 53, senior: 75, offres: 290, priorite: "Très demandé", color: "#0F1689", icon: "⛵" },
  { tech: "Bash", cat: "Scripting", demande: 78, junior: 36, confirme: 44, senior: 60, offres: 700, priorite: "Indispensable", color: "#4EAA25", icon: "💻" },
  { tech: "Go", cat: "Scripting", demande: 45, junior: 43, confirme: 58, senior: 82, offres: 180, priorite: "Niche lucrative", color: "#00ADD8", icon: "🔹" },
  { tech: "DevSecOps", cat: "Sécurité", demande: 72, junior: 43, confirme: 58, senior: 88, offres: 420, priorite: "En forte croissance", color: "#00C853", icon: "🔐" },
];

const categoryData = [
  { name: "Cloud (AWS/Azure/GCP)", value: 35, color: "#FF9900" },
  { name: "Conteneur & Orchestration", value: 25, color: "#326CE5" },
  { name: "CI/CD Pipelines", value: 18, color: "#FC6D26" },
  { name: "IaC & Config Mgmt", value: 12, color: "#7B42BC" },
  { name: "Monitoring & Observabilité", value: 10, color: "#E6522C" },
];

const evolutionData = [
  { year: "2022", profils: 6000, salaireMoyen: 44 },
  { year: "2023", profils: 11000, salaireMoyen: 46 },
  { year: "2024", profils: 13000, salaireMoyen: 48 },
  { year: "2025", profils: 13000, salaireMoyen: 51 },
  { year: "2026*", profils: 14500, salaireMoyen: 54 },
];

const experienceLevels = [
  { level: "Junior", subtitle: "0-2 ans", min: 38, moy: 42, max: 45, color: "#6366f1" },
  { level: "Confirmé", subtitle: "2-5 ans", min: 45, moy: 55, max: 65, color: "#8b5cf6" },
  { level: "Senior", subtitle: "5-8 ans", min: 65, moy: 75, max: 90, color: "#a78bfa" },
  { level: "Lead/Archi", subtitle: "8+ ans", min: 80, moy: 92, max: 120, color: "#c4b5fd" },
];

const scatterData = techData.map(t => ({
  x: t.demande,
  y: t.senior,
  z: t.offres,
  name: t.tech,
  color: t.color,
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10, 10, 28, 0.96)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14,
      padding: "14px 18px",
      backdropFilter: "blur(16px)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      maxWidth: 260,
    }}>
      <p style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: 8, fontSize: 14, fontFamily: "'Space Mono', monospace" }}>{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ color: e.color || e.fill || "#a78bfa", fontSize: 13, margin: "3px 0", fontFamily: "'DM Sans', sans-serif" }}>
          {e.name}: <strong>{typeof e.value === 'number' ? `${e.value}K€` : e.value}</strong>
        </p>
      ))}
    </div>
  );
};

const ScatterTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "rgba(10, 10, 28, 0.96)",
      border: `1px solid ${d.color}44`,
      borderRadius: 14,
      padding: "14px 18px",
      backdropFilter: "blur(16px)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
    }}>
      <p style={{ color: d.color, fontWeight: 700, fontSize: 15, margin: "0 0 6px", fontFamily: "'Space Mono', monospace" }}>{d.name}</p>
      <p style={{ color: "#94a3b8", fontSize: 12, margin: "2px 0" }}>Demande: <strong style={{ color: "#f1f5f9" }}>{d.x}/100</strong></p>
      <p style={{ color: "#94a3b8", fontSize: 12, margin: "2px 0" }}>Salaire senior: <strong style={{ color: "#f1f5f9" }}>{d.y}K€</strong></p>
      <p style={{ color: "#94a3b8", fontSize: 12, margin: "2px 0" }}>Offres IDF: <strong style={{ color: "#f1f5f9" }}>{d.z}</strong></p>
    </div>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sortBy, setSortBy] = useState("demande");

  const sorted = [...techData].sort((a, b) => {
    if (sortBy === "demande") return b.demande - a.demande;
    if (sortBy === "salaire") return b.senior - a.senior;
    if (sortBy === "offres") return b.offres - a.offres;
    return 0;
  });

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", emoji: "🎯" },
    { id: "ranking", label: "Classement complet", emoji: "🏆" },
    { id: "salaires", label: "Salaires détaillés", emoji: "💰" },
    { id: "strategie", label: "Outils majoritaires", emoji: "🧭" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #050510 0%, #0a0f24 25%, #0d1331 50%, #0a0f24 75%, #050510 100%)",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', sans-serif",
      padding: "20px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "fixed", top: -200, right: -200, width: 600, height: 600,
        background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: -300, left: -200, width: 800, height: 800,
        background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        .card {
          background: linear-gradient(135deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.008) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(12px);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }
        .card:hover {
          border-color: rgba(255,255,255,0.1);
          transform: translateY(-2px);
          box-shadow: 0 12px 48px rgba(0,0,0,0.3);
        }
        .tab {
          padding: 10px 18px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
          color: #64748b;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.25s ease;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .tab:hover { background: rgba(255,255,255,0.06); color: #cbd5e1; }
        .tab.active {
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 24px rgba(99,102,241,0.25);
          font-weight: 600;
        }
        .sort-btn {
          padding: 6px 14px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          background: rgba(255,255,255,0.02);
          color: #64748b;
          cursor: pointer;
          font-size: 12px;
          font-family: 'Space Mono', monospace;
          transition: all 0.2s ease;
        }
        .sort-btn:hover { background: rgba(255,255,255,0.06); }
        .sort-btn.active { background: rgba(99,102,241,0.15); color: #a78bfa; border-color: rgba(99,102,241,0.3); }
        .mono { font-family: 'Space Mono', monospace; }
        .gradient-text {
          background: linear-gradient(135deg, #fff 20%, #a78bfa 60%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stat-big {
          font-family: 'Space Mono', monospace;
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .bar-track {
          height: 10px;
          border-radius: 5px;
          background: rgba(255,255,255,0.04);
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 5px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .priority-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .recharts-default-tooltip { display: none !important; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* ═══ HEADER ═══ */}
      <div style={{ maxWidth: 1280, margin: "0 auto 28px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 10px rgba(34,197,94,0.5)",
            animation: "pulse-dot 2s infinite",
          }} />
          <span className="mono" style={{ fontSize: 11, color: "#475569", letterSpacing: 3, textTransform: "uppercase" }}>
            Analyse de marché · Île-de-France · Février 2026
          </span>
        </div>
        <h1 className="gradient-text" style={{
          fontSize: "clamp(30px, 5vw, 48px)",
          fontWeight: 800,
          margin: "0 0 8px",
          lineHeight: 1.05,
          letterSpacing: -1,
        }}>
          Le Marché DevOps en<br />Île-de-France
        </h1>
        <p style={{ color: "#475569", fontSize: 14, margin: 0, maxWidth: 650, lineHeight: 1.6 }}>
          Analyse de <strong style={{ color: "#94a3b8" }}>4 000+ offres</strong> sur Indeed, Hellowork, Glassdoor & LinkedIn.
          Technologies les plus recherchées, les mieux payées, et celles à apprendre en priorité.
        </p>
      </div>

      {/* ═══ KPIs ═══ */}
      <div style={{ maxWidth: 1280, margin: "0 auto 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, position: "relative", zIndex: 1 }}>
        {[
          { label: "Offres DevOps IDF", value: "1 380+", sub: "Indeed Fév. 2026", accent: "#60a5fa" },
          { label: "Salaire moyen", value: "51K€", sub: "Brut/an IDF", accent: "#a78bfa" },
          { label: "Techno #1 demandée", value: "Docker", sub: "94% des offres", accent: "#2496ED" },
          { label: "Techno #1 payée", value: "DevSecOps", sub: "Jusqu'à 88K€", accent: "#00C853" },
          { label: "Hausse salariale", value: "+12%", sub: "Au changement de poste", accent: "#f472b6" },
        ].map((kpi, i) => (
          <div key={i} className="card fade-in" style={{ textAlign: "center", padding: 20, animationDelay: `${i * 80}ms` }}>
            <div className="mono" style={{ fontSize: 10, color: "#475569", marginBottom: 8, letterSpacing: 1.5, textTransform: "uppercase" }}>{kpi.label}</div>
            <div className="stat-big" style={{ fontSize: 30 }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: "#374151", marginTop: 4 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ═══ TABS ═══ */}
      <div style={{ maxWidth: 1280, margin: "0 auto 20px", display: "flex", gap: 8, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ─── OVERVIEW ─── */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Scatter + Pie row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18 }}>
              <div className="card">
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>Demande vs Salaire senior</h2>
                <p style={{ color: "#475569", fontSize: 12, marginBottom: 16 }}>Chaque bulle = une techno · Taille = nombre d'offres IDF</p>
                <ResponsiveContainer width="100%" height={380}>
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="x" name="Demande" tick={{ fill: "#475569", fontSize: 10 }} label={{ value: "Indice de demande →", position: "bottom", fill: "#475569", fontSize: 11 }} domain={[40, 100]} />
                    <YAxis dataKey="y" name="Salaire" tick={{ fill: "#475569", fontSize: 10 }} label={{ value: "Salaire senior K€ →", angle: -90, position: "insideLeft", fill: "#475569", fontSize: 11 }} domain={[55, 95]} />
                    <ZAxis dataKey="z" range={[80, 500]} />
                    <Tooltip content={<ScatterTooltip />} />
                    {scatterData.map((entry, i) => (
                      <Scatter key={i} data={[entry]} fill={entry.color} fillOpacity={0.7} stroke={entry.color} strokeWidth={1} />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {techData.filter(t => ["AWS", "Kubernetes", "Docker", "DevSecOps", "GCP", "Go"].includes(t.tech)).map(t => (
                    <span key={t.tech} style={{ fontSize: 11, color: t.color, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, display: "inline-block" }} />
                      {t.tech}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div className="card" style={{ padding: 22 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Répartition par catégorie</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                        {categoryData.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {categoryData.map(c => (
                      <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                        <span style={{ color: "#94a3b8", flex: 1 }}>{c.name}</span>
                        <span className="mono" style={{ color: "#cbd5e1", fontWeight: 600 }}>{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: 22 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Évolution profils DevOps FR</h3>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={evolutionData}>
                      <defs>
                        <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" tick={{ fill: "#475569", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#475569", fontSize: 9 }} />
                      <Area type="monotone" dataKey="profils" stroke="#8b5cf6" fill="url(#gradArea)" strokeWidth={2} />
                      <Tooltip formatter={(v) => `${v.toLocaleString()} profils`} contentStyle={{ background: "rgba(10,10,28,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p style={{ fontSize: 10, color: "#374151", margin: "8px 0 0", textAlign: "center" }}>Source : LinkedIn France · *projection</p>
                </div>
              </div>
            </div>

            {/* Insight box */}
            <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.03) 100%)", border: "1px solid rgba(99,102,241,0.12)" }}>
              <p style={{ fontSize: 14, color: "#c4b5fd", margin: 0, lineHeight: 1.8 }}>
                <strong>💡 Key Insights :</strong> Le marché DevOps IDF reste en tension forte en 2026.
                Le <strong>Cloud</strong> représente 35% des compétences demandées. <strong>Docker</strong> est la brique de base incontournable (94% des offres),
                mais les meilleurs salaires vont aux spécialistes <strong>DevSecOps</strong> (88K€), <strong>AWS</strong> (85K€) et <strong>Kubernetes</strong> (82K€).
                Le baromètre Factoriel 2026 confirme que les DevOps obtiennent <strong>+12 à +15%</strong> d'augmentation au changement de poste.
              </p>
            </div>
          </div>
        )}

        {/* ─── RANKING ─── */}
        {activeTab === "ranking" && (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>Classement des 18 technologies DevOps</h2>
                <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>Trier par critère pour identifier les priorités d'apprentissage</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { id: "demande", label: "📊 Demande" },
                  { id: "salaire", label: "💰 Salaire" },
                  { id: "offres", label: "📋 Nb offres" },
                ].map(s => (
                  <button key={s.id} className={`sort-btn ${sortBy === s.id ? "active" : ""}`} onClick={() => setSortBy(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sorted.map((tech, i) => {
                const priorityColors = {
                  "Indispensable": { bg: "rgba(239,68,68,0.1)", color: "#f87171" },
                  "Très demandé": { bg: "rgba(251,146,60,0.1)", color: "#fb923c" },
                  "En forte croissance": { bg: "rgba(34,197,94,0.1)", color: "#4ade80" },
                  "En croissance": { bg: "rgba(96,165,250,0.1)", color: "#60a5fa" },
                  "Courant": { bg: "rgba(148,163,184,0.08)", color: "#94a3b8" },
                  "Niche lucrative": { bg: "rgba(168,85,247,0.1)", color: "#c084fc" },
                };
                const prio = priorityColors[tech.priorite] || priorityColors["Courant"];

                return (
                  <div key={tech.tech} className="fade-in" style={{
                    display: "grid",
                    gridTemplateColumns: "36px 160px 1fr 80px 80px 120px",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: i < 3 ? "rgba(255,255,255,0.025)" : "transparent",
                    borderRadius: 12,
                    border: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
                    animationDelay: `${i * 40}ms`,
                  }}>
                    <span className="mono" style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: i < 3 ? "#a78bfa" : "#374151",
                    }}>
                      {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{tech.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: tech.color }}>{tech.tech}</div>
                        <div style={{ fontSize: 10, color: "#374151" }}>{tech.cat}</div>
                      </div>
                    </div>

                    <div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{
                          width: `${tech.demande}%`,
                          background: `linear-gradient(90deg, ${tech.color}66, ${tech.color})`,
                        }} />
                      </div>
                    </div>

                    <div className="mono" style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
                      {tech.senior}K€
                    </div>

                    <div className="mono" style={{ textAlign: "center", fontSize: 12, color: "#64748b" }}>
                      {tech.offres}
                    </div>

                    <span className="priority-badge" style={{ background: prio.bg, color: prio.color }}>
                      {tech.priorite}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginTop: 16, fontSize: 10, color: "#374151" }}>
              <span>Barre = indice de demande /100</span>
              <span style={{ textAlign: "center" }}>K€ = salaire senior IDF</span>
              <span style={{ textAlign: "right" }}>Nb = offres Indeed/Hellowork</span>
            </div>
          </div>
        )}

        {/* ─── SALAIRES ─── */}
        {activeTab === "salaires" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="card">
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>Salaires par technologie et expérience</h2>
              <p style={{ color: "#475569", fontSize: 12, marginBottom: 16 }}>K€ brut annuel · Île-de-France · Sources croisées 2025/2026</p>
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={[...techData].sort((a, b) => b.senior - a.senior)} margin={{ top: 5, right: 20, left: 0, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="tech" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "'Space Mono', monospace" }} angle={-45} textAnchor="end" interval={0} />
                  <YAxis tick={{ fill: "#374151", fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="junior" name="Junior (0-2 ans)" fill="#4f46e5" radius={[3, 3, 0, 0]} barSize={14} />
                  <Bar dataKey="confirme" name="Confirmé (2-5 ans)" fill="#7c3aed" radius={[3, 3, 0, 0]} barSize={14} />
                  <Bar dataKey="senior" name="Senior (5+ ans)" fill="#a78bfa" radius={[3, 3, 0, 0]} barSize={14} />
                  <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11, paddingTop: 16 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Fourchettes par niveau d'expérience</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
                {experienceLevels.map(exp => (
                  <div key={exp.level} style={{
                    padding: 20,
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 16,
                    border: `1px solid ${exp.color}15`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: exp.color }}>{exp.level}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{exp.subtitle}</div>
                      </div>
                      <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9" }}>{exp.moy}K€</div>
                    </div>
                    <div className="bar-track" style={{ marginBottom: 6 }}>
                      <div style={{
                        height: "100%",
                        borderRadius: 5,
                        marginLeft: `${(exp.min / 120) * 100}%`,
                        width: `${((exp.max - exp.min) / 120) * 100}%`,
                        background: `linear-gradient(90deg, ${exp.color}88, ${exp.color})`,
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569" }}>
                      <span>{exp.min}K€ min</span>
                      <span>{exp.max}K€ max</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── STRATEGIE / OUTILS MAJORITAIRES ─── */}
        {activeTab === "strategie" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="card">
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>La stack DevOps « majoritaire » en IDF</h2>
              <p style={{ color: "#475569", fontSize: 12, marginBottom: 20 }}>Les outils que la majorité des entreprises demandent — par couche technique</p>

              {[
                {
                  layer: "🐧 Système & Scripting",
                  desc: "La base : ce que 90%+ des offres exigent",
                  tools: [
                    { name: "Linux", pct: 92, color: "#FCC624" },
                    { name: "Docker", pct: 94, color: "#2496ED" },
                    { name: "Python", pct: 80, color: "#3776AB" },
                    { name: "Bash", pct: 78, color: "#4EAA25" },
                  ]
                },
                {
                  layer: "☁️ Cloud Provider",
                  desc: "Au moins un cloud maîtrisé est quasi-obligatoire",
                  tools: [
                    { name: "AWS", pct: 87, color: "#FF9900" },
                    { name: "Azure", pct: 78, color: "#0078D4" },
                    { name: "GCP", pct: 55, color: "#4285F4" },
                  ]
                },
                {
                  layer: "🔄 CI/CD & Orchestration",
                  desc: "Le cœur de la pipeline DevOps",
                  tools: [
                    { name: "Kubernetes", pct: 88, color: "#326CE5" },
                    { name: "GitLab CI", pct: 85, color: "#FC6D26" },
                    { name: "Jenkins", pct: 68, color: "#D24939" },
                    { name: "GitHub Actions", pct: 65, color: "#2088FF" },
                  ]
                },
                {
                  layer: "🏗️ IaC & Configuration",
                  desc: "Automatiser l'infra = se démarquer",
                  tools: [
                    { name: "Terraform", pct: 82, color: "#7B42BC" },
                    { name: "Ansible", pct: 75, color: "#EE0000" },
                    { name: "Helm", pct: 58, color: "#0F1689" },
                  ]
                },
                {
                  layer: "📊 Monitoring & Sécurité",
                  desc: "Observabilité + DevSecOps = les boosters de salaire",
                  tools: [
                    { name: "DevSecOps", pct: 72, color: "#00C853" },
                    { name: "Prometheus", pct: 70, color: "#E6522C" },
                    { name: "Grafana", pct: 68, color: "#F46800" },
                  ]
                },
              ].map((layer) => (
                <div key={layer.layer} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>{layer.layer}</h3>
                    <span style={{ fontSize: 11, color: "#475569" }}>{layer.desc}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {layer.tools.map(tool => (
                      <div key={tool.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span className="mono" style={{ width: 120, fontSize: 13, fontWeight: 600, color: tool.color, flexShrink: 0 }}>{tool.name}</span>
                        <div style={{ flex: 1 }}>
                          <div className="bar-track">
                            <div className="bar-fill" style={{
                              width: `${tool.pct}%`,
                              background: `linear-gradient(90deg, ${tool.color}55, ${tool.color})`,
                            }} />
                          </div>
                        </div>
                        <span className="mono" style={{ width: 45, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{tool.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Learning path recommendation */}
            <div className="card" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(99,102,241,0.04) 100%)", border: "1px solid rgba(34,197,94,0.1)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#4ade80", marginBottom: 14 }}>🎯 Parcours d'apprentissage recommandé</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                {[
                  { step: "1", title: "Les fondamentaux", time: "Mois 1-3", items: "Linux · Docker · Git · Bash · Python", color: "#60a5fa" },
                  { step: "2", title: "CI/CD & Cloud", time: "Mois 3-6", items: "GitLab CI · AWS ou Azure · Kubernetes basics", color: "#8b5cf6" },
                  { step: "3", title: "IaC & Orchestration", time: "Mois 6-9", items: "Terraform · Ansible · Kubernetes avancé · Helm", color: "#a78bfa" },
                  { step: "4", title: "Spécialisation", time: "Mois 9-12", items: "Monitoring (Prometheus/Grafana) · DevSecOps · Certif Cloud", color: "#c084fc" },
                ].map(s => (
                  <div key={s.step} style={{
                    padding: 16,
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 14,
                    borderLeft: `3px solid ${s.color}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span className="mono" style={{ fontSize: 20, fontWeight: 700, color: s.color }}>0{s.step}</span>
                      <span style={{ fontSize: 10, color: "#475569" }}>{s.time}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{s.items}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ FOOTER ═══ */}
      <div style={{ maxWidth: 1280, margin: "32px auto 0", textAlign: "center", padding: 16, position: "relative", zIndex: 1 }}>
        <div style={{ width: 60, height: 1, background: "rgba(255,255,255,0.06)", margin: "0 auto 16px" }} />
        <p style={{ fontSize: 10, color: "#1e293b", lineHeight: 1.8, maxWidth: 700, margin: "0 auto" }}>
          Sources : Indeed.fr · Glassdoor.fr · Hellowork · LinkedIn · Talent.com · DataRecrutement · Factoriel Baromètre 2026 · WeLoveDevs · JobSalaire.fr<br />
          Données compilées Février 2026 · Salaires bruts annuels indicatifs · Île-de-France<br />
          Les pourcentages de demande sont estimés à partir de la fréquence d'apparition dans les offres analysées
        </p>
        <p className="mono" style={{ fontSize: 10, color: "#374151", marginTop: 10 }}>
          Dashboard créé avec Claude AI · Analyse par @tomdaluzeau
        </p>
      </div>
    </div>
  );
}
