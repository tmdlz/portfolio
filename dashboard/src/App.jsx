import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
  LineChart, Line, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Treemap
} from "recharts";

// ── Design Tokens ──────────────────────────────────────────
const T = {
  bg: "#06090f",
  bgGrad: "radial-gradient(ellipse at 20% 0%, #0c1a2e 0%, #06090f 70%)",
  surface: "rgba(13,20,32,0.6)",
  surfaceHover: "rgba(17,29,46,0.5)",
  border: "rgba(255,255,255,0.04)",
  accent: "#38bdf8",
  accentDim: "rgba(56,189,248,0.12)",
  green: "#4ade80",
  greenDim: "rgba(74,222,128,0.12)",
  amber: "#fbbf24",
  amberDim: "rgba(251,191,36,0.12)",
  red: "#f87171",
  redDim: "rgba(248,113,113,0.12)",
  purple: "#a78bfa",
  purpleDim: "rgba(167,139,250,0.12)",
  rose: "#fb7185",
  teal: "#2dd4bf",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  sans: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
};

// ── Data ───────────────────────────────────────────────────

const topITJobs = [
  { rank: 1, title: "Ingénieur Cybersécurité", offres: 4200, salaire: "45-80K€", growth: "+12%", tension: 94, color: T.red },
  { rank: 2, title: "Ingénieur Cloud / Architecte Cloud", offres: 3800, salaire: "45-90K€", growth: "+15%", tension: 91, color: T.accent },
  { rank: 3, title: "DevOps Engineer", offres: 3900, salaire: "40-80K€", growth: "+10%", tension: 87, color: T.green },
  { rank: 4, title: "Data Engineer", offres: 3500, salaire: "45-75K€", growth: "+14%", tension: 85, color: T.purple },
  { rank: 5, title: "Développeur Full-Stack", offres: 5200, salaire: "38-65K€", growth: "+5%", tension: 72, color: T.amber },
  { rank: 6, title: "Ingénieur IA / ML Engineer", offres: 2800, salaire: "50-95K€", growth: "+25%", tension: 96, color: T.rose },
  { rank: 7, title: "Admin Sys & Réseaux", offres: 2400, salaire: "30-55K€", growth: "+5%", tension: 68, color: T.teal },
  { rank: 8, title: "SRE / Platform Engineer", offres: 1900, salaire: "55-85K€", growth: "+25%", tension: 92, color: T.accent },
  { rank: 9, title: "Chef de Projet IT", offres: 2600, salaire: "45-65K€", growth: "+3%", tension: 55, color: T.textMuted },
  { rank: 10, title: "Ingénieur Systèmes & Réseaux", offres: 2200, salaire: "35-60K€", growth: "+7%", tension: 72, color: T.teal },
];

const sysadminSalary = [
  { level: "Junior (0-2)", paris: 35, idf: 32, region: 28 },
  { level: "Confirmé (3-5)", paris: 45, idf: 42, region: 38 },
  { level: "Senior (5-10)", paris: 55, idf: 50, region: 45 },
  { level: "Lead / Expert", paris: 65, idf: 60, region: 52 },
];

const cloudSalary = [
  { level: "Junior (0-2)", paris: 45, idf: 42, region: 38 },
  { level: "Confirmé (3-5)", paris: 60, idf: 55, region: 48 },
  { level: "Senior (5-10)", paris: 78, idf: 72, region: 62 },
  { level: "Architecte / Lead", paris: 92, idf: 85, region: 75 },
];

const marketEvolution = [
  { month: "Mar 25", sysadmin: 2100, cloud: 3100, devops: 3200, cyber: 3600 },
  { month: "Juin 25", sysadmin: 2000, cloud: 3000, devops: 3100, cyber: 3500 },
  { month: "Sep 25", sysadmin: 2150, cloud: 3300, devops: 3200, cyber: 3800 },
  { month: "Oct 25", sysadmin: 2200, cloud: 3400, devops: 3350, cyber: 3900 },
  { month: "Déc 25", sysadmin: 2050, cloud: 3200, devops: 2800, cyber: 3700 },
  { month: "Fév 26", sysadmin: 2400, cloud: 3800, devops: 3900, cyber: 4200 },
];

const techStack = [
  { name: "Linux", pct: 82, cat: "Système" },
  { name: "Windows Server", pct: 68, cat: "Système" },
  { name: "Docker", pct: 76, cat: "Container" },
  { name: "Kubernetes", pct: 65, cat: "Container" },
  { name: "AWS", pct: 72, cat: "Cloud" },
  { name: "Azure", pct: 68, cat: "Cloud" },
  { name: "GCP", pct: 34, cat: "Cloud" },
  { name: "Terraform", pct: 61, cat: "IaC" },
  { name: "Ansible", pct: 55, cat: "IaC" },
  { name: "Python", pct: 58, cat: "Scripting" },
  { name: "Bash/Shell", pct: 72, cat: "Scripting" },
  { name: "GitLab CI/CD", pct: 53, cat: "CI/CD" },
  { name: "Jenkins", pct: 42, cat: "CI/CD" },
  { name: "Prometheus", pct: 45, cat: "Monitoring" },
  { name: "Grafana", pct: 44, cat: "Monitoring" },
];

const employerPie = [
  { name: "ESN / Conseil", value: 47, color: T.accent },
  { name: "Éditeurs / SaaS", value: 15, color: T.green },
  { name: "Banque & Finance", value: 12, color: T.purple },
  { name: "Industrie & Transport", value: 10, color: T.amber },
  { name: "Startups / Scale-ups", value: 9, color: T.rose },
  { name: "Secteur public", value: 7, color: T.textMuted },
];

const remotePie = [
  { name: "Hybride 2-3j/sem", value: 52, color: T.green },
  { name: "Présentiel", value: 22, color: T.amber },
  { name: "Full remote", value: 18, color: T.accent },
  { name: "Flexible", value: 8, color: T.purple },
];

const certifROI = [
  { name: "CKA", demande: 85, salaire: "+12%", investissement: "~400€", difficulte: 78 },
  { name: "AZ-104", demande: 82, salaire: "+10%", investissement: "~165€", difficulte: 65 },
  { name: "AWS SAA", demande: 80, salaire: "+11%", investissement: "~150$", difficulte: 70 },
  { name: "Terraform Assoc.", demande: 72, salaire: "+8%", investissement: "~70$", difficulte: 55 },
  { name: "RHCSA", demande: 58, salaire: "+7%", investissement: "~400€", difficulte: 72 },
  { name: "CompTIA Sec+", demande: 55, salaire: "+6%", investissement: "~370€", difficulte: 60 },
];

const infraSalaryComparison = [
  { metier: "Admin Sys & Réseaux", junior: 33, confirme: 43, senior: 55 },
  { metier: "Admin Sys DevOps", junior: 38, confirme: 50, senior: 62 },
  { metier: "Ingénieur Cloud", junior: 45, confirme: 60, senior: 78 },
  { metier: "Architecte Cloud", junior: 52, confirme: 68, senior: 92 },
  { metier: "DevOps Engineer", junior: 40, confirme: 56, senior: 75 },
  { metier: "SRE", junior: 45, confirme: 62, senior: 82 },
  { metier: "Ingénieur Cybersécurité", junior: 45, confirme: 60, senior: 80 },
];

const topRecruiters = [
  { name: "Capgemini", type: "ESN", offres: 320, color: T.accent },
  { name: "Sopra Steria", type: "ESN", offres: 275, color: T.accent },
  { name: "Thales", type: "Défense", offres: 210, color: T.amber },
  { name: "Orange", type: "Télécom", offres: 195, color: T.amber },
  { name: "Société Générale", type: "Banque", offres: 180, color: T.purple },
  { name: "Alten", type: "ESN", offres: 165, color: T.accent },
  { name: "BNP Paribas", type: "Banque", offres: 155, color: T.purple },
  { name: "Devoteam", type: "ESN", offres: 140, color: T.accent },
  { name: "Atos / Eviden", type: "ESN", offres: 130, color: T.accent },
  { name: "SNCF / RATP", type: "Transport", offres: 115, color: T.green },
];

const emergingTrends = [
  { name: "Platform Engineering", growth: 45, desc: "Plateformes internes self-service", icon: "🏗️" },
  { name: "FinOps", growth: 38, desc: "Gouvernance coûts cloud", icon: "💸" },
  { name: "DevSecOps", growth: 35, desc: "Sécurité intégrée au pipeline", icon: "🔐" },
  { name: "AIOps", growth: 32, desc: "IA pour le monitoring et l'incident mgmt", icon: "🤖" },
  { name: "Cloud Souverain", growth: 28, desc: "SecNumCloud, conformité RGPD", icon: "🇫🇷" },
  { name: "GreenOps", growth: 22, desc: "Empreinte carbone de l'IT", icon: "🌱" },
];

// ── Animated Counter ───────────────────────────────────────
function AnimN({ value, suffix = "", prefix = "", dur = 1100 }) {
  const [d, setD] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const s = performance.now();
        const run = (n) => {
          const p = Math.min((n - s) / dur, 1);
          setD(Math.round((1 - Math.pow(1 - p, 3)) * value));
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, dur]);
  return <span ref={ref}>{prefix}{d.toLocaleString("fr-FR")}{suffix}</span>;
}

// ── Card ───────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(13,20,32,0.55)", border: "none",
      borderRadius: 18, padding: 22,
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      boxShadow: "0 4px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
      ...style,
    }}>{children}</div>
  );
}

function Title({ icon, title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>{title}</h3>
      </div>
      {sub && <p style={{ margin: 0, fontSize: 11, color: T.textDim, marginLeft: 24 }}>{sub}</p>}
    </div>
  );
}

function Stat({ label, value, suffix = "", prefix = "", sub, color = T.accent }) {
  const numVal = parseInt(String(value).replace(/\D/g, "")) || 0;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}08, ${color}14)`,
      border: "none", borderRadius: 14, padding: "16px 18px", flex: 1, minWidth: 150,
      boxShadow: `0 2px 20px ${color}08`,
    }}>
      <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: T.mono }}>
        {numVal > 0 ? <AnimN value={numVal} prefix={prefix} suffix={suffix} /> : <span>{prefix}{value}{suffix}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

// ── Tooltip ────────────────────────────────────────────────
function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(13,20,32,0.9)", border: "none", borderRadius: 12,
      padding: "10px 14px", boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    }}>
      <div style={{ fontSize: 11, color: T.textDim, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color || T.text, fontWeight: 600 }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString("fr-FR") : p.value}
        </div>
      ))}
    </div>
  );
}

function PLabel({ cx, cy, midAngle, outerRadius, name, value }) {
  const R = Math.PI / 180;
  const r = outerRadius + 22;
  const x = cx + r * Math.cos(-midAngle * R);
  const y = cy + r * Math.sin(-midAngle * R);
  if (value < 8) return null;
  return <text x={x} y={y} fill={T.textMuted} textAnchor={x > cx ? "start" : "end"} fontSize={10} dominantBaseline="central">{name} ({value}%)</text>;
}

// ── Bar with animation ─────────────────────────────────────
function AnimBar({ label, pct, color, delay = 0, sub }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setW(pct), delay * 50);
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, delay]);
  return (
    <div ref={ref} style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{label}</span>
          {sub && <span style={{ fontSize: 10, color: T.textDim, background: T.surfaceHover, borderRadius: 4, padding: "1px 5px" }}>{sub}</span>}
        </div>
        <span style={{ fontSize: 12, color, fontWeight: 700, fontFamily: T.mono }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: `${color}15`, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${w}%`, background: `linear-gradient(90deg, ${color}, ${color}80)`,
          borderRadius: 3, transition: "width 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [salaryView, setSalaryView] = useState("sysadmin");

  const tabs = [
    { id: "overview", label: "Marché IT", icon: "📊" },
    { id: "syscloud", label: "SysAdmin & Cloud", icon: "🖥️" },
    { id: "techstack", label: "Technologies", icon: "⚡" },
    { id: "salary", label: "Salaires", icon: "💰" },
    { id: "itjobs", label: "Top Métiers IT", icon: "🏆" },
  ];

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100vh", fontFamily: T.sans }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* ── Header ──────────────────────────────── */}
      <div style={{ background: T.bgGrad, borderBottom: "none", padding: "20px 28px 0" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: `linear-gradient(135deg, ${T.accent}, ${T.teal})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 800, color: T.bg,
                }}>IT</div>
                <h1 style={{
                  margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em",
                  background: `linear-gradient(135deg, ${T.text} 30%, ${T.accent})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>Emploi IT — Île-de-France</h1>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: T.textDim, marginLeft: 44 }}>
                Dashboard marché de l'emploi • Admin Sys • Cloud • DevOps • Cybersécurité — Février 2026
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sources</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>Glassdoor • Page Group • Indeed • Fed IT • Robert Half</div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: `${T.green}10`, borderRadius: 8, padding: "5px 10px",
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
                <span style={{ fontSize: 11, color: T.green, fontWeight: 600 }}>Fév. 2026</span>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: tab === t.id ? "rgba(13,20,32,0.6)" : "transparent",
                border: "none", borderTop: tab === t.id ? `2px solid ${T.accent}50` : "2px solid transparent",
                borderRadius: "12px 12px 0 0", padding: "9px 18px",
                color: tab === t.id ? T.accent : T.textDim, fontSize: 12.5, fontWeight: tab === t.id ? 700 : 500,
                cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: 13 }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────── */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "22px 28px 48px" }}>

        {/* ════════════ TAB: OVERVIEW ════════════ */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Stat label="Offres IT actives — IDF" value="28500" suffix="+" sub="Tous métiers IT confondus" color={T.accent} />
              <Stat label="Recrutements difficiles" value="85" suffix="%" sub="Pénurie persistante de talents" color={T.red} />
              <Stat label="Croissance marché IT FR" value="4" suffix="%" sub="CA > 70 Mds € en 2025" color={T.green} />
              <Stat label="ESN — Part du marché" value="47" suffix="%" sub="Premier type d'employeur" color={T.purple} />
            </div>

            {/* Market Trend + Employers */}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
              <Card>
                <Title icon="📈" title="Évolution des offres par domaine — IDF" sub="Nombre d'offres actives, 12 derniers mois" />
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={marketEvolution}>
                    <defs>
                      <linearGradient id="gCyber" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.red} stopOpacity={0.2}/><stop offset="100%" stopColor={T.red} stopOpacity={0}/></linearGradient>
                      <linearGradient id="gCloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.accent} stopOpacity={0.2}/><stop offset="100%" stopColor={T.accent} stopOpacity={0}/></linearGradient>
                      <linearGradient id="gDevops" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.green} stopOpacity={0.2}/><stop offset="100%" stopColor={T.green} stopOpacity={0}/></linearGradient>
                      <linearGradient id="gSys" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.teal} stopOpacity={0.15}/><stop offset="100%" stopColor={T.teal} stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                    <XAxis dataKey="month" tick={{ fill: T.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: T.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="cyber" name="Cybersécurité" stroke={T.red} fill="url(#gCyber)" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="cloud" name="Cloud" stroke={T.accent} fill="url(#gCloud)" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="devops" name="DevOps" stroke={T.green} fill="url(#gDevops)" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="sysadmin" name="SysAdmin" stroke={T.teal} fill="url(#gSys)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <Title icon="🏢" title="Qui recrute ?" sub="Répartition par type d'employeur" />
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={employerPie} dataKey="value" cx="50%" cy="50%" outerRadius={90} innerRadius={48} paddingAngle={3}
                      label={PLabel} labelLine={{ stroke: T.textDim, strokeWidth: 1 }}>
                      {employerPie.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Top Recruiters + Remote + Trends */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              <Card>
                <Title icon="🏆" title="Top 10 recruteurs IT — IDF" sub="Nombre d'offres actives estimé" />
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {topRecruiters.map((e, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "5px 10px", borderRadius: 7,
                      background: i < 3 ? `${e.color}06` : "transparent",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 700, fontFamily: T.mono,
                          background: i < 3 ? `${e.color}18` : T.surfaceHover, color: i < 3 ? e.color : T.textDim,
                        }}>{i + 1}</span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{e.name}</div>
                          <div style={{ fontSize: 10, color: T.textDim }}>{e.type}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: e.color, fontFamily: T.mono }}>{e.offres}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <Title icon="🏠" title="Télétravail" sub="Politique des offres IT en IDF" />
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={remotePie} dataKey="value" cx="50%" cy="50%" outerRadius={72} innerRadius={38} paddingAngle={4}
                      label={PLabel} labelLine={{ stroke: T.textDim, strokeWidth: 1 }}>
                      {remotePie.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                    </Pie>
                    <Tooltip content={<Tip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 7, background: T.greenDim, fontSize: 11, color: T.green, lineHeight: 1.4 }}>
                  💡 70% des postes IT en IDF offrent du télétravail. Tendance : les entreprises reviennent vers 1-2j présentiel obligatoire.
                </div>
              </Card>
              <Card>
                <Title icon="🚀" title="Tendances émergentes" sub="Croissance de la demande YoY" />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {emergingTrends.map((t, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 10px", borderRadius: 8, background: T.surfaceHover,
                    }}>
                      <span style={{ fontSize: 18 }}>{t.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{t.name}</div>
                        <div style={{ fontSize: 10, color: T.textDim }}>{t.desc}</div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: T.green, fontFamily: T.mono,
                        background: T.greenDim, borderRadius: 5, padding: "2px 7px",
                      }}>+{t.growth}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ════════════ TAB: SYS & CLOUD ════════════ */}
        {tab === "syscloud" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Stat label="Admin Sys & Réseaux — Offres IDF" value="2400" suffix="+" sub="Stable, +5% YoY" color={T.teal} />
              <Stat label="Ingénieur Cloud — Offres IDF" value="3800" suffix="+" sub="Forte croissance +15% YoY" color={T.accent} />
              <Stat label="SysAdmin — Salaire médian IDF" value="43" suffix="K€" sub="Brut annuel, profil confirmé" color={T.amber} />
              <Stat label="Cloud Eng. — Salaire médian IDF" value="60" suffix="K€" sub="Brut annuel, profil confirmé" color={T.green} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Card>
                <Title icon="🖥️" title="Métiers de l'infrastructure — Positionnement" sub="Salaire médian confirmé (K€) vs nombre d'offres IDF" />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: "Admin Sys\n& Réseaux", offres: 2400, salaire: 43, color: T.teal },
                    { name: "Admin Sys\nDevOps", offres: 1800, salaire: 50, color: T.green },
                    { name: "Ingénieur\nCloud", offres: 3800, salaire: 60, color: T.accent },
                    { name: "Architecte\nCloud", offres: 1200, salaire: 68, color: T.purple },
                    { name: "DevOps\nEngineer", offres: 3900, salaire: 56, color: T.green },
                    { name: "SRE / Platform\nEngineer", offres: 1900, salaire: 62, color: T.rose },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                    <XAxis dataKey="name" tick={{ fill: T.text, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis yAxisId="left" tick={{ fill: T.textDim, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: T.textDim, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 80]} unit="K€" />
                    <Tooltip content={<Tip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar yAxisId="left" dataKey="offres" name="Offres" fill={T.accent} radius={[4, 4, 0, 0]} barSize={22} fillOpacity={0.5} />
                    <Bar yAxisId="right" dataKey="salaire" name="Salaire médian (K€)" fill={T.green} radius={[4, 4, 0, 0]} barSize={22} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <Title icon="📋" title="Compétences demandées — Admin Sys & Cloud" sub="% d'apparition dans les offres IDF" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.teal, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Admin Sys</div>
                    {[
                      { name: "Linux (Debian/RHEL)", pct: 85 },
                      { name: "Active Directory", pct: 72 },
                      { name: "VMware / Proxmox", pct: 65 },
                      { name: "Scripting (Bash/Python)", pct: 62 },
                      { name: "Ansible", pct: 48 },
                      { name: "Monitoring (Nagios/Zabbix)", pct: 45 },
                      { name: "Backup (Veeam/Borg)", pct: 40 },
                    ].map((s, i) => <AnimBar key={s.name} label={s.name} pct={s.pct} color={T.teal} delay={i} />)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Cloud</div>
                    {[
                      { name: "AWS (EC2, S3, IAM)", pct: 72 },
                      { name: "Azure (VMs, AKS, AD)", pct: 68 },
                      { name: "Terraform", pct: 65 },
                      { name: "Kubernetes", pct: 62 },
                      { name: "Docker", pct: 78 },
                      { name: "CI/CD (GitLab/GH Actions)", pct: 55 },
                      { name: "Prometheus / Grafana", pct: 48 },
                    ].map((s, i) => <AnimBar key={s.name} label={s.name} pct={s.pct} color={T.accent} delay={i} />)}
                  </div>
                </div>
              </Card>
            </div>

            {/* Key insight */}
            <Card style={{ background: `linear-gradient(135deg, ${T.accent}06, ${T.teal}06)`, border: "none" }}>
              <Title icon="💡" title="Analyse du marché SysAdmin & Cloud — IDF 2026" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(13,20,32,0.5)", borderLeft: `3px solid ${T.teal}30` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.teal, marginBottom: 6 }}>Admin Sys classique</div>
                  <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
                    Marché stable mais les salaires stagnent. La demande se maintient (support, maintenance, infra on-prem) mais les postes évoluent vers plus d'automatisation. Le profil purement "helpdesk + serveurs" est sous pression.
                  </div>
                </div>
                <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(13,20,32,0.5)", borderLeft: `3px solid ${T.green}30` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.green, marginBottom: 6 }}>Admin Sys → DevOps</div>
                  <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
                    La transition la plus porteuse. Ajouter Docker, Ansible, CI/CD et Terraform à un profil SysAdmin augmente le salaire de +25 à +40% et ouvre l'accès à beaucoup plus d'offres. C'est le parcours le plus rentable.
                  </div>
                </div>
                <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(13,20,32,0.5)", borderLeft: `3px solid ${T.accent}30` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.accent, marginBottom: 6 }}>Cloud Engineer</div>
                  <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
                    Forte croissance (+15% YoY) avec les meilleurs salaires du segment infra. Les certifications (AZ-104, AWS SAA, CKA) ont un impact direct sur la rémunération. Le multi-cloud et la sécurité cloud sont les différenciateurs clés.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ════════════ TAB: TECH STACK ════════════ */}
        {tab === "techstack" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Card>
                <Title icon="⚡" title="Technologies les plus demandées — IDF" sub="% d'apparition dans les offres infra/cloud/DevOps" />
                {techStack.map((t, i) => {
                  const catColors = { Système: T.teal, Container: T.green, Cloud: T.accent, IaC: T.purple, Scripting: T.amber, "CI/CD": T.rose, Monitoring: T.red };
                  return <AnimBar key={t.name} label={t.name} pct={t.pct} color={catColors[t.cat] || T.accent} delay={i} sub={t.cat} />;
                })}
              </Card>
              <Card>
                <Title icon="🎓" title="Certifications — Demande & Impact" sub="Top certifications pour le marché IDF" />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {certifROI.map((c, i) => (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "100px 1fr 70px 70px 70px",
                      alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9,
                      background: i % 2 === 0 ? T.surfaceHover : "transparent",
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{c.name}</span>
                      <div style={{ height: 5, background: `${T.accent}15`, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${c.demande}%`, background: T.accent, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, color: T.green, fontWeight: 600, textAlign: "center" }}>{c.salaire}</span>
                      <span style={{ fontSize: 11, color: T.textMuted, textAlign: "center" }}>{c.investissement}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ flex: 1, height: 4, background: `${T.amber}20`, borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${c.difficulte}%`, background: T.amber, borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 70px 70px 70px", gap: 10, padding: "4px 12px" }}>
                    <span style={{ fontSize: 10, color: T.textDim }}>Certif</span>
                    <span style={{ fontSize: 10, color: T.textDim }}>Demande marché</span>
                    <span style={{ fontSize: 10, color: T.textDim, textAlign: "center" }}>Salaire +</span>
                    <span style={{ fontSize: 10, color: T.textDim, textAlign: "center" }}>Coût</span>
                    <span style={{ fontSize: 10, color: T.textDim }}>Difficulté</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <Title icon="🔮" title="Radar des compétences marché 2026" sub="Importance relative des domaines de compétences pour les métiers infra/cloud" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "center" }}>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { domain: "Linux / OS", sysadmin: 95, cloud: 70, devops: 75 },
                    { domain: "Réseau", sysadmin: 85, cloud: 60, devops: 55 },
                    { domain: "Containers", sysadmin: 40, cloud: 75, devops: 90 },
                    { domain: "Cloud (IaaS/PaaS)", sysadmin: 30, cloud: 95, devops: 75 },
                    { domain: "IaC", sysadmin: 35, cloud: 85, devops: 90 },
                    { domain: "CI/CD", sysadmin: 25, cloud: 60, devops: 95 },
                    { domain: "Sécurité", sysadmin: 70, cloud: 80, devops: 65 },
                    { domain: "Monitoring", sysadmin: 75, cloud: 70, devops: 80 },
                    { domain: "Scripting", sysadmin: 65, cloud: 70, devops: 80 },
                  ]}>
                    <PolarGrid stroke={T.border} />
                    <PolarAngleAxis dataKey="domain" tick={{ fill: T.text, fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="SysAdmin" dataKey="sysadmin" stroke={T.teal} fill={T.teal} fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="Cloud Eng." dataKey="cloud" stroke={T.accent} fill={T.accent} fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="DevOps" dataKey="devops" stroke={T.green} fill={T.green} fillOpacity={0.1} strokeWidth={2} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip content={<Tip />} />
                  </RadarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ padding: 14, borderRadius: 10, background: `${T.teal}08`, borderLeft: `3px solid ${T.teal}30` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.teal }}>Admin Sys : profil OS + Réseau</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>Fort sur Linux, réseau et monitoring. Le gap est sur les containers, le cloud et la CI/CD.</div>
                  </div>
                  <div style={{ padding: 14, borderRadius: 10, background: `${T.accent}08`, borderLeft: `3px solid ${T.accent}30` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>Cloud Eng. : profil cloud-native</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>Domine sur IaaS/PaaS, IaC et sécurité cloud. Moins fort en réseau traditionnel.</div>
                  </div>
                  <div style={{ padding: 14, borderRadius: 10, background: `${T.green}08`, borderLeft: `3px solid ${T.green}30` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.green }}>DevOps : profil automatisation</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>Fort sur CI/CD, containers et IaC. Le lien entre dev et ops, polyvalent et très demandé.</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ════════════ TAB: SALARY ════════════ */}
        {tab === "salary" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Toggle */}
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { id: "sysadmin", label: "Admin Sys & Réseaux", icon: "🖥️" },
                { id: "cloud", label: "Cloud / DevOps / SRE", icon: "☁️" },
              ].map(v => (
                <button key={v.id} onClick={() => setSalaryView(v.id)} style={{
                  background: salaryView === v.id ? T.accentDim : "rgba(13,20,32,0.5)",
                  border: "none",
                  borderRadius: 10, padding: "8px 16px", cursor: "pointer",
                  color: salaryView === v.id ? T.accent : T.textMuted,
                  fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 6,
                }}>{v.icon} {v.label}</button>
              ))}
            </div>

            <Card>
              <Title
                icon="💰"
                title={salaryView === "sysadmin" ? "Grille salariale — Admin Sys & Réseaux (K€ brut/an)" : "Grille salariale — Cloud / DevOps / SRE (K€ brut/an)"}
                sub="Source : Page Group, Glassdoor, Fed IT, Seyos — Île-de-France 2026"
              />
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryView === "sysadmin" ? sysadminSalary : cloudSalary} margin={{ bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                  <XAxis dataKey="level" tick={{ fill: T.text, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: T.textDim, fontSize: 11 }} axisLine={false} tickLine={false} unit="K€" domain={[0, salaryView === "sysadmin" ? 70 : 100]} />
                  <Tooltip content={<Tip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="paris" name="Paris intra-muros" fill={T.accent} radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="idf" name="Île-de-France" fill={T.green} radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="region" name="Régions" fill={T.amber} radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <Title icon="📊" title="Comparaison salariale — Tous métiers infra IDF" sub="Salaire brut annuel K€ — Paris/IDF, par niveau d'expérience" />
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={infraSalaryComparison} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: T.textDim, fontSize: 10 }} axisLine={false} tickLine={false} unit="K€" domain={[0, 100]} />
                  <YAxis type="category" dataKey="metier" tick={{ fill: T.text, fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
                  <Tooltip content={<Tip />} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="junior" name="Junior (0-2 ans)" fill={T.amber} radius={[0, 3, 3, 0]} barSize={10} />
                  <Bar dataKey="confirme" name="Confirmé (3-5 ans)" fill={T.accent} radius={[0, 3, 3, 0]} barSize={10} />
                  <Bar dataKey="senior" name="Senior (5-10 ans)" fill={T.green} radius={[0, 3, 3, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Card style={{ background: `linear-gradient(135deg, ${T.green}06, ${T.accent}04)` }}>
                <Title icon="📈" title="Facteurs qui augmentent le salaire" />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Certification cloud (AZ-104, AWS SAA, CKA)", impact: "+8 à +15%", color: T.green },
                    { label: "Compétence Kubernetes en production", impact: "+10 à +20%", color: T.green },
                    { label: "Expérience DevSecOps / sécurité", impact: "+12 à +18%", color: T.green },
                    { label: "Multi-cloud (AWS + Azure)", impact: "+10 à +15%", color: T.accent },
                    { label: "Contexte réglementé (banque, santé)", impact: "+5 à +12%", color: T.accent },
                    { label: "Télétravail réduit (5j présentiel)", impact: "-5 à -10%", color: T.red },
                  ].map((f, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 12px", borderRadius: 8, background: T.surface,
                    }}>
                      <span style={{ fontSize: 12, color: T.text }}>{f.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: f.color, fontFamily: T.mono }}>{f.impact}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card style={{ background: `linear-gradient(135deg, ${T.purple}06, ${T.rose}04)` }}>
                <Title icon="🇫🇷" title="Contexte marché France 2026" />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>
                  <div style={{ padding: "10px 12px", borderRadius: 8, background: T.surface }}>
                    <span style={{ fontWeight: 700, color: T.accent }}>Reprise progressive :</span> Après un gel des projets en 2024-2025, les entreprises relancent les chantiers cloud souverain, refonte d'architectures et automatisation.
                  </div>
                  <div style={{ padding: "10px 12px", borderRadius: 8, background: T.surface }}>
                    <span style={{ fontWeight: 700, color: T.amber }}>Directive transparence salariale :</span> Avant juin 2026, les entreprises doivent publier les fourchettes de salaire dans les offres (directive EU).
                  </div>
                  <div style={{ padding: "10px 12px", borderRadius: 8, background: T.surface }}>
                    <span style={{ fontWeight: 700, color: T.red }}>Pénurie persistante :</span> 85% des recrutements IT sont difficiles à pourvoir. Les profils cybersécurité et cloud sont les plus tendus.
                  </div>
                  <div style={{ padding: "10px 12px", borderRadius: 8, background: T.surface }}>
                    <span style={{ fontWeight: 700, color: T.green }}>IA et automatisation :</span> Les profils capables de travailler avec l'IA (AIOps, Copilot, agents) commencent à être différenciés dans les offres.
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ════════════ TAB: TOP IT JOBS ════════════ */}
        {tab === "itjobs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card>
              <Title icon="🏆" title="Top 10 des emplois IT les plus demandés — Île-de-France 2026" sub="Classement par volume d'offres × tension du marché" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {/* Header */}
                <div style={{
                  display: "grid", gridTemplateColumns: "36px 1fr 90px 100px 70px 120px",
                  gap: 10, padding: "6px 14px", alignItems: "center",
                }}>
                  <span style={{ fontSize: 10, color: T.textDim }}>#</span>
                  <span style={{ fontSize: 10, color: T.textDim }}>Métier</span>
                  <span style={{ fontSize: 10, color: T.textDim, textAlign: "center" }}>Offres IDF</span>
                  <span style={{ fontSize: 10, color: T.textDim, textAlign: "center" }}>Salaire (K€)</span>
                  <span style={{ fontSize: 10, color: T.textDim, textAlign: "center" }}>Croiss.</span>
                  <span style={{ fontSize: 10, color: T.textDim }}>Tension marché</span>
                </div>
                {topITJobs.map((j, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "36px 1fr 90px 100px 70px 120px",
                    gap: 10, padding: "10px 14px", borderRadius: 10, alignItems: "center",
                    background: i < 3 ? `${j.color}06` : i % 2 === 0 ? T.surfaceHover : "transparent",
                    border: "none",
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, fontFamily: T.mono,
                      background: i < 3 ? `${j.color}20` : T.surfaceHover, color: i < 3 ? j.color : T.textDim,
                    }}>{j.rank}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{j.title}</div>
                    </div>
                    <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: T.text, fontFamily: T.mono }}>
                      {j.offres.toLocaleString("fr-FR")}
                    </div>
                    <div style={{ textAlign: "center", fontSize: 12, color: T.textMuted }}>{j.salaire}</div>
                    <div style={{ textAlign: "center" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, fontFamily: T.mono,
                        color: parseInt(j.growth) >= 15 ? T.green : parseInt(j.growth) >= 10 ? T.accent : T.amber,
                      }}>{j.growth}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, height: 6, background: `${j.color}15`, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${j.tension}%`, background: j.color, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: j.color, fontFamily: T.mono, width: 30 }}>{j.tension}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Card>
                <Title icon="🔥" title="Les 3 métiers les plus tendus" sub="Ratio offres/candidats le plus défavorable aux recruteurs" />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { name: "Ingénieur IA / ML Engineer", tension: 96, detail: "La demande a explosé avec l'IA générative. Profils extrêmement rares, salaires qui s'envolent. 50-95K€ même pour des juniors avec les bonnes compétences.", color: T.rose },
                    { name: "Ingénieur Cybersécurité", tension: 94, detail: "47% des recherches IT portent sur la cybersécurité (SecOps, IAM, Zero Trust). Croissance salariale de +12.5% en 2 ans. Obligation réglementaire (DORA, NIS2).", color: T.red },
                    { name: "SRE / Platform Engineer", tension: 92, detail: "Profil émergent en forte demande. Les entreprises passent du DevOps au Platform Engineering : outils internes scalables et self-service.", color: T.accent },
                  ].map((m, i) => (
                    <div key={i} style={{
                      padding: 14, borderRadius: 10, background: `${m.color}06`,
                      borderLeft: `3px solid ${m.color}30`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: m.color, fontFamily: T.mono }}>{m.tension}%</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{m.detail}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <Title icon="📉" title="Métiers en transformation" sub="Postes qui évoluent fortement, attention au positionnement" />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    {
                      name: "Admin Sys traditionnel",
                      status: "⚠️ En mutation",
                      detail: "Le poste purement réactif (tickets, maintenance) est en recul. Les admins sys qui ne montent pas en compétence IaC/Cloud voient leurs salaires stagner. Le marché pousse vers l'automatisation.",
                      color: T.amber
                    },
                    {
                      name: "Développeur web junior / généraliste",
                      status: "⚠️ Concurrence accrue",
                      detail: "Trop de profils juniors sur le marché, l'IA réduit le besoin en code de base. Les développeurs doivent se spécialiser (cloud-native, sécurité, data) pour se démarquer.",
                      color: T.amber
                    },
                    {
                      name: "Chef de projet IT classique",
                      status: "📉 Demande en baisse",
                      detail: "Les méthodes agiles et les outils de PM réduisent le besoin en chefs de projet traditionnels. Les profils survivants sont ceux avec une vraie expertise technique + leadership.",
                      color: T.red
                    },
                  ].map((m, i) => (
                    <div key={i} style={{
                      padding: 14, borderRadius: 10, background: `${m.color}06`,
                      borderLeft: `3px solid ${m.color}30`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{m.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: m.color }}>{m.status}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{m.detail}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Key numbers */}
            <Card>
              <Title icon="📊" title="Le marché IT en chiffres — France / IDF 2026" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
                {[
                  { label: "CA secteur numérique FR", value: "70+ Mds €", color: T.accent },
                  { label: "Emplois French Tech", value: "450 000", color: T.green },
                  { label: "Recrutements difficiles", value: "85%", color: T.red },
                  { label: "Croissance emploi tech S1 2025", value: "+4.6%", color: T.green },
                  { label: "Startups actives", value: "18 000", color: T.purple },
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: "14px 16px", borderRadius: 10, textAlign: "center",
                    background: `${s.color}08`, border: "none",
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: T.mono }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 6, lineHeight: 1.3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); }
      `}</style>
    </div>
  );
}