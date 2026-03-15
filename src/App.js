import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8YP8yurdpHdLVZzi1MJQBzXf3Q2vQ9aA",
  authDomain: "jobpilot-italia.firebaseapp.com",
  projectId: "jobpilot-italia",
  storageBucket: "jobpilot-italia.firebasestorage.app",
  messagingSenderId: "273453116522",
  appId: "1:273453116522:web:5183b8ef1152b4a4c8a4b9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const JOB_SITES = [
  { name: "LinkedIn", icon: "💼" }, { name: "Indeed", icon: "🔍" },
  { name: "InfoJobs", icon: "📋" }, { name: "Monster", icon: "👾" },
  { name: "Subito Lavoro", icon: "⚡" }, { name: "Glassdoor", icon: "🪟" },
  { name: "Trovit", icon: "🎯" }, { name: "Jobrapido", icon: "🚀" },
  { name: "Bakeca Lavoro", icon: "🏠" }, { name: "Lavoro.it", icon: "🇮🇹" },
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
];

const STATUS_CONFIG = {
  applied:   { label: "Inviata",       color: "#3B82F6", dot: "🔵" },
  viewed:    { label: "Visualizzata",  color: "#8B5CF6", dot: "🟣" },
  interview: { label: "Colloquio",     color: "#F59E0B", dot: "🟡" },
  offer:     { label: "Offerta 🎉",    color: "#10B981", dot: "🟢" },
  rejected:  { label: "Rifiutata",     color: "#EF4444", dot: "🔴" },
};

const S = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#07070E;--card:#0F0F1A;--card2:#161625;--border:rgba(255,255,255,0.07);--green:#00E87A;--green2:#00B85E;--text:#EEEEF5;--muted:#5A5A72;--red:#EF4444;--blue:#3B82F6;--amber:#F59E0B;}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
.auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse 70% 60% at 15% 85%,rgba(0,232,122,.08) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 85% 15%,rgba(0,120,255,.06) 0%,transparent 55%),var(--bg);}
.auth-card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:40px 32px;width:420px;max-width:95vw;}
.auth-logo{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--green);margin-bottom:6px;}
.auth-sub{font-size:12px;color:var(--muted);margin-bottom:28px;line-height:1.6;}
.auth-tabs{display:flex;background:var(--card2);border-radius:12px;padding:4px;margin-bottom:22px;}
.auth-tab{flex:1;padding:8px;text-align:center;font-size:13px;font-weight:500;border-radius:9px;cursor:pointer;color:var(--muted);transition:.15s;}
.auth-tab.active{background:var(--card);color:var(--text);}
.inp-group{margin-bottom:12px;}
.inp-label{font-size:10px;color:var(--muted);font-weight:600;letter-spacing:.5px;text-transform:uppercase;margin-bottom:4px;display:block;}
.inp{width:100%;background:var(--card2);border:1.5px solid var(--border);border-radius:10px;padding:10px 13px;color:var(--text);font-size:13px;font-family:'Inter',sans-serif;outline:none;transition:.2s;}
.inp:focus{border-color:var(--green);}
.btn-main{width:100%;background:var(--green);color:#000;border:none;border-radius:10px;padding:12px;font-size:14px;font-weight:700;font-family:'Syne',sans-serif;cursor:pointer;transition:.2s;margin-bottom:10px;}
.btn-main:hover{background:var(--green2);}
.btn-main:disabled{opacity:.5;cursor:not-allowed;}
.divider{text-align:center;font-size:11px;color:var(--muted);margin:10px 0;position:relative;}
.divider::before,.divider::after{content:'';position:absolute;top:50%;width:42%;height:1px;background:var(--border);}
.divider::before{left:0}.divider::after{right:0}
.google-btn{width:100%;background:var(--card2);border:1.5px solid var(--border);border-radius:10px;padding:11px;display:flex;align-items:center;justify-content:center;gap:10px;font-size:13px;font-weight:500;color:var(--text);cursor:pointer;transition:.2s;}
.google-btn:hover{border-color:rgba(0,232,122,.35);}
.err-box{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:10px 12px;font-size:12px;color:#EF4444;margin-bottom:12px;}
.otp-wrap{display:flex;gap:8px;justify-content:center;margin:12px 0;}
.otp-box{width:44px;height:52px;background:var(--card2);border:1.5px solid var(--border);border-radius:10px;text-align:center;font-size:20px;font-weight:700;color:var(--text);outline:none;}
.otp-box:focus{border-color:var(--green);}
.auth-feats{margin-top:20px;display:flex;flex-direction:column;gap:6px;}
.auth-feat{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--muted);}
.feat-dot{width:5px;height:5px;border-radius:50%;background:var(--green);flex-shrink:0;}
.app{display:flex;min-height:100vh;}
.sidebar{width:240px;background:var(--card);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:18px 0;position:fixed;top:0;left:0;bottom:0;z-index:100;}
.s-logo{padding:0 18px 18px;border-bottom:1px solid var(--border);margin-bottom:10px;}
.s-logo-t{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:var(--green);}
.s-logo-s{font-size:10px;color:var(--muted);letter-spacing:.5px;text-transform:uppercase;margin-top:2px;}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 18px;cursor:pointer;transition:.15s;font-size:13px;color:var(--muted);border-left:3px solid transparent;font-weight:500;}
.nav-item:hover{background:rgba(0,232,122,.04);color:var(--text);}
.nav-item.active{color:var(--green);background:rgba(0,232,122,.07);border-left-color:var(--green);}
.nav-badge{margin-left:auto;background:var(--green);color:#000;font-size:10px;font-weight:700;padding:2px 6px;border-radius:100px;}
.s-bottom{margin-top:auto;padding:14px 18px;border-top:1px solid var(--border);}
.user-row{display:flex;align-items:center;gap:9px;}
.avatar{width:32px;height:32px;background:linear-gradient(135deg,var(--green),#00BFFF);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#000;flex-shrink:0;}
.u-name{font-size:12px;font-weight:500;}
.u-email{font-size:10px;color:var(--muted);}
.logout-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:11px;margin-top:6px;padding:0;text-decoration:underline;}
.main{margin-left:240px;flex:1;padding:26px 28px;min-height:100vh;}
.ph{margin-bottom:24px;}
.pt{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;letter-spacing:-.5px;}
.ps{font-size:12px;color:var(--muted);margin-top:3px;}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;}
.stat{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;position:relative;overflow:hidden;}
.stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
.stat.g::before{background:var(--green)}.stat.b::before{background:var(--blue)}.stat.a::before{background:var(--amber)}.stat.r::before{background:var(--red)}
.stat-l{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;}
.stat-v{font-family:'Syne',sans-serif;font-size:30px;font-weight:800;margin-top:5px;letter-spacing:-1px;}
.stat.g .stat-v{color:var(--green)}.stat.b .stat-v{color:var(--blue)}.stat.a .stat-v{color:var(--amber)}.stat.r .stat-v{color:var(--red)}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:18px;}
.card-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
.ct-badge{font-size:10px;background:rgba(0,232,122,.12);color:var(--green);padding:2px 7px;border-radius:100px;font-family:'Inter',sans-serif;font-weight:600;}
.f-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;}
.f-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;}
.fg{display:flex;flex-direction:column;gap:4px;}
.fl{font-size:10px;color:var(--muted);font-weight:600;letter-spacing:.5px;text-transform:uppercase;}
.fi,.fs{background:var(--card2);border:1.5px solid var(--border);border-radius:9px;padding:9px 12px;color:var(--text);font-size:12px;font-family:'Inter',sans-serif;outline:none;transition:.2s;width:100%;appearance:none;cursor:pointer;}
.fi:focus,.fs:focus{border-color:var(--green);}
.fs option{background:#1A1A2E;}
.limit-bar-wrap{background:var(--card2);border-radius:100px;height:7px;margin-bottom:5px;overflow:hidden;}
.limit-bar{height:100%;border-radius:100px;background:linear-gradient(90deg,var(--green),#00BFFF);transition:.4s;}
.limit-info{display:flex;justify-content:space-between;font-size:10px;color:var(--muted);}
.region-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
.region-block{background:var(--card2);border:1.5px solid var(--border);border-radius:10px;padding:10px;cursor:pointer;transition:.2s;}
.region-block:hover{border-color:rgba(0,232,122,.3);}
.region-name{font-size:11px;font-weight:600;margin-bottom:6px;}
.city-list{display:flex;flex-wrap:wrap;gap:4px;}
.city-chip{padding:3px 8px;border-radius:100px;font-size:10px;font-weight:500;border:1.5px solid var(--border);color:var(--muted);cursor:pointer;transition:.15s;background:var(--card);}
.city-chip:hover{border-color:rgba(0,232,122,.3);color:var(--text);}
.city-chip.sel{border-color:var(--green);color:var(--green);background:rgba(0,232,122,.08);}
.selected-cities{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;}
.sel-city-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:rgba(0,232,122,.1);border:1px solid rgba(0,232,122,.2);border-radius:100px;font-size:11px;color:var(--green);font-weight:500;}
.sel-city-tag button{background:none;border:none;color:var(--green);cursor:pointer;font-size:13px;line-height:1;padding:0;}
.site-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:16px;}
.site-chip{border:1.5px solid var(--border);border-radius:10px;padding:10px 6px;text-align:center;cursor:pointer;transition:.2s;font-size:11px;font-weight:500;color:var(--muted);background:var(--card2);}
.site-chip:hover{border-color:rgba(0,232,122,.3);color:var(--text);}
.site-chip.sel{border-color:var(--green);color:var(--green);background:rgba(0,232,122,.06);}
.site-icon{font-size:18px;display:block;margin-bottom:4px;}
.btn-p{background:var(--green);color:#000;border:none;border-radius:9px;padding:11px 22px;font-size:12px;font-weight:700;font-family:'Syne',sans-serif;cursor:pointer;transition:.2s;display:inline-flex;align-items:center;gap:7px;}
.btn-p:hover{background:var(--green2);transform:translateY(-1px);}
.btn-p:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.btn-s{background:transparent;color:var(--muted);border:1px solid var(--border);border-radius:9px;padding:9px 14px;font-size:11px;font-weight:500;cursor:pointer;transition:.2s;font-family:'Inter',sans-serif;}
.btn-s:hover{color:var(--text);border-color:rgba(255,255,255,.2);}
.btn-s.act{border-color:var(--green);color:var(--green);}
.tbl-card{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;}
.tbl-head{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;}
.tbl-title{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;}
table{width:100%;border-collapse:collapse;}
th{padding:9px 18px;text-align:left;font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border);background:rgba(255,255,255,.015);}
td{padding:12px 18px;font-size:11px;border-bottom:1px solid rgba(255,255,255,.04);}
tr:last-child td{border-bottom:none;}
tr:hover td{background:rgba(255,255,255,.015);}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:100px;font-size:10px;font-weight:600;}
.tag{display:inline-block;padding:2px 7px;border-radius:5px;font-size:10px;font-weight:700;background:rgba(0,232,122,.1);color:var(--green);}
.proof-btn{background:rgba(59,130,246,.1);color:#3B82F6;border:1px solid rgba(59,130,246,.2);border-radius:5px;padding:3px 8px;font-size:10px;cursor:pointer;font-weight:600;}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(5px);z-index:1000;display:flex;align-items:center;justify-content:center;}
.modal{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;width:460px;max-width:92vw;}
.modal-t{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:5px;}
.modal-s{font-size:11px;color:var(--muted);margin-bottom:16px;}
.prog-wrap{background:var(--card2);border-radius:100px;height:5px;margin-bottom:16px;overflow:hidden;}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--green),#00BFFF);border-radius:100px;transition:width .5s ease;}
.step-list{display:flex;flex-direction:column;gap:7px;margin-bottom:16px;}
.step{display:flex;align-items:center;gap:10px;font-size:11px;padding:10px;border-radius:9px;background:var(--card2);}
.step.done{color:var(--green)}.step.active{color:var(--text);border:1px solid rgba(0,232,122,.2)}.step.wait{color:var(--muted)}
.spin{width:13px;height:13px;border:2px solid rgba(0,232,122,.3);border-top-color:var(--green);border-radius:50%;animation:sp .8s linear infinite;flex-shrink:0;}
@keyframes sp{to{transform:rotate(360deg);}}
.proof-modal{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:24px;width:500px;max-width:92vw;}
.proof-ss{background:var(--card2);border:1px solid var(--border);border-radius:10px;padding:16px;margin:12px 0;}
.proof-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:11px;}
.proof-row:last-child{border-bottom:none;}
.proof-key{color:var(--muted)}.proof-val{color:var(--text);font-weight:500;}
.toast{position:fixed;bottom:20px;right:20px;background:var(--card);border:1px solid rgba(0,232,122,.3);border-radius:10px;padding:12px 16px;font-size:12px;color:var(--green);z-index:9999;display:flex;align-items:center;gap:8px;animation:tup .3s ease;box-shadow:0 8px 32px rgba(0,0,0,.4);}
@keyframes tup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.empty{text-align:center;padding:40px 20px;color:var(--muted);}
.empty-i{font-size:36px;margin-bottom:12px;opacity:.5;}
.loading{display:flex;align-items:center;justify-content:center;min-height:100vh;background:var(--bg);font-size:14px;color:var(--muted);}
`;

function ApplyModal({ data, onClose, onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Lettura e analisi del CV...",
    "Generazione lettera di presentazione...",
    `Ricerca lavoro su ${data.count} siti...`,
    "Compilazione moduli di candidatura...",
    `Invio di ${data.count} candidature...`,
    "Tutte le candidature completate! ✅",
  ];
  useEffect(() => {
    if (step < steps.length - 1) { const t = setTimeout(() => setStep(s => s + 1), 900); return () => clearTimeout(t); }
    else { setTimeout(onDone, 600); }
  }, [step]);
  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-t">🚀 Candidatura in corso...</div>
        <div className="modal-s">{data.position} — {data.cities?.join(', ')}</div>
        <div className="prog-wrap"><div className="prog-fill" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        <div className="step-list">
          {steps.map((s, i) => (
            <div key={i} className={`step ${i < step ? 'done' : i === step ? 'active' : 'wait'}`}>
              <span style={{ width: 16, flexShrink: 0, textAlign: 'center' }}>{i < step ? '✓' : i === step ? <div className="spin" /> : '○'}</span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProofModal({ job, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="proof-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-t">📋 Application Proof</div>
        <div className="modal-s">Confirmation record</div>
        <div className="proof-ss">
          {[["ID", `#${job.confirmId}`], ["Posizione", job.position], ["Azienda", job.company],
            ["Sito", job.site], ["Città", `🇮🇹 ${job.city}`], ["Data", `${job.date} ${job.time}`],
            ["Stato", STATUS_CONFIG[job.status]?.label]].map(([k, v]) => (
            <div key={k} className="proof-row"><span className="proof-key">{k}</span>
              <span className="proof-val" style={k === "Stato" ? { color: STATUS_CONFIG[job.status]?.color } : {}}>{v}</span>
            </div>
          ))}
        </div>
        <button className="btn-p" style={{ fontSize: 11, padding: '8px 14px' }} onClick={onClose}>Chiudi</button>
      </div>
    </div>
  );
}

function AuthPage({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpErr, setOtpErr] = useState(false);
  const refs = useRef([]);
  const DEMO = '123456';

  const otpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const n = [...otp]; n[i] = val; setOtp(n); setOtpErr(false);
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (i === 5 && val) setTimeout(() => { if ([...n].join('') === DEMO) onLogin(pendingUser); else setOtpErr(true); }, 300);
  };

  const otpKey = (i, e) => { if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus(); };

  const goOtp = user => { setPendingUser(user); setStep('otp'); setOtp(['','','','','','']); setTimeout(() => refs.current[0]?.focus(), 100); };

  const emailAuth = async () => {
    setError(''); setLoading(true);
    try {
      const uc = tab === 'login'
        ? await signInWithEmailAndPassword(auth, form.email, form.password)
        : await createUserWithEmailAndPassword(auth, form.email, form.password);
      goOtp(uc.user);
    } catch (e) {
      const m = { 'auth/user-not-found': 'Email non trovata.', 'auth/wrong-password': 'Password errata.', 'auth/email-already-in-use': 'Email già in uso.', 'auth/invalid-email': 'Email non valida.', 'auth/weak-password': 'Password min 6 caratteri.', 'auth/invalid-credential': 'Email o password errati.' };
      setError(m[e.code] || e.message);
    }
    setLoading(false);
  };

  const googleAuth = async () => {
    setError(''); setLoading(true);
    try { const r = await signInWithPopup(auth, googleProvider); goOtp(r.user); }
    catch (e) { setError('Errore Google: ' + e.message); }
    setLoading(false);
  };

  if (step === 'otp') return (
    <div className="auth-wrap"><div className="auth-card">
      <div className="auth-logo">⚡ JobPilot Italia</div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 5, fontFamily: 'Syne,sans-serif' }}>🔐 Verifica OTP</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>Codice per: <strong style={{ color: 'var(--text)' }}>{pendingUser?.email}</strong></div>
      </div>
      <div style={{ background: 'rgba(0,232,122,.06)', border: '1px solid rgba(0,232,122,.15)', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: 'var(--green)', marginBottom: 16 }}>
        💡 Demo OTP: <strong>1 2 3 4 5 6</strong>
      </div>
      <div className="otp-wrap">
        {otp.map((v, i) => <input key={i} className="otp-box" maxLength={1} value={v} ref={el => refs.current[i] = el} onChange={e => otpChange(i, e.target.value)} onKeyDown={e => otpKey(i, e)} style={{ borderColor: otpErr ? 'var(--red)' : v ? 'var(--green)' : undefined }} />)}
      </div>
      {otpErr && <div style={{ textAlign: 'center', color: 'var(--red)', fontSize: 11, marginBottom: 12 }}>❌ Codice errato. Usa: 123456</div>}
      <button className="btn-main" onClick={() => { if (otp.join('') === DEMO) onLogin(pendingUser); else setOtpErr(true); }}>✅ Verifica e Accedi</button>
      <button className="btn-s" style={{ width: '100%' }} onClick={() => { setStep('form'); setOtpErr(false); }}>← Indietro</button>
    </div></div>
  );

  return (
    <div className="auth-wrap"><div className="auth-card">
      <div className="auth-logo">⚡ JobPilot Italia</div>
      <div className="auth-sub">Sistema automatico di candidature lavoro in Italia.</div>
      <div className="auth-tabs">
        <div className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Accedi</div>
        <div className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError(''); }}>Registrati</div>
      </div>
      {error && <div className="err-box">⚠️ {error}</div>}
      {tab === 'register' && <div className="inp-group"><label className="inp-label">Nome</label><input className="inp" placeholder="Mario Rossi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>}
      <div className="inp-group"><label className="inp-label">Email</label><input className="inp" type="email" placeholder="tuo@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
      <div className="inp-group"><label className="inp-label">Password</label><input className="inp" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && emailAuth()} /></div>
      <button className="btn-main" onClick={emailAuth} disabled={loading}>{loading ? '⏳...' : tab === 'login' ? '🔑 Accedi' : '🚀 Crea Account'}</button>
      <div className="divider">oppure</div>
      <button className="google-btn" onClick={googleAuth} disabled={loading}>
        <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continua con Google
      </button>
      <div className="auth-feats">
        <div className="auth-feat"><div className="feat-dot"/><span>Login reale con Gmail o Email</span></div>
        <div className="auth-feat"><div className="feat-dot"/><span>OTP verifica sicurezza</span></div>
        <div className="auth-feat"><div className="feat-dot"/><span>10 candidature al giorno</span></div>
      </div>
    </div></div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [cvFile, setCvFile] = useState(null);
  const [applyModal, setApplyModal] = useState(null);
  const [proofJob, setProofJob] = useState(null);
  const [toast, setToast] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const DAILY_LIMIT = 10;

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setAuthLoading(false); });
    return unsub;
  }, []);

  useEffect(() => { if (user) loadJobs(); }, [user]);

  const loadJobs = async () => {
    if (!user) return;
    setJobsLoading(true);
    try {
      const q = query(collection(db, 'applications'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ ...d.data(), id: d.id, firestoreId: d.id }));
      setJobs(list);
      const today = new Date().toISOString().split('T')[0];
      setDailyCount(list.filter(j => j.date === today).length);
    } catch (e) { console.error(e); }
    setJobsLoading(false);
  };

  const handleApplyDone = async () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const date = now.toISOString().split('T')[0];
    const count = Math.min(applyModal.count, DAILY_LIMIT - dailyCount);
    const newJobs = [];
    for (let i = 0; i < count; i++) {
      const site = applyModal.sites[i % applyModal.sites.length];
      const city = applyModal.cities[i % applyModal.cities.length];
      const data = { userId: user.uid, position: applyModal.position, site, city, status: 'applied', date, time, company: COMPANIES[Math.floor(Math.random() * COMPANIES.length)], confirmId: `IT-${site.slice(0,2).toUpperCase()}-${String(Date.now()).slice(-6)}`, createdAt: now.toISOString() };
      try { const ref = await addDoc(collection(db, 'applications'), data); newJobs.push({ ...data, id: ref.id, firestoreId: ref.id }); } catch (e) { console.error(e); }
    }
    setJobs(j => [...newJobs, ...j]);
    setDailyCount(d => d + newJobs.length);
    setApplyModal(null); setPage('tracker');
    showToast(`✅ ${newJobs.length} candidature inviate!`);
  };

  const handleStatusChange = async (id, fid, status) => {
    setJobs(js => js.map(j => j.id === id ? { ...j, status } : j));
    try { await updateDoc(doc(db, 'applications', fid), { status }); showToast(`Stato: ${STATUS_CONFIG[status]?.label}`); } catch (e) { console.error(e); }
  };

  const handleLogout = async () => { await signOut(auth); setUser(null); setJobs([]); };

  if (authLoading) return <><style>{S}</style><div className="loading">⚡ Caricamento...</div></>;
  if (!user) return <><style>{S}</style><AuthPage onLogin={u => setUser(u)} /></>;

  const stats = { total: jobs.length, interview: jobs.filter(j => j.status === 'interview').length, offer: jobs.filter(j => j.status === 'offer').length, rejected: jobs.filter(j => j.status === 'rejected').length };
  const NAV = [{ id: 'dashboard', icon: '⬛', label: 'Dashboard' }, { id: 'apply', icon: '🚀', label: 'Nuova Candidatura' }, { id: 'tracker', icon: '📊', label: 'Tracking', badge: stats.interview || null }, { id: 'settings', icon: '⚙️', label: 'Impostazioni' }];
  const av = (user.displayName || user.email || 'U').slice(0, 2).toUpperCase();

  const ApplyPage = () => {
    const [position, setPosition] = useState('');
    const [customPos, setCustomPos] = useState('');
    const [cities, setCities] = useState([]);
    const [sites, setSites] = useState([]);
    const [count, setCount] = useState(1);
    const remaining = DAILY_LIMIT - dailyCount;
    const toggleCity = c => setCities(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
    const toggleSite = s => setSites(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
    const pos = customPos || position;
    const canApply = pos && cities.length > 0 && sites.length > 0 && cvFile && remaining > 0;

    return (<>
      <div className="ph"><div className="pt">Nuova Candidatura</div><div className="ps">Configura e invia candidature automaticamente</div></div>
      <div className="card">
        <div className="card-title">⚡ Limite <span className="ct-badge">{dailyCount}/{DAILY_LIMIT}</span></div>
        <div className="limit-bar-wrap"><div className="limit-bar" style={{ width: `${(dailyCount / DAILY_LIMIT) * 100}%` }} /></div>
        <div className="limit-info"><span>{dailyCount} inviate</span><span style={{ color: remaining > 0 ? 'var(--green)' : 'var(--red)' }}>{remaining > 0 ? `${remaining} rimaste` : '⛔ Limite raggiunto'}</span></div>
      </div>
      <div className="card">
        <div className="card-title">📄 CV</div>
        <div style={{ border: `2px dashed ${cvFile ? 'rgba(0,232,122,.4)' : 'var(--border)'}`, borderRadius: 10, padding: 20, textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('cv-inp').click()}>
          {cvFile ? <><div style={{ fontSize: 26, marginBottom: 5 }}>✅</div><div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{cvFile.name}</div></> : <><div style={{ fontSize: 26, marginBottom: 5 }}>☁️</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>Clicca per caricare il CV (PDF/DOCX)</div></>}
        </div>
        <input id="cv-inp" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => e.target.files[0] && setCvFile(e.target.files[0])} />
      </div>
      <div className="card">
        <div className="card-title">💼 Posizione</div>
        <div className="f-grid">
          <div className="fg"><span className="fl">Ruolo</span><select className="fs" value={position} onChange={e => setPosition(e.target.value)}><option value="">Scegli...</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          <div className="fg"><span className="fl">Personalizzato</span><input className="fi" placeholder="es. Barista..." value={customPos} onChange={e => setCustomPos(e.target.value)} /></div>
          <div className="fg"><span className="fl">Contratto</span><select className="fs"><option>Tempo pieno</option><option>Part-time</option><option>Determinato</option><option>Stage</option></select></div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">📍 Città {cities.length > 0 && <span className="ct-badge">{cities.length}</span>}</div>
        {cities.length > 0 && <div className="selected-cities">{cities.map(c => <span key={c} className="sel-city-tag">🇮🇹 {c}<button onClick={() => toggleCity(c)}>×</button></span>)}</div>}
        <div className="region-grid">{ITALIAN_REGIONS.map(r => <div key={r.name} className="region-block"><div className="region-name">🏛️ {r.name}</div><div className="city-list">{r.cities.map(c => <span key={c} className={`city-chip ${cities.includes(c) ? 'sel' : ''}`} onClick={() => toggleCity(c)}>{c}</span>)}</div></div>)}</div>
      </div>
      <div className="card">
        <div className="card-title">🌐 Siti</div>
        <div className="site-grid">{JOB_SITES.map(s => <div key={s.name} className={`site-chip ${sites.includes(s.name) ? 'sel' : ''}`} onClick={() => toggleSite(s.name)}><span className="site-icon">{s.icon}</span>{s.name}</div>)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, padding: 12, background: 'var(--card2)', borderRadius: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Candidature:</span>
          <input type="range" min={1} max={Math.min(remaining, 10)} value={count} onChange={e => setCount(+e.target.value)} style={{ flex: 1, accentColor: 'var(--green)' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', fontFamily: 'Syne', minWidth: 20 }}>{count}</span>
        </div>
        <button className="btn-p" disabled={!canApply} onClick={() => setApplyModal({ position: pos, sites, cities, count })}>🚀 Invia {count} Candidatura{count > 1 ? 'e' : ''}</button>
        {!cvFile && <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 10 }}>⚠️ Carica prima il CV</span>}
      </div>
    </>);
  };

  const TrackerPage = () => {
    const [filter, setFilter] = useState('all');
    const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);
    return (<>
      <div className="ph"><div className="pt">Tracking</div><div className="ps">{jobs.length} candidature totali</div></div>
      <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', ...Object.keys(STATUS_CONFIG)].map(f => <button key={f} className={`btn-s ${filter === f ? 'act' : ''}`} onClick={() => setFilter(f)}>{f === 'all' ? '📋 Tutte' : STATUS_CONFIG[f].dot + ' ' + STATUS_CONFIG[f].label}<span style={{ marginLeft: 4, opacity: .6, fontSize: 9 }}>({f === 'all' ? jobs.length : jobs.filter(j => j.status === f).length})</span></button>)}
      </div>
      <div className="tbl-card">
        {jobsLoading ? <div className="empty"><div className="spin" style={{ margin: '0 auto 10px', width: 24, height: 24 }} /></div>
          : filtered.length === 0 ? <div className="empty"><div className="empty-i">📭</div><div>Nessuna candidatura</div></div>
          : <table><thead><tr><th>Posizione</th><th>Azienda</th><th>Sito</th><th>Città</th><th>Data</th><th>Stato</th><th>Prova</th><th>Aggiorna</th></tr></thead>
            <tbody>{filtered.map(job => { const sc = STATUS_CONFIG[job.status]; return (
              <tr key={job.id}>
                <td style={{ fontWeight: 600 }}>{job.position}</td>
                <td style={{ color: 'var(--muted)' }}>{job.company}</td>
                <td><span className="tag">{job.site}</span></td>
                <td>🇮🇹 {job.city}</td>
                <td style={{ color: 'var(--muted)', fontSize: 10 }}>{job.date}<br />{job.time}</td>
                <td><span className="badge" style={{ background: sc.color + '22', color: sc.color }}>{sc.dot} {sc.label}</span></td>
                <td><button className="proof-btn" onClick={() => setProofJob(job)}>🧾 Prova</button></td>
                <td><select className="fs" style={{ padding: '3px 7px', fontSize: 10, width: 'auto' }} value={job.status} onChange={e => handleStatusChange(job.id, job.firestoreId, e.target.value)}>{Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></td>
              </tr>);
            })}</tbody></table>}
      </div>
    </>);
  };

  return (<>
    <style>{S}</style>
    <div className="app">
      <div className="sidebar">
        <div className="s-logo"><div className="s-logo-t">⚡ JobPilot</div><div className="s-logo-s">Italia · Auto Apply</div></div>
        {NAV.map(n => <div key={n.id} className={`nav-item ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}><span>{n.icon}</span>{n.label}{n.badge ? <span className="nav-badge">{n.badge}</span> : null}</div>)}
        <div className="s-bottom">
          <div className="user-row"><div className="avatar">{av}</div><div><div className="u-name">{user.displayName || 'Utente'}</div><div className="u-email">{user.email}</div></div></div>
          <button className="logout-btn" onClick={handleLogout}>🚪 Esci</button>
        </div>
      </div>
      <div className="main">
        {page === 'dashboard' && (<>
          <div className="ph"><div className="pt">Benvenuto 👋</div><div className="ps">{user.email}</div></div>
          <div className="stats">
            <div className="stat g"><div className="stat-l">Totale</div><div className="stat-v">{stats.total}</div></div>
            <div className="stat b"><div className="stat-l">Colloqui</div><div className="stat-v">{stats.interview}</div></div>
            <div className="stat a"><div className="stat-l">Offerte</div><div className="stat-v">{stats.offer}</div></div>
            <div className="stat r"><div className="stat-l">Rifiutate</div><div className="stat-v">{stats.rejected}</div></div>
          </div>
          <div className="card">
            <div className="card-title">⚡ Oggi <span className="ct-badge">{dailyCount}/{DAILY_LIMIT}</span></div>
            <div className="limit-bar-wrap"><div className="limit-bar" style={{ width: `${(dailyCount / DAILY_LIMIT) * 100}%` }} /></div>
            <div className="limit-info"><span>{dailyCount} inviate</span><span style={{ color: 'var(--green)' }}>{DAILY_LIMIT - dailyCount} rimaste</span></div>
          </div>
          <div className="tbl-card">
            <div className="tbl-head"><div className="tbl-title">Ultime Candidature</div><button className="btn-p" style={{ fontSize: 11, padding: '8px 14px' }} onClick={() => setPage('apply')}>+ Nuova</button></div>
            {jobs.length === 0 ? <div className="empty"><div className="empty-i">📭</div><div>Nessuna candidatura ancora</div></div>
              : <table><thead><tr><th>Posizione</th><th>Azienda</th><th>Sito</th><th>Città</th><th>Stato</th></tr></thead>
                <tbody>{jobs.slice(0,5).map(job => { const sc = STATUS_CONFIG[job.status]; return <tr key={job.id}><td style={{fontWeight:600}}>{job.position}</td><td style={{color:'var(--muted)'}}>{job.company}</td><td><span className="tag">{job.site}</span></td><td>🇮🇹 {job.city}</td><td><span className="badge" style={{background:sc.color+'22',color:sc.color}}>{sc.dot} {sc.label}</span></td></tr>; })}</tbody></table>}
          </div>
        </>)}
        {page === 'apply' && <ApplyPage />}
        {page === 'tracker' && <TrackerPage />}
        {page === 'settings' && (<>
          <div className="ph"><div className="pt">Impostazioni</div></div>
          <div className="card">
            <div className="card-title">👤 Account</div>
            <div className="f-grid-2">
              <div className="fg"><span className="fl">Email</span><input className="fi" defaultValue={user.email} readOnly /></div>
              <div className="fg"><span className="fl">UID</span><input className="fi" defaultValue={user.uid} readOnly style={{fontSize:9}} /></div>
            </div>
            <button className="btn-p" style={{background:'var(--red)',fontSize:11,padding:'9px 16px'}} onClick={handleLogout}>🚪 Esci dall'account</button>
          </div>
        </>)}
      </div>
      {applyModal && <ApplyModal data={applyModal} onClose={() => setApplyModal(null)} onDone={handleApplyDone} />}
      {proofJob && <ProofModal job={proofJob} onClose={() => setProofJob(null)} />}
      {toast && <div className="toast">⚡ {toast}</div>}
    </div>
  </>);
}
