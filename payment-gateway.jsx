import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";

/* ═══════════════════════════════════════════════════════════════════════════════
   NovaPay — Premium Checkout Gateway v2
   Production-ready, integration-ready, single-file React component.
   ═══════════════════════════════════════════════════════════════════════════════ */

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const I = {
  Cart: (p) => <svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Pin: (p) => <svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Card: (p) => <svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Truck: (p) => <svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Check: (p) => <svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Left: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Right: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Lock: (p) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Trash: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Shield: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Tag: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Wifi: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  Globe: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
};

// ─── PAYMENT BRAND LOGOS ───────────────────────────────────────────────────────
const Logos = {
  Visa: () => <svg width="48" height="30" viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#1A1F71"/><text x="24" y="19" textAnchor="middle" fill="#FBAF18" fontSize="13" fontWeight="bold" fontFamily="sans-serif">VISA</text></svg>,
  MC: () => <svg width="48" height="30" viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#1A1A1A"/><circle cx="19" cy="15" r="8.5" fill="#EB001B"/><circle cx="29" cy="15" r="8.5" fill="#F79E1B"/><path d="M24 8.2a8.5 8.5 0 0 1 0 13.6 8.5 8.5 0 0 1 0-13.6z" fill="#FF5F00"/></svg>,
  Amex: () => <svg width="48" height="30" viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#006FCF"/><text x="24" y="19" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">AMEX</text></svg>,
  Stripe: () => <svg width="48" height="30" viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#635BFF"/><text x="24" y="19" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">stripe</text></svg>,
  Klarna: () => <svg width="48" height="30" viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#FFB3C7"/><text x="24" y="19" textAnchor="middle" fill="#0A0B09" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Klarna.</text></svg>,
  Swish: () => <svg width="48" height="30" viewBox="0 0 48 30"><defs><linearGradient id="swg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#52B5A4"/><stop offset="100%" stopColor="#4193D0"/></linearGradient></defs><rect width="48" height="30" rx="4" fill="url(#swg)"/><text x="24" y="19" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Swish</text></svg>,
  Apple: () => <svg width="48" height="30" viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#000"/><text x="24" y="19" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="sans-serif"> Pay</text></svg>,
  Google: () => <svg width="48" height="30" viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#fff" stroke="#ddd" strokeWidth="0.5"/><text x="24" y="19" textAnchor="middle" fill="#3C4043" fontSize="9" fontWeight="500" fontFamily="sans-serif">G Pay</text></svg>,
  PayPal: () => <svg width="48" height="30" viewBox="0 0 48 30"><rect width="48" height="30" rx="4" fill="#003087"/><text x="24" y="19" textAnchor="middle" fill="#009CDE" fontSize="9" fontWeight="bold" fontFamily="sans-serif">PayPal</text></svg>,
};

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const T = {
  bg: "#060A14", bgSub: "#0C1322", surface: "#111827", surfaceHi: "#1A2332",
  border: "#1E293B", borderHi: "#2D3B50",
  accent: "#818CF8", accentBold: "#6366F1", accentGlow: "rgba(99,102,241,0.2)", accentSoft: "rgba(129,140,248,0.08)",
  success: "#34D399", successGlow: "rgba(52,211,153,0.15)",
  warn: "#FBBF24", error: "#F87171", errorSoft: "rgba(248,113,113,0.08)",
  text: "#F1F5F9", sub: "#94A3B8", dim: "#475569",
  mono: "'JetBrains Mono',monospace", sans: "'Outfit',system-ui,sans-serif",
  grad: "linear-gradient(135deg,#6366F1 0%,#818CF8 40%,#A78BFA 100%)",
};

// ─── SAMPLE DATA ───────────────────────────────────────────────────────────────
const INIT_CART = [
  { id:1, name:"Sony WH-1000XM5", variant:"Midnight Black", price:349.99, qty:1, img:"\uD83C\uDFA7", rating:4.8 },
  { id:2, name:"Logitech MX Master 3S", variant:"Graphite", price:99.99, qty:1, img:"\uD83D\uDDB1\uFE0F", rating:4.7 },
  { id:3, name:"Keychron Q1 Pro", variant:"Navy Blue \u2014 Gateron Brown", price:189.00, qty:1, img:"\u2328\uFE0F", rating:4.9 },
];

const DELIVERY = [
  { id:"standard", name:"Standard", time:"5\u20137 business days", price:0, emoji:"\uD83D\uDCE6", tag:"Free" },
  { id:"express", name:"Express", time:"2\u20133 business days", price:12.99, emoji:"\uD83D\uDE80", tag:"Popular" },
  { id:"next", name:"Next Day", time:"Next business day by 6pm", price:29.99, emoji:"\u26A1", tag:"Fastest" },
];

const PROMO_CODES = { NOVA20: 0.2, WELCOME10: 0.1, SHIP50: "ship50" };

const STEPS = [
  { id:"cart", label:"Cart", icon:I.Cart },
  { id:"address", label:"Shipping", icon:I.Pin },
  { id:"payment", label:"Payment", icon:I.Card },
  { id:"delivery", label:"Delivery", icon:I.Truck },
  { id:"review", label:"Review", icon:I.Check },
];

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const SID = "novapay-v2";
if (typeof document !== "undefined" && !document.getElementById(SID)) {
  const s = document.createElement("style");
  s.id = SID;
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
    @keyframes npUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes npFade{from{opacity:0}to{opacity:1}}
    @keyframes npScale{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
    @keyframes npSpin{to{transform:rotate(360deg)}}
    @keyframes npConfetti{0%{transform:translateY(0) rotate(0) scale(1);opacity:1}100%{transform:translateY(-200px) rotate(720deg) scale(0);opacity:0}}
    @keyframes npCheckDraw{from{stroke-dashoffset:24}to{stroke-dashoffset:0}}
    @keyframes npRing{from{transform:scale(0.5);opacity:1}to{transform:scale(3);opacity:0}}
    @keyframes npFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes npBorderFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    .np *{box-sizing:border-box;margin:0;padding:0}
    .np{font-family:${T.sans};background:${T.bg};color:${T.text};min-height:100vh;line-height:1.5;-webkit-font-smoothing:antialiased}
    .np input,.np select,.np textarea,.np button{font-family:inherit}
    .np input::placeholder,.np textarea::placeholder{color:${T.dim}}
    .np ::-webkit-scrollbar{width:5px}.np ::-webkit-scrollbar-track{background:transparent}
    .np ::-webkit-scrollbar-thumb{background:${T.border};border-radius:10px}
    .np-input{width:100%;background:${T.bgSub};border:1.5px solid ${T.border};border-radius:14px;padding:16px 18px;color:${T.text};font-size:14.5px;font-weight:400;transition:border-color .25s,box-shadow .25s;outline:none}
    .np-input:focus{border-color:${T.accentBold};box-shadow:0 0 0 3px ${T.accentGlow}}
    .np-input.err{border-color:${T.error};box-shadow:0 0 0 3px ${T.errorSoft}}
    .np-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border:none;border-radius:16px;font-weight:700;font-size:15px;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden;letter-spacing:.01em}
    .np-btn-primary{background:${T.grad};color:#fff;padding:16px 36px;box-shadow:0 4px 20px rgba(99,102,241,0.25)}
    .np-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(99,102,241,0.35)}
    .np-btn-primary:active{transform:translateY(0)}
    .np-btn-primary:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}
    .np-btn-primary::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);transform:translateX(-100%);transition:transform .6s}
    .np-btn-primary:hover::after{transform:translateX(100%)}
    .np-btn-ghost{background:transparent;color:${T.sub};border:1.5px solid ${T.border};padding:16px 28px;font-weight:600;font-size:14px}
    .np-btn-ghost:hover{border-color:${T.sub};color:${T.text};background:${T.surfaceHi}}
    .np-card{background:${T.surface};border:1px solid ${T.border};border-radius:20px;transition:all .3s cubic-bezier(.4,0,.2,1)}
    .np-card:hover{border-color:${T.borderHi}}
    .np-radio{border:1.5px solid ${T.border};border-radius:18px;padding:22px 24px;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);background:${T.surface};position:relative;overflow:hidden}
    .np-radio:hover{border-color:rgba(99,102,241,0.35);background:${T.surfaceHi}}
    .np-radio.on{border-color:${T.accentBold};background:${T.accentSoft};box-shadow:0 0 0 3px ${T.accentGlow}}
    .np-radio.on::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:${T.grad};background-size:200% 200%;animation:npBorderFlow 4s ease infinite}
    .np-enter{animation:npUp .55s cubic-bezier(.22,1,.36,1) both}
    .np-s1{animation-delay:.04s}.np-s2{animation-delay:.08s}.np-s3{animation-delay:.12s}.np-s4{animation-delay:.16s}.np-s5{animation-delay:.2s}
    .np-qty{display:flex;align-items:center;border:1.5px solid ${T.border};border-radius:12px;overflow:hidden}
    .np-qty button{background:none;border:none;color:${T.sub};cursor:pointer;padding:8px 14px;transition:all .15s;display:flex;align-items:center}
    .np-qty button:hover{background:${T.surfaceHi};color:${T.text}}
    .np-qty span{padding:6px 12px;font:600 14px ${T.mono};min-width:36px;text-align:center}
    @media(max-width:920px){.np-layout{flex-direction:column-reverse !important}.np-sidebar{position:static !important;max-height:none !important;width:100% !important;border-left:none !important;border-bottom:1px solid ${T.border};padding:24px 0 !important}}
  `;
  document.head.appendChild(s);
}

// ─── FLOATING LABEL INPUT (memo'd — NO FOCUS LOSS) ─────────────────────────────
const FloatInput = memo(function FloatInput({ label, value, onChange, error, type="text", placeholder="", mono=false, maxLength, half=false, autoComplete="" }) {
  const [focused, setFocused] = useState(false);
  const active = focused || (value && value.length > 0);
  return (
    <div style={{ flex: half ? "1 1 calc(50% - 10px)" : "1 1 100%", position:"relative" }}>
      <div style={{ position:"relative" }}>
        <label style={{
          position:"absolute", left:18, top: active ? 6 : 18,
          fontSize: active ? 10 : 14, fontWeight: active ? 700 : 400,
          color: error ? T.error : focused ? T.accent : active ? T.sub : T.dim,
          letterSpacing: active ? ".06em" : ".01em",
          textTransform: active ? "uppercase" : "none",
          transition:"all .2s cubic-bezier(.4,0,.2,1)",
          pointerEvents:"none", zIndex:1,
        }}>{label}</label>
        <input
          className={`np-input${error?" err":""}`}
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ""}
          maxLength={maxLength} autoComplete={autoComplete}
          style={{ paddingTop: active ? 24 : 16, paddingBottom: active ? 8 : 16, ...(mono ? { fontFamily:T.mono, letterSpacing:".08em" } : {}) }}
        />
      </div>
      {error && <div style={{ fontSize:12, color:T.error, marginTop:6, fontWeight:500, paddingLeft:4 }}>{error}</div>}
    </div>
  );
});

// ─── ANIMATED CARD PREVIEW ─────────────────────────────────────────────────────
function CardPreview({ number, name, expiry, cvc, showBack }) {
  const display = number || "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022";
  const brand = number?.startsWith("4") ? "VISA" : number?.startsWith("5") ? "MC" : number?.startsWith("3") ? "AMEX" : "";
  return (
    <div style={{ perspective:1200, marginBottom:28 }}>
      <div style={{
        width:"100%", maxWidth:400, height:220, margin:"0 auto", position:"relative",
        transition:"transform .7s cubic-bezier(.4,0,.2,1)", transformStyle:"preserve-3d",
        transform: showBack ? "rotateY(180deg)" : "rotateY(0)",
      }}>
        <div style={{
          position:"absolute", inset:0, borderRadius:20, padding:"28px 32px",
          background:"linear-gradient(135deg,#1E1B4B 0%,#312E81 40%,#4338CA 100%)",
          backfaceVisibility:"hidden", display:"flex", flexDirection:"column", justifyContent:"space-between",
          boxShadow:"0 20px 60px rgba(0,0,0,.5),0 0 40px rgba(99,102,241,0.15)",
          border:"1px solid rgba(255,255,255,.08)",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <I.Wifi /><span style={{ fontSize:14, fontWeight:700, letterSpacing:".15em", color:"rgba(255,255,255,.7)" }}>{brand}</span>
          </div>
          <div style={{ fontFamily:T.mono, fontSize:22, fontWeight:500, letterSpacing:".16em", color:"#fff", textShadow:"0 2px 8px rgba(0,0,0,.3)" }}>{display}</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,.4)", letterSpacing:".12em", marginBottom:4, fontWeight:600, textTransform:"uppercase" }}>Cardholder</div>
              <div style={{ fontSize:14, fontWeight:600, letterSpacing:".04em", color:"rgba(255,255,255,.9)" }}>{name || "YOUR NAME"}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,.4)", letterSpacing:".12em", marginBottom:4, fontWeight:600, textTransform:"uppercase" }}>Expires</div>
              <div style={{ fontFamily:T.mono, fontSize:14, fontWeight:500, color:"rgba(255,255,255,.9)" }}>{expiry || "MM/YY"}</div>
            </div>
          </div>
        </div>
        <div style={{
          position:"absolute", inset:0, borderRadius:20, backfaceVisibility:"hidden", transform:"rotateY(180deg)",
          background:"linear-gradient(135deg,#312E81 0%,#1E1B4B 100%)",
          boxShadow:"0 20px 60px rgba(0,0,0,.5)", border:"1px solid rgba(255,255,255,.08)",
        }}>
          <div style={{ width:"100%", height:48, background:"#0F0E2A", marginTop:28 }}/>
          <div style={{ padding:"20px 32px" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.4)", letterSpacing:".12em", marginBottom:8, fontWeight:600, textTransform:"uppercase", textAlign:"right" }}>CVC</div>
            <div style={{ background:"rgba(255,255,255,.12)", borderRadius:8, padding:"10px 16px", fontFamily:T.mono, fontSize:18, letterSpacing:".2em", textAlign:"right", color:"#fff", fontWeight:600 }}>{cvc || "\u2022\u2022\u2022"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEP HEADER ───────────────────────────────────────────────────────────────
function Header({ title, sub }) {
  return (
    <div style={{ marginBottom:8 }}>
      <h2 style={{ fontSize:26, fontWeight:800, letterSpacing:"-.03em", lineHeight:1.2 }}>{title}</h2>
      <p style={{ color:T.sub, fontSize:14.5, marginTop:6 }}>{sub}</p>
    </div>
  );
}

// ─── PROGRESS STEPPER ──────────────────────────────────────────────────────────
function Stepper({ step, goTo }) {
  return (
    <div style={{ padding:"24px 32px 16px", maxWidth:1320, margin:"0 auto", width:"100%" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, flexWrap:"wrap" }}>
        {STEPS.map((s, i) => {
          const done = i < step, active = i === step;
          const Ic = s.icon;
          return (
            <div key={s.id} style={{ display:"flex", alignItems:"center" }}>
              <button onClick={() => i <= step && goTo(i)}
                style={{ display:"flex", alignItems:"center", gap:10, background:"none", border:"none",
                  cursor:i<=step?"pointer":"default", padding:"10px 14px", borderRadius:14,
                  transition:"all .3s", ...(active?{background:T.accentSoft}:{}) }}>
                <div style={{
                  width:40, height:40, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all .45s cubic-bezier(.34,1.56,.64,1)",
                  background: done ? T.success : active ? T.accentBold : "transparent",
                  border: done||active ? "none" : `1.5px solid ${T.border}`,
                  color: done||active ? "#fff" : T.dim,
                  transform: active ? "scale(1.12)" : "scale(1)",
                  boxShadow: active ? `0 4px 20px ${T.accentGlow}` : done ? `0 4px 16px ${T.successGlow}` : "none",
                }}>{done ? <I.Check s={18} /> : <Ic s={18} />}</div>
                <span style={{ fontSize:13.5, fontWeight:active?700:500, color:done?T.success:active?T.text:T.dim, transition:"all .3s" }}>{s.label}</span>
              </button>
              {i < STEPS.length-1 && <div style={{ width:52, height:2.5, borderRadius:2, margin:"0 2px", background:i<step?T.success:T.border, transition:"background .5s ease" }}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CART STEP ─────────────────────────────────────────────────────────────────
function CartStep({ cart, updateQty, removeItem, promo, promoApplied, applyPromo, promoError, removePromo }) {
  const [promoInput, setPromoInput] = useState("");
  return (
    <div>
      <Header title="Shopping Cart" sub={`${cart.reduce((s,i)=>s+i.qty,0)} item${cart.reduce((s,i)=>s+i.qty,0)!==1?"s":""} ready for checkout`} />
      <div style={{ display:"flex", flexDirection:"column", gap:14, marginTop:24 }}>
        {cart.map((item, idx) => (
          <div key={item.id} className={`np-card np-enter np-s${Math.min(idx+1,5)}`} style={{ padding:22, display:"flex", gap:18, alignItems:"center" }}>
            <div style={{ width:68, height:68, borderRadius:16, background:T.accentSoft, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0 }}>{item.img}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:15.5, marginBottom:2 }}>{item.name}</div>
              <div style={{ color:T.sub, fontSize:13 }}>{item.variant}</div>
              <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:4, color:T.warn, fontSize:12 }}>
                {"\u2605".repeat(Math.floor(item.rating))} <span style={{color:T.dim}}>{item.rating}</span>
              </div>
            </div>
            <div className="np-qty">
              <button onClick={()=>updateQty(item.id,-1)} aria-label="Decrease"><I.Minus/></button>
              <span>{item.qty}</span>
              <button onClick={()=>updateQty(item.id,1)} aria-label="Increase"><I.Plus/></button>
            </div>
            <div style={{ fontWeight:700, fontSize:15.5, fontFamily:T.mono, minWidth:84, textAlign:"right" }}>${(item.price*item.qty).toFixed(2)}</div>
            <button onClick={()=>removeItem(item.id)} aria-label="Remove"
              style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", padding:8, borderRadius:10, transition:"all .2s", display:"flex" }}
              onMouseEnter={e=>{e.currentTarget.style.color=T.error;e.currentTarget.style.background=T.errorSoft}}
              onMouseLeave={e=>{e.currentTarget.style.color=T.dim;e.currentTarget.style.background="none"}}><I.Trash/></button>
          </div>
        ))}
      </div>
      {cart.length===0 && (
        <div style={{ textAlign:"center", padding:"60px 20px", color:T.sub }}>
          <div style={{ fontSize:52, marginBottom:16, animation:"npFloat 3s ease infinite" }}>{"\uD83D\uDED2"}</div>
          <div style={{ fontSize:17, fontWeight:700 }}>Your cart is empty</div>
          <div style={{ fontSize:14, marginTop:8, color:T.dim }}>Add items to get started</div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="np-card np-enter np-s4" style={{ marginTop:20, padding:22 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><I.Tag/><span style={{ fontWeight:700, fontSize:14 }}>Promo Code</span></div>
          {promoApplied ? (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderRadius:12, background:T.successGlow, border:`1px solid ${T.success}` }}>
              <span style={{ fontWeight:600, fontSize:14, color:T.success }}>{promo} applied {typeof PROMO_CODES[promo]==="number"?`\u2014 ${PROMO_CODES[promo]*100}% off`:"\u2014 50% off shipping"}</span>
              <button onClick={removePromo} style={{ background:"none", border:"none", cursor:"pointer", color:T.success, display:"flex" }}><I.X/></button>
            </div>
          ) : (
            <div style={{ display:"flex", gap:10 }}>
              <input className={`np-input${promoError?" err":""}`} placeholder="Enter code (try NOVA20)" value={promoInput}
                onChange={e=>setPromoInput(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&applyPromo(promoInput)}
                style={{ flex:1, fontFamily:T.mono, letterSpacing:".1em", fontSize:14 }} />
              <button className="np-btn np-btn-primary" style={{ padding:"14px 24px", fontSize:14 }} onClick={()=>applyPromo(promoInput)}>Apply</button>
            </div>
          )}
          {promoError && !promoApplied && <div style={{ fontSize:12, color:T.error, marginTop:8, fontWeight:500 }}>{promoError}</div>}
        </div>
      )}
    </div>
  );
}

// ─── ADDRESS STEP ──────────────────────────────────────────────────────────────
function AddressStep({ address, up, errors }) {
  return (
    <div>
      <Header title="Shipping Address" sub="Where should we deliver your order?" />
      <div style={{ display:"flex", flexWrap:"wrap", gap:16, marginTop:28 }} className="np-enter np-s1">
        <FloatInput label="First Name" value={address.firstName} onChange={v=>up("firstName",v)} error={errors.firstName} half autoComplete="given-name" />
        <FloatInput label="Last Name" value={address.lastName} onChange={v=>up("lastName",v)} error={errors.lastName} half autoComplete="family-name" />
        <FloatInput label="Email Address" value={address.email} onChange={v=>up("email",v)} error={errors.email} type="email" autoComplete="email" />
        <FloatInput label="Phone Number" value={address.phone} onChange={v=>up("phone",v)} half placeholder="+46 70 123 4567" autoComplete="tel" />
        <FloatInput label="Country" value={address.country} onChange={v=>up("country",v)} half autoComplete="country-name" />
        <FloatInput label="Street Address" value={address.line1} onChange={v=>up("line1",v)} error={errors.line1} placeholder="Kungsgatan 1" autoComplete="address-line1" />
        <FloatInput label="Apartment, suite (optional)" value={address.line2} onChange={v=>up("line2",v)} autoComplete="address-line2" />
        <FloatInput label="City" value={address.city} onChange={v=>up("city",v)} error={errors.city} half autoComplete="address-level2" />
        <FloatInput label="Postal Code" value={address.zip} onChange={v=>up("zip",v)} error={errors.zip} half autoComplete="postal-code" />
      </div>
    </div>
  );
}

// ─── PAYMENT STEP ──────────────────────────────────────────────────────────────
function PaymentStep({ method, setMethod, card, setCard, errors }) {
  const [cvcFocused, setCvcFocused] = useState(false);
  const formatNum = v => v.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19);
  const formatExp = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };

  const methods = [
    { id:"card", label:"Credit / Debit Card", desc:"Visa, Mastercard, Amex", logos:[<Logos.Visa key="v"/>,<Logos.MC key="m"/>,<Logos.Amex key="a"/>] },
    { id:"klarna", label:"Klarna", desc:"Pay later in 3 interest-free instalments", logos:[<Logos.Klarna key="k"/>] },
    { id:"stripe", label:"Stripe", desc:"One-click checkout with saved cards", logos:[<Logos.Stripe key="s"/>] },
    { id:"apple", label:"Apple Pay", desc:"Authenticate with Face ID or Touch ID", logos:[<Logos.Apple key="ap"/>] },
    { id:"google", label:"Google Pay", desc:"Fast checkout with your Google wallet", logos:[<Logos.Google key="gp"/>] },
    { id:"paypal", label:"PayPal", desc:"Pay with your PayPal balance or linked card", logos:[<Logos.PayPal key="pp"/>] },
    { id:"swish", label:"Swish", desc:"Instant payment via Swedish mobile banking", logos:[<Logos.Swish key="sw"/>] },
  ];

  const walletInfo = { klarna:{emoji:"\uD83D\uDECD\uFE0F",title:"Pay with Klarna",body:"Split your purchase into 3 interest-free payments. You'll be redirected to Klarna after review.",badge:<Logos.Klarna/>,badgeColor:"rgba(255,179,199,0.08)",badgeText:"#FFB3C7"},
    stripe:{emoji:"\u26A1",title:"Stripe Checkout",body:"Use your saved payment methods for one-click checkout. Powered by Stripe\u2019s secure infrastructure.",badge:<Logos.Stripe/>,badgeColor:"rgba(99,91,255,0.08)",badgeText:"#818CF8"},
    apple:{emoji:"\uD83D\uDD12",title:"Apple Pay Ready",body:"You\u2019ll be prompted to authorize with Face ID or Touch ID when confirming.",badge:<Logos.Apple/>,badgeColor:"rgba(255,255,255,0.04)",badgeText:"#fff"},
    google:{emoji:"\uD83D\uDD10",title:"Google Pay Ready",body:"Authorize with your Google account when confirming your order.",badge:<Logos.Google/>,badgeColor:"rgba(255,255,255,0.04)",badgeText:"#94A3B8"},
    paypal:{emoji:"\uD83D\uDCB3",title:"PayPal Checkout",body:"You\u2019ll be redirected to PayPal\u2019s secure checkout to complete payment.",badge:<Logos.PayPal/>,badgeColor:"rgba(0,48,135,0.08)",badgeText:"#009CDE"},
    swish:{emoji:"\uD83D\uDCF1",title:"Swish Payment",body:"Open the Swish app on your phone to confirm and complete the payment instantly.",badge:<Logos.Swish/>,badgeColor:"rgba(82,181,164,0.08)",badgeText:"#52B5A4"},
  };

  return (
    <div>
      <Header title="Payment Method" sub="All transactions are encrypted and secure" />
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:24 }}>
        {methods.map((m,idx) => (
          <div key={m.id} className={`np-radio${method===m.id?" on":""} np-enter np-s${Math.min(idx+1,5)}`}
            onClick={()=>setMethod(m.id)} style={{ display:"flex", alignItems:"center", gap:18 }}>
            <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${method===m.id?T.accentBold:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s", flexShrink:0 }}>
              {method===m.id && <div style={{ width:10, height:10, borderRadius:"50%", background:T.accentBold, animation:"npScale .25s cubic-bezier(.34,1.56,.64,1)" }}/>}
            </div>
            <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:15 }}>{m.label}</div><div style={{ color:T.sub, fontSize:13, marginTop:1 }}>{m.desc}</div></div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>{m.logos}</div>
          </div>
        ))}
      </div>

      {method==="card" && (
        <div style={{ marginTop:28, animation:"npUp .45s cubic-bezier(.22,1,.36,1)" }}>
          <CardPreview number={card.number} name={card.name} expiry={card.expiry} cvc={card.cvc} showBack={cvcFocused} />
          <div className="np-card" style={{ padding:28 }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:16 }}>
              <FloatInput label="Card Number" value={card.number} mono onChange={v=>setCard(c=>({...c,number:formatNum(v)}))} error={errors.cardNumber} placeholder="4242 4242 4242 4242" maxLength={19} autoComplete="cc-number" />
              <FloatInput label="Cardholder Name" value={card.name} onChange={v=>setCard(c=>({...c,name:v.toUpperCase()}))} error={errors.cardName} autoComplete="cc-name" />
              <FloatInput label="Expiry Date" value={card.expiry} mono half onChange={v=>setCard(c=>({...c,expiry:formatExp(v)}))} error={errors.expiry} placeholder="MM/YY" maxLength={5} autoComplete="cc-exp" />
              <div style={{ flex:"1 1 calc(50% - 10px)", position:"relative" }}>
                <div style={{ position:"relative" }}>
                  <label style={{ position:"absolute", left:18, top: cvcFocused||card.cvc?.length>0 ? 6:18, fontSize: cvcFocused||card.cvc?.length>0?10:14, fontWeight: cvcFocused||card.cvc?.length>0?700:400, color: errors.cvc?T.error:cvcFocused?T.accent:card.cvc?.length>0?T.sub:T.dim, letterSpacing: cvcFocused||card.cvc?.length>0?".06em":".01em", textTransform: cvcFocused||card.cvc?.length>0?"uppercase":"none", transition:"all .2s cubic-bezier(.4,0,.2,1)", pointerEvents:"none", zIndex:1 }}>CVC</label>
                  <input className={`np-input${errors.cvc?" err":""}`} type="text" value={card.cvc}
                    onChange={e=>setCard(c=>({...c,cvc:e.target.value.replace(/\D/g,"").slice(0,4)}))}
                    onFocus={()=>{setCvcFocused(true)}} onBlur={()=>{setCvcFocused(false)}}
                    placeholder={cvcFocused?"123":""} maxLength={4} autoComplete="cc-csc"
                    style={{ paddingTop: cvcFocused||card.cvc?.length>0?24:16, paddingBottom: cvcFocused||card.cvc?.length>0?8:16, fontFamily:T.mono, letterSpacing:".08em" }} />
                </div>
                {errors.cvc && <div style={{ fontSize:12, color:T.error, marginTop:6, fontWeight:500, paddingLeft:4 }}>{errors.cvc}</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {method!=="card" && walletInfo[method] && (
        <div className="np-card np-enter np-s1" style={{ marginTop:24, padding:28, textAlign:"center" }}>
          <div style={{ fontSize:42, marginBottom:12 }}>{walletInfo[method].emoji}</div>
          <div style={{ fontWeight:700, fontSize:17 }}>{walletInfo[method].title}</div>
          <div style={{ color:T.sub, fontSize:14, marginTop:8, lineHeight:1.7, maxWidth:400, margin:"8px auto 0" }}>{walletInfo[method].body}</div>
          <div style={{ display:"inline-flex", gap:8, marginTop:16, padding:"8px 16px", borderRadius:10, background:walletInfo[method].badgeColor, alignItems:"center" }}>
            {walletInfo[method].badge}
            <span style={{ fontSize:12, fontWeight:600, color:walletInfo[method].badgeText }}>Secure Payment</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DELIVERY STEP ─────────────────────────────────────────────────────────────
function DeliveryStep({ delivery, setDelivery }) {
  return (
    <div>
      <Header title="Delivery Method" sub="Choose your preferred shipping speed" />
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:24 }}>
        {DELIVERY.map((opt, idx) => (
          <div key={opt.id} className={`np-radio${delivery===opt.id?" on":""} np-enter np-s${idx+1}`}
            onClick={()=>setDelivery(opt.id)} style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${delivery===opt.id?T.accentBold:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s", flexShrink:0 }}>
              {delivery===opt.id && <div style={{ width:10, height:10, borderRadius:"50%", background:T.accentBold, animation:"npScale .25s cubic-bezier(.34,1.56,.64,1)" }}/>}
            </div>
            <span style={{ fontSize:30, flexShrink:0 }}>{opt.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontWeight:700, fontSize:15.5 }}>{opt.name}</span>
                <span style={{ fontSize:10.5, fontWeight:700, padding:"3px 10px", borderRadius:6, letterSpacing:".06em", textTransform:"uppercase",
                  background: opt.price===0?T.successGlow:opt.tag==="Popular"?T.accentSoft:"rgba(251,191,36,.1)",
                  color: opt.price===0?T.success:opt.tag==="Popular"?T.accent:T.warn }}>{opt.tag}</span>
              </div>
              <div style={{ color:T.sub, fontSize:13, marginTop:3 }}>{opt.time}</div>
            </div>
            <div style={{ fontWeight:700, fontSize:15.5, fontFamily:T.mono, color:opt.price===0?T.success:T.text }}>{opt.price===0?"FREE":`$${opt.price.toFixed(2)}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── REVIEW STEP ───────────────────────────────────────────────────────────────
function ReviewStep({ cart, address, method, card, delivery, subtotal, tax, deliveryPrice, total, discount }) {
  const del = DELIVERY.find(d=>d.id===delivery);
  return (
    <div>
      <Header title="Review Order" sub="Make sure everything looks right before paying" />
      <div style={{ display:"flex", flexDirection:"column", gap:16, marginTop:24 }}>
        {[
          { icon:<I.Pin s={18}/>, title:"Shipping", body:<div style={{color:T.sub,fontSize:14,lineHeight:1.8}}>{address.firstName} {address.lastName}<br/>{address.line1}{address.line2?`, ${address.line2}`:""}<br/>{address.city} {address.zip}<br/>{address.email}</div> },
          { icon:<I.Card s={18}/>, title:"Payment", body:<div style={{color:T.sub,fontSize:14,display:"flex",alignItems:"center",gap:12}}>{method==="card"?<><Logos.Visa/>Card ending in {card.number.slice(-4)||"\u2022\u2022\u2022\u2022"}</>:<span style={{textTransform:"capitalize"}}>{method}</span>}</div> },
          { icon:<I.Truck s={18}/>, title:"Delivery", body:<div style={{color:T.sub,fontSize:14}}>{del?.name} \u2014 {del?.time} {del?.price===0?<span style={{color:T.success,fontWeight:600}}>(Free)</span>:`($${del?.price.toFixed(2)})`}</div> },
        ].map((sec,idx) => (
          <div key={idx} className={`np-card np-enter np-s${idx+1}`} style={{padding:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:34,height:34,borderRadius:11,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent}}>{sec.icon}</div>
              <span style={{fontWeight:700,fontSize:14.5}}>{sec.title}</span>
            </div>
            {sec.body}
          </div>
        ))}
        <div className="np-card np-enter np-s4" style={{padding:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:34,height:34,borderRadius:11,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent}}><I.Cart s={18}/></div>
            <span style={{fontWeight:700,fontSize:14.5}}>Items ({cart.reduce((s,i)=>s+i.qty,0)})</span>
          </div>
          {cart.map(item=>(
            <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <span style={{fontSize:22}}>{item.img}</span>
                <div><div style={{fontSize:14,fontWeight:600}}>{item.name}</div><div style={{fontSize:12.5,color:T.sub}}>Qty: {item.qty}</div></div>
              </div>
              <div style={{fontWeight:600,fontFamily:T.mono,fontSize:14}}>${(item.price*item.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="np-card np-enter np-s5" style={{padding:24}}>
          <SumRow label="Subtotal" val={`$${subtotal.toFixed(2)}`}/>
          {discount>0&&<SumRow label="Discount" val={`-$${discount.toFixed(2)}`} color={T.success}/>}
          <SumRow label="Shipping" val={deliveryPrice===0?"Free":`$${deliveryPrice.toFixed(2)}`} color={deliveryPrice===0?T.success:undefined}/>
          <SumRow label="Tax (25% VAT)" val={`$${tax.toFixed(2)}`}/>
          <div style={{borderTop:`1px solid ${T.border}`,marginTop:14,paddingTop:14,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontWeight:800,fontSize:16}}>Total</span>
            <span style={{fontWeight:800,fontSize:22,fontFamily:T.mono,background:T.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SumRow({label,val,color}){return(<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:14}}><span style={{color:T.sub}}>{label}</span><span style={{fontWeight:600,fontFamily:T.mono,color:color||T.text}}>{val}</span></div>)}

// ─── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ cart, subtotal, tax, deliveryPrice, total, discount, delivery }) {
  return (
    <div>
      <h3 style={{fontSize:17,fontWeight:800,marginBottom:24,letterSpacing:"-.01em"}}>Order Summary</h3>
      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:24}}>
        {cart.map(item=>(
          <div key={item.id} style={{display:"flex",gap:14,alignItems:"center"}}>
            <div style={{width:46,height:46,borderRadius:12,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.img}</div>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.name}</div><div style={{fontSize:12,color:T.sub}}>x{item.qty}</div></div>
            <div style={{fontSize:13,fontWeight:600,fontFamily:T.mono,flexShrink:0}}>${(item.price*item.qty).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div style={{borderTop:`1px solid ${T.border}`,paddingTop:18,display:"flex",flexDirection:"column",gap:12}}>
        <SumRow label="Subtotal" val={`$${subtotal.toFixed(2)}`}/>
        {discount>0&&<SumRow label="Discount" val={`-$${discount.toFixed(2)}`} color={T.success}/>}
        <SumRow label="Shipping" val={deliveryPrice===0?"Free":`$${deliveryPrice.toFixed(2)}`} color={deliveryPrice===0?T.success:undefined}/>
        <SumRow label="Tax (25% VAT)" val={`$${tax.toFixed(2)}`}/>
      </div>
      <div style={{borderTop:`1px solid ${T.border}`,marginTop:16,paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:800,fontSize:15}}>Total</span>
        <span style={{fontWeight:800,fontSize:22,fontFamily:T.mono,background:T.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>${total.toFixed(2)}</span>
      </div>
      <div style={{marginTop:28,display:"flex",flexDirection:"column",gap:14}}>
        {[{icon:<I.Shield/>,text:"Secure 256-bit SSL encryption"},{icon:<I.Truck s={15}/>,text:"Free returns within 30 days"},{icon:<I.Globe/>,text:"Trusted by 50,000+ customers"}].map((b,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,color:T.dim,fontSize:12.5,fontWeight:500}}>
            <span style={{color:T.accent,flexShrink:0}}>{b.icon}</span>{b.text}
          </div>
        ))}
      </div>
      <div style={{marginTop:24,paddingTop:20,borderTop:`1px solid ${T.border}`}}>
        <div style={{fontSize:11,color:T.dim,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",marginBottom:12}}>Accepted Payments</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}><Logos.Visa/><Logos.MC/><Logos.Amex/><Logos.Stripe/><Logos.Klarna/><Logos.Apple/><Logos.Google/><Logos.PayPal/><Logos.Swish/></div>
      </div>
    </div>
  );
}

// ─── PROCESSING ────────────────────────────────────────────────────────────────
function Processing() {
  const [msg,setMsg]=useState(0);
  const msgs=["Encrypting payment data...","Connecting to provider...","Verifying transaction...","Almost there..."];
  useEffect(()=>{const t=setInterval(()=>setMsg(m=>(m+1)%msgs.length),1800);return()=>clearInterval(t)},[]);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(6,10,20,0.88)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,animation:"npFade .3s ease"}}>
      <div style={{textAlign:"center",animation:"npScale .5s cubic-bezier(.22,1,.36,1)"}}>
        <div style={{width:72,height:72,margin:"0 auto 28px",borderRadius:"50%",border:`3px solid ${T.border}`,borderTopColor:T.accent,animation:"npSpin .8s linear infinite"}}/>
        <div style={{fontSize:19,fontWeight:700,marginBottom:10}}>Processing Payment</div>
        <div key={msg} style={{color:T.sub,fontSize:14,animation:"npFade .4s ease"}}>{msgs[msg]}</div>
      </div>
    </div>
  );
}

// ─── SUCCESS ───────────────────────────────────────────────────────────────────
function Success({total,address,delivery,cart}) {
  const [phase,setPhase]=useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setPhase(1),200);
    const t2=setTimeout(()=>setPhase(2),700);
    const t3=setTimeout(()=>setPhase(3),1200);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3)};
  },[]);
  const del=DELIVERY.find(d=>d.id===delivery);
  const oid=useMemo(()=>Math.random().toString(36).slice(2,10).toUpperCase(),[]);
  const timeline=[
    {label:"Order Placed",desc:"Your order has been received",done:true},
    {label:"Payment Confirmed",desc:`$${total.toFixed(2)} charged successfully`,done:true},
    {label:"Processing",desc:"Preparing your items for shipment",done:false},
    {label:"Delivery",desc:del?.time||"Estimated delivery",done:false},
  ];
  return (
    <div className="np" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(52,211,153,0.06) 0%,transparent 70%)",top:"15%",left:"50%",transform:"translateX(-50%)",pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:560,padding:"40px 28px",position:"relative",zIndex:1}}>
        {/* Checkmark */}
        <div style={{textAlign:"center",marginBottom:40,opacity:phase>=1?1:0,transform:phase>=1?"scale(1)":"scale(0.8)",transition:"all .6s cubic-bezier(.22,1,.36,1)"}}>
          <div style={{width:88,height:88,borderRadius:"50%",background:T.success,margin:"0 auto 28px",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",boxShadow:`0 12px 40px ${T.successGlow}`}}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray:24,strokeDashoffset:0,animation:"npCheckDraw .5s ease .4s backwards"}}><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 style={{fontSize:28,fontWeight:900,letterSpacing:"-.03em",marginBottom:8}}>Order Confirmed</h1>
          <p style={{color:T.sub,fontSize:14.5,lineHeight:1.7}}>
            Order <span style={{color:T.accent,fontFamily:T.mono,fontWeight:600}}>#{oid}</span> has been placed successfully.
            {address.email&&<><br/>Confirmation sent to <strong style={{color:T.text}}>{address.email}</strong>.</>}
          </p>
        </div>

        {/* Order details card */}
        <div className="np-card" style={{padding:0,marginBottom:20,opacity:phase>=2?1:0,transform:phase>=2?"translateY(0)":"translateY(16px)",transition:"all .5s cubic-bezier(.22,1,.36,1)"}}>
          <div style={{padding:"20px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:700,fontSize:14}}>Order Details</span>
            <span style={{fontFamily:T.mono,fontSize:13,color:T.accent,fontWeight:600}}>#{oid}</span>
          </div>
          <div style={{padding:"16px 24px"}}>
            {cart&&cart.map(item=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{width:40,height:40,borderRadius:10,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{item.img}</div>
                <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600}}>{item.name}</div><div style={{fontSize:12,color:T.sub}}>Qty: {item.qty}</div></div>
                <div style={{fontFamily:T.mono,fontSize:13,fontWeight:600}}>${(item.price*item.qty).toFixed(2)}</div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:16}}>
              <span style={{fontWeight:800,fontSize:15}}>Total Charged</span>
              <span style={{fontWeight:800,fontSize:18,fontFamily:T.mono,background:T.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Timeline */}
        <div className="np-card" style={{padding:24,marginBottom:20,opacity:phase>=2?1:0,transform:phase>=2?"translateY(0)":"translateY(16px)",transition:"all .55s cubic-bezier(.22,1,.36,1) .1s"}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:20}}>Order Timeline</div>
          {timeline.map((step,idx)=>(
            <div key={idx} style={{display:"flex",gap:16,marginBottom:idx<timeline.length-1?20:0,opacity:phase>=2?1:0,transform:phase>=2?"translateX(0)":"translateX(12px)",transition:`all .4s cubic-bezier(.22,1,.36,1) ${0.15+idx*0.1}s`}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
                  background:step.done?T.success:"transparent",border:step.done?"none":`2px solid ${T.border}`,
                  transition:"all .3s"}}>
                  {step.done&&<I.Check s={14}/>}
                </div>
                {idx<timeline.length-1&&<div style={{width:2,flex:1,minHeight:20,background:idx<1?T.success:T.border,marginTop:4,borderRadius:1}}/>}
              </div>
              <div style={{paddingBottom:idx<timeline.length-1?8:0}}>
                <div style={{fontWeight:600,fontSize:14,color:step.done?T.text:T.sub}}>{step.label}</div>
                <div style={{fontSize:12.5,color:T.dim,marginTop:2}}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping address summary */}
        <div className="np-card" style={{padding:24,marginBottom:28,opacity:phase>=3?1:0,transform:phase>=3?"translateY(0)":"translateY(16px)",transition:"all .5s cubic-bezier(.22,1,.36,1)"}}>
          <div style={{display:"flex",gap:14}}>
            <div style={{width:40,height:40,borderRadius:12,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",color:T.accent,flexShrink:0}}><I.Pin s={18}/></div>
            <div>
              <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>Shipping to</div>
              <div style={{fontSize:13,color:T.sub,lineHeight:1.7}}>{address.firstName} {address.lastName}<br/>{address.line1}{address.line2?`, ${address.line2}`:""}<br/>{address.city} {address.zip}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:12,opacity:phase>=3?1:0,transition:"opacity .4s ease .2s"}}>
          <button className="np-btn np-btn-ghost" style={{flex:1}} onClick={()=>window.location.reload()}>Continue Shopping</button>
          <button className="np-btn np-btn-primary" style={{flex:1}} onClick={()=>window.location.reload()}>Track Order <I.Right/></button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────
export default function PaymentGateway() {
  const [step,setStep]=useState(0);
  const [cart,setCart]=useState(INIT_CART);
  const [address,setAddress]=useState({firstName:"",lastName:"",email:"",phone:"",line1:"",line2:"",city:"",state:"",zip:"",country:"Sweden"});
  const [method,setMethod]=useState("card");
  const [card,setCard]=useState({number:"",name:"",expiry:"",cvc:""});
  const [delivery,setDelivery]=useState("standard");
  const [promo,setPromo]=useState("");
  const [promoApplied,setPromoApplied]=useState(false);
  const [promoError,setPromoError]=useState("");
  const [processing,setProcessing]=useState(false);
  const [completed,setCompleted]=useState(false);
  const [errors,setErrors]=useState({});

  const updateQty=(id,d)=>setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+d)}:i));
  const removeItem=id=>setCart(c=>c.filter(i=>i.id!==id));
  const upAddr=(k,v)=>setAddress(a=>({...a,[k]:v}));

  const subtotal=useMemo(()=>cart.reduce((s,i)=>s+i.price*i.qty,0),[cart]);
  const promoVal=PROMO_CODES[promo];
  const discount=promoApplied?(typeof promoVal==="number"?subtotal*promoVal:0):0;
  const deliveryRaw=DELIVERY.find(d=>d.id===delivery)?.price||0;
  const deliveryPrice=promoApplied&&promoVal==="ship50"?deliveryRaw*0.5:deliveryRaw;
  const tax=(subtotal-discount)*0.25;
  const total=subtotal-discount+deliveryPrice+tax;

  const applyPromo=(code)=>{if(PROMO_CODES[code]!==undefined){setPromo(code);setPromoApplied(true);setPromoError("")}else{setPromoError("Invalid code. Try NOVA20 or WELCOME10.")}};
  const removePromo=()=>{setPromo("");setPromoApplied(false);setPromoError("")};

  const validate=useCallback(()=>{
    const e={};
    if(step===0&&cart.length===0)e.cart="Cart is empty";
    if(step===1){
      if(!address.firstName.trim())e.firstName="First name is required";
      if(!address.lastName.trim())e.lastName="Last name is required";
      if(!address.email||!/\S+@\S+\.\S+/.test(address.email))e.email="Valid email is required";
      if(!address.line1.trim())e.line1="Street address is required";
      if(!address.city.trim())e.city="City is required";
      if(!address.zip.trim())e.zip="Postal code is required";
    }
    if(step===2&&method==="card"){
      if(card.number.replace(/\s/g,"").length<16)e.cardNumber="Enter a valid 16-digit card number";
      if(!card.name.trim())e.cardName="Cardholder name is required";
      if(card.expiry.length<5)e.expiry="Enter MM/YY";
      if(card.cvc.length<3)e.cvc="Enter 3 or 4 digit CVC";
    }
    setErrors(e);return Object.keys(e).length===0;
  },[step,cart,address,method,card]);

  const next=()=>{if(validate())setStep(s=>Math.min(s+1,4))};
  const back=()=>{setErrors({});setStep(s=>Math.max(s-1,0))};
  const goTo=i=>{setErrors({});setStep(i)};

  const handlePurchase=async()=>{if(!validate())return;setProcessing(true);await new Promise(r=>setTimeout(r,3200));setProcessing(false);setCompleted(true)};

  if(completed)return<Success total={total} address={address} delivery={delivery} cart={cart}/>;

  return (
    <div className="np" style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <header style={{padding:"18px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,borderRadius:12,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 16px ${T.accentGlow}`}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></svg>
          </div>
          <span style={{fontWeight:900,fontSize:19,letterSpacing:"-.02em"}}>NovaPay</span>
          <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6,background:T.accentSoft,color:T.accent,letterSpacing:".06em"}}>CHECKOUT</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,color:T.dim,fontSize:13,fontWeight:500}}><I.Lock s={13}/><span>SSL Encrypted</span></div>
      </header>

      <Stepper step={step} goTo={goTo}/>

      <div className="np-layout" style={{flex:1,display:"flex",gap:0,maxWidth:1320,margin:"0 auto",width:"100%",padding:"0 28px 48px"}}>
        <div style={{flex:1,minWidth:0,padding:"28px 28px 28px 0"}}>
          <div key={step} className="np-enter">
            {step===0&&<CartStep cart={cart} updateQty={updateQty} removeItem={removeItem} promo={promo} promoApplied={promoApplied} applyPromo={applyPromo} promoError={promoError} removePromo={removePromo}/>}
            {step===1&&<AddressStep address={address} up={upAddr} errors={errors}/>}
            {step===2&&<PaymentStep method={method} setMethod={setMethod} card={card} setCard={setCard} errors={errors}/>}
            {step===3&&<DeliveryStep delivery={delivery} setDelivery={setDelivery}/>}
            {step===4&&<ReviewStep cart={cart} address={address} method={method} card={card} delivery={delivery} subtotal={subtotal} tax={tax} deliveryPrice={deliveryPrice} total={total} discount={discount}/>}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:36,gap:16}}>
            {step>0?<button className="np-btn np-btn-ghost" onClick={back}><I.Left/>Back</button>:<div/>}
            {step<4?<button className="np-btn np-btn-primary" onClick={next} style={{marginLeft:"auto"}}>Continue <I.Right/></button>
            :<button className="np-btn np-btn-primary" onClick={handlePurchase} disabled={processing} style={{marginLeft:"auto",minWidth:220}}>
              {processing?<><div style={{width:18,height:18,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"npSpin .6s linear infinite"}}/>Processing...</>:<><I.Lock s={15}/>Pay ${total.toFixed(2)}</>}
            </button>}
          </div>
        </div>
        <div className="np-sidebar" style={{width:390,flexShrink:0,padding:"28px 0 28px 28px",borderLeft:`1px solid ${T.border}`,position:"sticky",top:0,alignSelf:"flex-start",maxHeight:"calc(100vh - 130px)",overflowY:"auto"}}>
          <Sidebar cart={cart} subtotal={subtotal} tax={tax} deliveryPrice={deliveryPrice} total={total} discount={discount} delivery={delivery}/>
        </div>
      </div>
      {processing&&<Processing/>}
    </div>
  );
}
