import { useState, useEffect, useRef } from "react";

const MOCK_USER = { name: "Md. Rakib Hasan", email: "rakib@gmail.com", avatar: "RH" };

const JOB_SITES = [
  { name: "LinkedIn", icon: "💼", color: "#0077B5" },
  { name: "Indeed", icon: "🔍", color: "#003A9B" },
  { name: "InfoJobs", icon: "📋", color: "#FF6600" },
  { name: "Monster", icon: "👾", color: "#6D29CC" },
  { name: "Subito Lavoro", icon: "⚡", color: "#E30613" },
  { name: "Glassdoor", icon: "🪟", color: "#0CAA41" },
  { name: "Trovit", icon: "🎯", color: "#E91E8C" },
  { name: "Jobrapido", icon: "🚀", color: "#1565C0" },
  { name: "Bakeca Lavoro", icon: "🏠", color: "#FF8C00" },
  { name: "Lavoro.it", icon: "🇮🇹", color: "#009246" },
];

const ITALIAN_REGIONS = [
  { name: "Lombardia", cities: ["Milano","Bergamo","Brescia","Como","Monza"] },
  { name: "Lazio", cities: ["Roma","Frosinone","Latina","Rieti","Viterbo"] },
  { name: "Toscana", cities: ["Firenze","Siena","Pisa","Livorno","Arezzo"] },
  { name: "Piemonte", cities: ["Torino","Alessandria","Asti","Cuneo","Novara"] },
  { name: "Campania", cities: ["Napoli","Salerno","Caserta","Avellino","Benevento"] },
  { name: "Veneto", cities: ["Venezia","Verona","Padova","Vicenza","Treviso"] },
  { name: "Emilia-Romagna", cities: ["Bologna","Modena","Parma","Reggio Emilia","Ferrara"] },
  { name: "Sicilia", cities: ["Palermo","Catania","Messina","Agrigento","Trapani"] },
];

const CATEGORIES = [
  "Software Developer","Web Designer","Data Analyst","Marketing Manager",
  "Sales Representative","Customer Service","Accountant","Project Manager",
  "HR Specialist","Logistics","Chef / Cook","Waiter / Barista",
  "Electrician","Mechanic","Nurse / Healthcare","Teacher / Tutor",
  "Driver","Security Guard","Magazziniere","Operaio",
];

const COMPANIES = [
  "Enel SpA","ENI Digital","UniCredit","Intesa Sanpaolo","Telecom Italia",
  "Ferrero","Lavazza","Barilla","Pirelli","Fiat Chrysler",
  "Conad","Esselunga","Rinascente","OVS SpA","Autogrill",
  "Hotel Marriott Milano","Ristorante Da Luigi","Logistica Italia Srl",
  "TechSoft Roma","Studio Legale Bianchi",
];

const STATUS_CONFIG = {
  applied:   { label: "Inviata",      color: "#3B82F6", dot: "🔵" },
  viewed:    { label: "Visualizzata", color: "#8B5CF6", dot: "🟣" },
  interview: { label: "Colloquio",    color: "#F59E0B", dot: "🟡" },
  offer:     { label: "Offerta 🎉",   color: "#10B981", dot: "🟢" },
  rejected:  { label: "Rifiutata",    color: "#EF4444", dot: "🔴" },
};
const S = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#07070E;--card:#0F0F1A;--card2:#161625;--border:rgba(255,255,255,0.07);
  --green:#00E87A;--green2:#00B85E;--text:#EEEEF5;--muted:#5A5A72;
  --red:#EF4444;--blue:#3B82F6;--amber:#F59E0B;
}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
.auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(ellipse 70% 60% at 15% 85%,rgba(0,232,122,.08) 0%,transparent 55%),
  radial-gradient(ellipse 50% 40% at 85% 15%,rgba(0,120,255,.06) 0%,transparent 55%),var(--bg);}
.auth-card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:48px 40px;width:440px;max-width:95vw;}
.auth-logo{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:var(--green);margin-bottom:6px;}
.auth-sub{font-size:13px;color:var(--muted);margin-bottom:36px;line-height:1.6;}
.auth-tabs{display:flex;gap:0;background:var(--card2);border-radius:12px;padding:4px;margin-bottom:28px;}
.auth-tab{flex:1;padding:9px;text-align:center;font-size:13px;font-weight:500;border-radius:9px;cursor:pointer;color:var(--muted);transition:.15s;}
.auth-tab.active{background:var(--card);color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,.4);}
.inp-group{margin-bottom:14px;}
.inp-label{font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.5px;text-transform:uppercase;margin-bottom:5px;display:block;}
.inp{width:100%;background:var(--card2);border:1.5px solid var(--border);border-radius:10px;padding:11px 14px;color:var(--text);font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:.2s;}
.inp:focus{border-color:var(--green);}
.inp-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.btn-main{width:100%;background:var(--green);color:#000;border:none;border-radius:11px;padding:13px;font-size:14px;font-weight:700;font-family:'Syne',sans-serif;cursor:pointer;transition:.2s;}
.btn-main:hover{background:var(--green2);}
.divider{text-align:center;font-size:12px;color:var(--muted);margin:16px 0;position:relative;}
.divider::before,.divider::after{content:'';position:absolute;top:50%;width:42%;height:1px;background:var(--border);}
.divider::before{left:0}.divider::after{right:0}
.google-btn{width:100%;background:var(--card2);border:1.5px solid var(--border);border-radius:11px;padding:12px;display:flex;align-items:center;justify-content:center;gap:10px;font-size:14px;font-weight:500;color:var(--text);font-family:'Inter',sans-serif;cursor:pointer;transition:.2s;}
.google-btn:hover{border-color:rgba(0,232,122,.35);}
.otp-wrap{display:flex;gap:10px;justify-content:center;margin:8px 0 16px;}
.otp-box{width:48px;height:56px;background:var(--card2);border:1.5px solid var(--border);border-radius:10px;text-align:center;font-size:22px;font-weight:700;color:var(--text);font-family:'Syne',sans-serif;outline:none;}
.otp-box:focus{border-color:var(--green);}
.auth-feats{margin-top:28px;display:flex;flex-direction:column;gap:8px;}
.auth-feat{display:flex;align-items:center;gap:9px;font-size:12px;color:var(--muted);}
.feat-dot{width:5px;height:5px;border-radius:50%;background:var(--green);flex-shrink:0;}
.app{display:flex;min-height:100vh;}
.sidebar{width:250px;background:var(--card);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:20px 0;position:fixed;top:0;left:0;bottom:0;z-index:100;}
.s-logo{padding:0 20px 20px;border-bottom:1px solid var(--border);margin-bottom:12px;}
.s-logo-t{font-family:'Syne',sans-serif;font-size:19px;font-weight:800;color:var(--green);}
.s-logo-s{font-size:10px;color:var(--muted);letter-spacing:.5px;text-transform:uppercase;margin-top:2px;}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 20px;cursor:pointer;transition:.15s;font-size:13px;color:var(--muted);border-left:3px solid transparent;font-weight:500;}
.nav-item:hover{background:rgba(0,232,122,.04);color:var(--text);}
.nav-item.active{color:var(--green);background:rgba(0,232,122,.07);border-left-color:var(--green);}
.nav-badge{margin-left:auto;background:var(--green);color:#000;font-size:10px;font-weight:700;padding:2px 7px;border-radius:100px;}
.s-bottom{margin-top:auto;padding:16px 20px;border-top:1px solid var(--border);}
.user-row{display:flex;align-items:center;gap:10px;}
.avatar{width:34px;height:34px;background:linear-gradient(135deg,var(--green),#00BFFF);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#000;flex-shrink:0;}
.u-name{font-size:13px;font-weight:500;}
.u-email{font-size:11px;color:var(--muted);}
.main{margin-left:250px;flex:1;padding:28px 32px;min-height:100vh;}
.ph{margin-bottom:28px;}
.pt{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;letter-spacing:-.5px;}
.ps{font-size:13px;color:var(--muted);margin-top:3px;}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px;}
.stat{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:18px;position:relative;overflow:hidden;}
.stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
.stat.g::before{background:var(--green)}.stat.b::before{background:var(--blue)}
.stat.a::before{background:var(--amber)}.stat.r::before{background:var(--red)}
.stat-l{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;}
.stat-v{font-family:'Syne',sans-serif;font-size:34px;font-weight:800;margin-top:6px;letter-spacing:-1px;}
.stat.g .stat-v{color:var(--green)}.stat.b .stat-v{color:var(--blue)}
.stat.a .stat-v{color:var(--amber)}.stat.r .stat-v{color:var(--red)}
.stat-sub{font-size:11px;color:var(--muted);margin-top:3px;}
.card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;margin-bottom:22px;}
.card-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:18px;display:flex;align-items:center;gap:8px;}
.card-title .ct-badge{font-size:11px;background:rgba(0,232,122,.12);color:var(--green);padding:2px 8px;border-radius:100px;font-family:'Inter',sans-serif;font-weight:600;}
.f-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:18px;}
.f-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;}
.fg{display:flex;flex-direction:column;gap:5px;}
.fl{font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.5px;text-transform:uppercase;}
.fi,.fs{background:var(--card2);border:1.5px solid var(--border);border-radius:10px;padding:10px 13px;color:var(--text);font-size:13px;font-family:'Inter',sans-serif;outline:none;transition:.2s;width:100%;appearance:none;cursor:pointer;}
.fi:focus,.fs:focus{border-color:var(--green);}
.fs option{background:#1A1A2E;}
.limit-bar-wrap{background:var(--card2);border-radius:100px;height:8px;margin-bottom:6px;overflow:hidden;}
.limit-bar{height:100%;border-radius:100px;background:linear-gradient(90deg,var(--green),#00BFFF);transition:.4s;}
.limit-info{display:flex;justify-content:space-between;font-size:11px;color:var(--muted);}
.region-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px;}
.region-block{background:var(--card2);border:1.5px solid var(--border);border-radius:12px;padding:12px;cursor:pointer;transition:.2s;}
.region-block:hover{border-color:rgba(0,232,122,.3);}
.region-block.open{border-color:rgba(0,232,122,.5);background:rgba(0,232,122,.04);}
.region-name{font-size:12px;font-weight:600;margin-bottom:8px;color:var(--text);}
.city-list{display:flex;flex-wrap:wrap;gap:5px;}
.city-chip{padding:4px 10px;border-radius:100px;font-size:11px;font-weight:500;border:1.5px solid var(--border);color:var(--muted);cursor:pointer;transition:.15s;background:var(--card);}
.city-chip:hover{border-color:rgba(0,232,122,.3);color:var(--text);}
.city-chip.sel{border-color:var(--green);color:var(--green);background:rgba(0,232,122,.08);}
.selected-cities{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;}
.sel-city-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;background:rgba(0,232,122,.1);border:1px solid rgba(0,232,122,.2);border-radius:100px;font-size:12px;color:var(--green);font-weight:500;}
.sel-city-tag button{background:none;border:none;color:var(--green);cursor:pointer;font-size:14px;line-height:1;padding:0;}
.site-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:18px;}
.site-chip{border:1.5px solid var(--border);border-radius:12px;padding:12px 8px;text-align:center;cursor:pointer;transition:.2s;font-size:12px;font-weight:500;color:var(--muted);background:var(--card2);}
.site-chip:hover{border-color:rgba(0,232,122,.3);color:var(--text);}
.site-chip.sel{border-color:var(--green);color:var(--green);background:rgba(0,232,122,.06);}
.site-icon{font-size:20px;display:block;margin-bottom:5px;}
.btn-p{background:var(--green);color:#000;border:none;border-radius:10px;padding:12px 26px;font-size:13px;font-weight:700;font-family:'Syne',sans-serif;cursor:pointer;transition:.2s;display:inline-flex;align-items:center;gap:8px;}
.btn-p:hover{background:var(--green2);transform:translateY(-1px);}
.btn-p:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.btn-s{background:transparent;color:var(--muted);border:1px solid var(--border);border-radius:10px;padding:10px 16px;font-size:12px;font-weight:500;cursor:pointer;transition:.2s;font-family:'Inter',sans-serif;}
.btn-s:hover{color:var(--text);border-color:rgba(255,255,255,.2);}
.btn-s.act{border-color:var(--green);color:var(--green);}
.tbl-card{background:var(--card);border:1px solid var(--border);border-radius:18px;overflow:hidden;}
.tbl-head{padding:18px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
.tbl-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;}
table{width:100%;border-collapse:collapse;}
th{padding:10px 20px;text-align:left;font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border);background:rgba(255,255,255,.015);}
td{padding:13px 20px;font-size:12px;border-bottom:1px solid rgba(255,255,255,.04);}
tr:last-child td{border-bottom:none;}
tr:hover td{background:rgba(255,255,255,.015);}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:100px;font-size:11px;font-weight:600;}
.tag{display:inline-block;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;background:rgba(0,232,122,.1);color:var(--green);letter-spacing:.3px;}
.proof-btn{background:rgba(59,130,246,.1);color:#3B82F6;border:1px solid rgba(59,130,246,.2);border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer;font-weight:600;transition:.2s;}
.proof-btn:hover{background:rgba(59,130,246,.2);}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(5px);z-index:1000;display:flex;align-items:center;justify-content:center;}
.modal{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:28px;width:500px;max-width:92vw;}
.modal-t{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-bottom:6px;}
.modal-s{font-size:12px;color:var(--muted);margin-bottom:20px;}
.prog-wrap{background:var(--card2);border-radius:100px;height:6px;margin-bottom:18px;overflow:hidden;}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--green),#00BFFF);border-radius:100px;transition:width .5s ease;}
.step-list{display:flex;flex-direction:column;gap:8px;margin-bottom:20px;}
.step{display:flex;align-items:center;gap:11px;font-size:12px;padding:11px;border-radius:10px;background:var(--card2);}
.step.done{color:var(--green);}
.step.active{color:var(--text);border:1px solid rgba(0,232,122,.2);}
.step.wait{color:var(--muted);}
.spin{width:14px;height:14px;border:2px solid rgba(0,232,122,.3);border-top-color:var(--green);border-radius:50%;animation:sp .8s linear infinite;flex-shrink:0;}
@keyframes sp{to{transform:rotate(360deg);}}
.proof-modal{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:28px;width:560px;max-width:92vw;}
.proof-ss{background:var(--card2);border:1px solid var(--border);border-radius:12px;padding:20px;margin:14px 0;font-size:12px;color:var(--muted);}
.proof-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);}
.proof-row:last-child{border-bottom:none;}
.proof-key{color:var(--muted);}
.proof-val{color:var(--text);font-weight:500;}
.limit-alert{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:12px;padding:14px 18px;font-size:13px;color:#EF4444;display:flex;align-items:center;gap:10px;margin-bottom:18px;}
.toast{position:fixed;bottom:22px;right:22px;background:var(--card);border:1px solid rgba(0,232,122,.3);border-radius:12px;padding:13px 18px;font-size:13px;color:var(--green);z-index:9999;display:flex;align-items:center;gap:9px;animation:tup .3s ease;box-shadow:0 8px 32px rgba(0,0,0,.4);}
@keyframes tup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.empty{text-align:center;padding:50px 20px;color:var(--muted);}
.empty-i{font-size:42px;margin-bottom:14px;opacity:.5;}
`;
function ApplyModal({ jobs: applyJobs, onClose, onDone }) {
  const [step, setStep] = useState(0);
  const total = applyJobs.count || 1;
  const stepsIT = [
    { icon: "📄", label: "Lettura e analisi del CV..." },
    { icon: "🤖", label: "Generazione lettera di presentazione in italiano..." },
    { icon: "🔍", label: `Ricerca lavoro su ${total} siti...` },
    { icon: "📝", label: "Compilazione moduli di candidatura..." },
    { icon: "📤", label: `Invio di ${total} candidature...` },
    { icon: "✅", label: "Tutte le candidature completate!" },
  ];

  useEffect(() => {
    if (step < stepsIT.length - 1) {
      const t = setTimeout(() => setStep(s => s + 1), 900);
      return () => clearTimeout(t);
    } else { setTimeout(onDone, 700); }
  }, [step]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-t">🚀 Candidatura in corso...</div>
        <div className="modal-s">Applying to {total} positions automatically</div>
        <div className="prog-wrap">
          <div className="prog-fill" style={{ width: `${((step+1)/stepsIT.length)*100}%` }} />
        </div>
        <div className="step-list">
          {stepsIT.map((s, i) => (
            <div key={i} className={`step ${i<step?'done':i===step?'active':'wait'}`}>
              <span style={{width:18,textAlign:'center',flexShrink:0}}>
                {i<step ? '✓' : i===step ? <div className="spin"/> : s.icon}
              </span>
              {s.label}
            </div>
          ))}
        </div>
        {step < stepsIT.length-1 &&
          <button className="btn-s" onClick={onClose} style={{width:'100%'}}>Annulla</button>}
      </div>
    </div>
  );
}

function ProofModal({ job, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="proof-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-t">📋 Application Proof</div>
        <div className="modal-s">Confirmation record for this application</div>
        <div className="proof-ss">
          <div className="proof-row"><span className="proof-key">Application ID</span><span className="proof-val">#{String(job.id).padStart(6,'0')}</span></div>
          <div className="proof-row"><span className="proof-key">Position</span><span className="proof-val">{job.position}</span></div>
          <div className="proof-row"><span className="proof-key">Company</span><span className="proof-val">{job.company}</span></div>
          <div className="proof-row"><span className="proof-key">Website</span><span className="proof-val">{job.site}</span></div>
          <div className="proof-row"><span className="proof-key">City</span><span className="proof-val">🇮🇹 {job.city}</span></div>
          <div className="proof-row"><span className="proof-key">Applied On</span><span className="proof-val">{job.date} at {job.time}</span></div>
          <div className="proof-row"><span className="proof-key">Status</span><span className="proof-val" style={{color:STATUS_CONFIG[job.status]?.color}}>{STATUS_CONFIG[job.status]?.label}</span></div>
          <div className="proof-row"><span className="proof-key">Confirmation #</span><span className="proof-val" style={{color:'var(--green)',fontFamily:'monospace'}}>{job.confirmId}</span></div>
        </div>
        <div style={{display:'flex',gap:10,marginTop:6}}>
          <button className="btn-p" style={{fontSize:12,padding:'9px 18px'}}
            onClick={() => { navigator.clipboard?.writeText(job.confirmId); onClose(); }}>
            📋 Copy ID
          </button>
          <button className="btn-s" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
 );
}
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['','','','','','']);
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' });
  const otpRefs = useRef([]);

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) otpRefs.current[i+1]?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key==='Backspace' && !otp[i] && i>0) otpRefs.current[i-1]?.focus();
  };

  const handleSubmit = () => {
    onLogin({
      name: form.name || 'Utente JobPilot',
      email: form.email || 'utente@email.com',
      phone: form.phone || '+39 333 0000000',
      avatar: (form.name||'UJ').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(),
    });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">⚡ JobPilot Italia</div>
        <div className="auth-sub">Sistema automatico di candidature lavoro in Italia.<br/>Applica a 10 posizioni ogni giorno — automaticamente.</div>
        <div className="auth-tabs">
          <div className={`auth-tab ${tab==='login'?'active':''}`} onClick={()=>setTab('login')}>Accedi</div>
          <div className={`auth-tab ${tab==='register'?'active':''}`} onClick={()=>setTab('register')}>Registrati</div>
        </div>
        {tab==='register' && (
          <div className="inp-row">
            <div className="inp-group">
              <label className="inp-label">Nome completo</label>
              <input className="inp" placeholder="Mario Rossi" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            </div>
            <div className="inp-group">
              <label className="inp-label">Numero di telefono</label>
              <input className="inp" placeholder="+39 333..." value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
            </div>
          </div>
        )}
        <div className="inp-group">
          <label className="inp-label">Email</label>
          <input className="inp" type="email" placeholder="tuo@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        </div>
        <div className="inp-group">
          <label className="inp-label">Password</label>
          <input className="inp" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        </div>
        {tab==='register' && !otpSent && (
          <div style={{marginBottom:14}}>
            <button className="btn-s" style={{width:'100%'}} onClick={()=>setOtpSent(true)}>
              📱 Verifica con SMS / Gmail OTP
            </button>
          </div>
        )}
        {otpSent && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,color:'var(--muted)',textAlign:'center',marginBottom:8}}>
              Inserisci il codice inviato a {form.phone||form.email}
            </div>
            <div className="otp-wrap">
              {otp.map((v,i)=>(
                <input key={i} className="otp-box" maxLength={1} value={v}
                  ref={el=>otpRefs.current[i]=el}
                  onChange={e=>handleOtpChange(i,e.target.value)}
                  onKeyDown={e=>handleOtpKey(i,e)}/>
              ))}
            </div>
          </div>
        )}
        <button className="btn-main" onClick={handleSubmit}>
          {tab==='login' ? '🔑 Accedi' : '🚀 Crea Account'}
        </button>
        <div className="divider">oppure</div>
        <button className="google-btn" onClick={()=>onLogin({name:'Utente Google',email:'utente@gmail.com',phone:'+39 333 0000000',avatar:'UG'})}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continua con Google
        </button>
        <div className="auth-feats">
          <div className="auth-feat"><div className="feat-dot"/><span>10 candidature automatiche al giorno</span></div>
          <div className="auth-feat"><div className="feat-dot"/><span>Verifica sicurezza via SMS o Gmail OTP</span></div>
          <div className="auth-feat"><div className="feat-dot"/><span>Traccia tutte le candidature con prove</span></div>
          <div className="auth-feat"><div className="feat-dot"/><span>Lettera di presentazione AI in italiano</span></div>
        </div>
      </div>
    </div>
  );
          }

function ApplyPage({ onSubmit, cvUploaded, onCvUpload, dailyCount, dailyLimit }) {
  const [position, setPosition] = useState('');
  const [customPos, setCustomPos] = useState('');
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [applyCount, setApplyCount] = useState(1);

  const remaining = dailyLimit - dailyCount;
  const toggleCity = (city) => setSelectedCities(c=>c.includes(city)?c.filter(x=>x!==city):[...c,city]);
  const toggleSite = (name) => setSelectedSites(s=>s.includes(name)?s.filter(x=>x!==name):[...s,name]);
  const finalPos = customPos || position;
  const canApply = finalPos && selectedCities.length>0 && selectedSites.length>0 && cvUploaded && remaining>0;

  return (
    <>
      <div className="ph">
        <div className="pt">Nuova Candidatura</div>
        <div className="ps">Configura e invia candidature automaticamente</div>
      </div>
      <div className="card">
        <div className="card-title">⚡ Limite Giornaliero <span className="ct-badge">{dailyCount}/{dailyLimit} oggi</span></div>
        <div className="limit-bar-wrap">
          <div className="limit-bar" style={{width:`${(dailyCount/dailyLimit)*100}%`,background:remaining===0?'var(--red)':undefined}}/>
        </div>
        <div className="limit-info">
          <span>{dailyCount} candidature inviate oggi</span>
          <span style={{color:remaining>0?'var(--green)':'var(--red)'}}>
            {remaining>0?`${remaining} rimanenti`:'⛔ Limite raggiunto per oggi'}
          </span>
        </div>
      </div>
      {remaining===0 && (
        <div className="limit-alert">⛔ Hai raggiunto il limite di {dailyLimit} candidature per oggi. Torna domani!</div>
      )}
      <div className="card">
        <div className="card-title">📄 Il tuo CV / Resume</div>
        <div style={{border:`2px dashed ${cvUploaded?'rgba(0,232,122,.4)':'var(--border)'}`,borderRadius:12,padding:24,textAlign:'center',cursor:'pointer',background:cvUploaded?'rgba(0,232,122,.03)':''}}
          onClick={onCvUpload}>
          {cvUploaded
            ? <><div style={{fontSize:32,marginBottom:8}}>✅</div><div style={{fontSize:13,color:'var(--green)',fontWeight:600}}>CV caricato con successo</div><div style={{fontSize:11,color:'var(--muted)',marginTop:4}}>Analisi AI completata · Clicca per cambiare</div></>
            : <><div style={{fontSize:32,marginBottom:8}}>☁️</div><div style={{fontSize:13,color:'var(--muted)'}}><strong style={{color:'var(--text)'}}>Clicca per caricare il CV</strong><br/>PDF o DOCX supportati</div></>
          }
        </div>
      </div>
      <div className="card">
        <div className="card-title">💼 Posizione Lavorativa</div>
        <div className="f-grid">
          <div className="fg">
            <span className="fl">Seleziona posizione</span>
            <select className="fs" value={position} onChange={e=>setPosition(e.target.value)}>
              <option value="">Scegli un ruolo...</option>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="fg">
            <span className="fl">Oppure scrivi personalizzato</span>
            <input className="fi" placeholder="es. Barista, Cuoco..." value={customPos} onChange={e=>setCustomPos(e.target.value)}/>
          </div>
          <div className="fg">
            <span className="fl">Tipo contratto</span>
            <select className="fs">
              <option>Tempo pieno</option>
              <option>Part-time</option>
              <option>Tempo determinato</option>
              <option>Stage / Tirocinio</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">📍 Città in Italia {selectedCities.length>0&&<span className="ct-badge">{selectedCities.length} selezionate</span>}</div>
        {selectedCities.length>0&&(
          <div className="selected-cities">
            {selectedCities.map(c=>(
              <span key={c} className="sel-city-tag">🇮🇹 {c}<button onClick={()=>toggleCity(c)}>×</button></span>
            ))}
          </div>
        )}
        <div className="region-grid">
          {ITALIAN_REGIONS.map(r=>(
            <div key={r.name} className="region-block">
              <div className="region-name">🏛️ {r.name}</div>
              <div className="city-list">
                {r.cities.map(c=>(
                  <span key={c} className={`city-chip ${selectedCities.includes(c)?'sel':''}`}
                    onClick={()=>toggleCity(c)}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-title">🌐 Siti dove candidarsi</div>
        <div className="site-grid">
          {JOB_SITES.map(s=>(
            <div key={s.name} className={`site-chip ${selectedSites.includes(s.name)?'sel':''}`}
              onClick={()=>toggleSite(s.name)}>
              <span className="site-icon">{s.icon}</span>{s.name}
            </div>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:18,padding:14,background:'var(--card2)',borderRadius:12}}>
          <span style={{fontSize:12,color:'var(--muted)',whiteSpace:'nowrap'}}>Candidature da inviare:</span>
          <input type="range" min={1} max={Math.min(remaining,10)} value={applyCount}
            onChange={e=>setApplyCount(+e.target.value)} style={{flex:1,accentColor:'var(--green)'}}/>
          <span style={{fontSize:16,fontWeight:700,color:'var(--green)',fontFamily:'Syne',minWidth:24}}>{applyCount}</span>
          <span style={{fontSize:11,color:'var(--muted)'}}>/ {remaining} rimanenti</span>
        </div>
        <button className="btn-p" disabled={!canApply}
          onClick={()=>onSubmit({position:finalPos,sites:selectedSites,cities:selectedCities,count:applyCount})}>
          🚀 Invia {applyCount} Candidatura{applyCount>1?'e':''}
        </button>
        {!cvUploaded&&<span style={{fontSize:11,color:'var(--muted)',marginLeft:12}}>⚠️ Carica prima il tuo CV</span>}
      </div>
    </>
  );
    }
function TrackerPage({ jobs, onStatusChange, onProof }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter==='all' ? jobs : jobs.filter(j=>j.status===filter);
  return (
    <>
      <div className="ph">
        <div className="pt">Tracking Candidature</div>
        <div className="ps">{jobs.length} candidature totali</div>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
        {['all',...Object.keys(STATUS_CONFIG)].map(f=>(
          <button key={f} className={`btn-s ${filter===f?'act':''}`} onClick={()=>setFilter(f)}>
            {f==='all'?'📋 Tutte':STATUS_CONFIG[f].dot+' '+STATUS_CONFIG[f].label}
            <span style={{marginLeft:5,opacity:.6,fontSize:10}}>({f==='all'?jobs.length:jobs.filter(j=>j.status===f).length})</span>
          </button>
        ))}
      </div>
      <div className="tbl-card">
        {filtered.length===0
          ? <div className="empty"><div className="empty-i">📭</div><div>Nessuna candidatura</div></div>
          : <table>
              <thead><tr><th>Posizione</th><th>Azienda</th><th>Sito</th><th>Città</th><th>Data/Ora</th><th>Stato</th><th>Prova</th><th>Aggiorna</th></tr></thead>
              <tbody>
                {filtered.map(job=>{
                  const sc=STATUS_CONFIG[job.status];
                  return (
                    <tr key={job.id}>
                      <td style={{fontWeight:600}}>{job.position}</td>
                      <td style={{color:'var(--muted)',fontSize:11}}>{job.company}</td>
                      <td><span className="tag">{job.site}</span></td>
                      <td>🇮🇹 {job.city}</td>
                      <td style={{color:'var(--muted)',fontSize:11}}>{job.date}<br/>{job.time}</td>
                      <td><span className="badge" style={{background:sc.color+'22',color:sc.color}}>{sc.dot} {sc.label}</span></td>
                      <td><button className="proof-btn" onClick={()=>onProof(job)}>🧾 Prova</button></td>
                      <td>
                        <select className="fs" style={{padding:'4px 8px',fontSize:11,width:'auto'}}
                          value={job.status} onChange={e=>onStatusChange(job.id,e.target.value)}>
                          {Object.entries(STATUS_CONFIG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        }
      </div>
    </>
  );
}

function DashPage({ user, jobs, onApply, dailyCount, dailyLimit }) {
  const stats = {
    total:jobs.length,
    interview:jobs.filter(j=>j.status==='interview').length,
    offer:jobs.filter(j=>j.status==='offer').length,
    rejected:jobs.filter(j=>j.status==='rejected').length,
  };
  return (
    <>
      <div className="ph">
        <div className="pt">Benvenuto, {user.name.split(' ')[0]} 👋</div>
        <div className="ps">Riepilogo delle tue candidature in Italia</div>
      </div>
      <div className="stats">
        <div className="stat g"><div className="stat-l">Totale Inviate</div><div className="stat-v">{stats.total}</div><div className="stat-sub">{dailyCount} oggi</div></div>
        <div className="stat b"><div className="stat-l">Colloqui</div><div className="stat-v">{stats.interview}</div></div>
        <div className="stat a"><div className="stat-l">Offerte</div><div className="stat-v">{stats.offer}</div></div>
        <div className="stat r"><div className="stat-l">Rifiutate</div><div className="stat-v">{stats.rejected}</div></div>
      </div>
      <div className="card">
        <div className="card-title">⚡ Candidature Oggi <span className="ct-badge">{dailyCount}/{dailyLimit}</span></div>
        <div className="limit-bar-wrap"><div className="limit-bar" style={{width:`${(dailyCount/dailyLimit)*100}%`}}/></div>
        <div className="limit-info">
          <span>{dailyCount} inviate</span>
          <span style={{color:'var(--green)'}}>{dailyLimit-dailyCount} rimaste oggi</span>
        </div>
      </div>
      <div className="tbl-card">
        <div className="tbl-head">
          <div className="tbl-title">Ultime Candidature</div>
          <button className="btn-p" style={{fontSize:12,padding:'9px 18px'}} onClick={onApply}>+ Nuova</button>
        </div>
        {jobs.length===0
          ? <div className="empty"><div className="empty-i">📭</div><div>Nessuna candidatura ancora</div></div>
          : <table>
              <thead><tr><th>Posizione</th><th>Azienda</th><th>Sito</th><th>Città</th><th>Stato</th></tr></thead>
              <tbody>
                {jobs.slice(0,5).map(job=>{
                  const sc=STATUS_CONFIG[job.status];
                  return (
                    <tr key={job.id}>
                      <td style={{fontWeight:600}}>{job.position}</td>
                      <td style={{color:'var(--muted)',fontSize:11}}>{job.company}</td>
                      <td><span className="tag">{job.site}</span></td>
                      <td>🇮🇹 {job.city}</td>
                      <td><span className="badge" style={{background:sc.color+'22',color:sc.color}}>{sc.dot} {sc.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        }
      </div>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [cvUploaded, setCvUploaded] = useState(false);
  const [applyModal, setApplyModal] = useState(null);
  const [proofJob, setProofJob] = useState(null);
  const [toast, setToast] = useState(null);
  const [dailyCount, setDailyCount] = useState(3);
  const DAILY_LIMIT = 10;

  const [jobs, setJobs] = useState([
    {id:1,position:"Software Developer",site:"LinkedIn",city:"Milano",status:"interview",date:"2025-03-10",time:"09:14",company:"TechCorp Italia",confirmId:"IT-LK-2025-001"},
    {id:2,position:"Web Designer",site:"Indeed",city:"Roma",status:"applied",date:"2025-03-10",time:"09:15",company:"Studio Creativo",confirmId:"IT-IN-2025-002"},
    {id:3,position:"Data Analyst",site:"InfoJobs",city:"Torino",status:"rejected",date:"2025-03-08",time:"14:30",company:"DataSoft Srl",confirmId:"IT-IJ-2025-003"},
  ]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const handleApplyDone = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const dateStr = now.toISOString().split('T')[0];
    const siteList = applyModal.sites.length>0 ? applyModal.sites : ['LinkedIn'];
    const cityList = applyModal.cities.length>0 ? applyModal.cities : ['Milano'];
    const count = Math.min(applyModal.count, DAILY_LIMIT-dailyCount);
    const newJobs = [];
    for (let i=0; i<count; i++) {
      const site = siteList[i%siteList.length];
      const city = cityList[i%cityList.length];
      newJobs.push({
        id:Date.now()+i, position:applyModal.position, site, city,
        status:'applied', date:dateStr, time:timeStr,
        company:COMPANIES[Math.floor(Math.random()*COMPANIES.length)],
        confirmId:`IT-${site.slice(0,2).toUpperCase()}-2025-${String(Date.now()).slice(-4)}`,
      });
    }
    setJobs(j=>[...newJobs,...j]);
    setDailyCount(d=>Math.min(d+count,DAILY_LIMIT));
    setApplyModal(null);
    setPage('tracker');
    showToast(`✅ ${count} candidature inviate con successo!`);
  };

  const NAV = [
    {id:'dashboard',icon:'⬛',label:'Dashboard'},
    {id:'apply',icon:'🚀',label:'Nuova Candidatura'},
    {id:'tracker',icon:'📊',label:'Tracking',badge:jobs.filter(j=>j.status==='interview').length||null},
    {id:'cv',icon:'📄',label:'Il mio CV'},
    {id:'settings',icon:'⚙️',label:'Impostazioni'},
  ];

  if (!user) return <><style>{S}</style><AuthPage onLogin={setUser}/></>;

  return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="sidebar">
          <div className="s-logo">
            <div className="s-logo-t">⚡ JobPilot</div>
            <div className="s-logo-s">Italia · Auto Apply</div>
          </div>
          {NAV.map(n=>(
            <div key={n.id} className={`nav-item ${page===n.id?'active':''}`} onClick={()=>setPage(n.id)}>
              <span>{n.icon}</span>{n.label}
              {n.badge?<span className="nav-badge">{n.badge}</span>:null}
            </div>
          ))}
          <div className="s-bottom">
            <div className="user-row">
              <div className="avatar">{user.avatar}</div>
              <div><div className="u-name">{user.name}</div><div className="u-email">{user.email}</div></div>
            </div>
          </div>
        </div>
        <div className="main">
          {page==='dashboard' && <DashPage user={user} jobs={jobs} onApply={()=>setPage('apply')} dailyCount={dailyCount} dailyLimit={DAILY_LIMIT}/>}
          {page==='apply' && <ApplyPage onSubmit={setApplyModal} cvUploaded={cvUploaded} onCvUpload={()=>setCvUploaded(true)} dailyCount={dailyCount} dailyLimit={DAILY_LIMIT}/>}
          {page==='tracker' && <TrackerPage jobs={jobs} onStatusChange={(id,status)=>{setJobs(js=>js.map(j=>j.id===id?{...j,status}:j));showToast(`Stato: ${STATUS_CONFIG[status]?.label}`);}} onProof={setProofJob}/>}
          {page==='cv' && (
            <>
              <div className="ph"><div className="pt">Il mio CV</div></div>
              <div className="card">
                <div className="card-title">📄 Carica CV</div>
                <div style={{border:`2px dashed ${cvUploaded?'rgba(0,232,122,.4)':'var(--border)'}`,borderRadius:12,padding:32,textAlign:'center',cursor:'pointer'}} onClick={()=>setCvUploaded(true)}>
                  {cvUploaded
                    ? <><div style={{fontSize:36,marginBottom:10}}>✅</div><div style={{color:'var(--green)',fontWeight:600}}>CV_Resume.pdf</div></>
                    : <><div style={{fontSize:36,marginBottom:10}}>☁️</div><div style={{fontSize:13}}>Clicca per caricare il CV</div></>
                  }
                </div>
              </div>
            </>
          )}
          {page==='settings' && (
            <>
              <div className="ph"><div className="pt">Impostazioni</div></div>
              <div className="card">
                <div className="card-title">👤 Profilo</div>
                <div className="f-grid">
                  <div className="fg"><span className="fl">Nome</span><input className="fi" defaultValue={user.name}/></div>
                  <div className="fg"><span className="fl">Email</span><input className="fi" defaultValue={user.email}/></div>
                  <div className="fg"><span className="fl">Telefono</span><input className="fi" defaultValue={user.phone}/></div>
                </div>
                <div className="f-grid-2" style={{marginTop:16}}>
                  <div className="fg"><span className="fl">Metodo verifica</span>
                    <select className="fs"><option>SMS OTP</option><option>Gmail OTP</option></select>
                  </div>
                  <div className="fg"><span className="fl">Limite/giorno</span>
                    <select className="fs"><option>10 (Standard)</option><option>20 (Pro)</option></select>
                  </div>
                </div>
                <button className="btn-p">💾 Salva modifiche</button>
              </div>
            </>
          )}
        </div>
        {applyModal && <ApplyModal jobs={applyModal} onClose={()=>setApplyModal(null)} onDone={handleApplyDone}/>}
        {proofJob && <ProofModal job={proofJob} onClose={()=>setProofJob(null)}/>}
        {toast && <div className="toast">⚡ {toast}</div>}
      </div>
    </>
  );
}
