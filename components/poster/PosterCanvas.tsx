'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
}

/* ══════════ SVG: horizontal gold rule with lotus centre ══════════ */
function GoldRule({ id = 'a', flip = false }: { id?: string; flip?: boolean }) {
  const gid = `gr-${id}`;
  return (
    <svg
      viewBox="0 0 420 22"
      style={{ display: 'block', width: '100%', transform: flip ? 'scaleY(-1)' : undefined }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8B5E0A" stopOpacity="0" />
          <stop offset="18%"  stopColor="#C9922A" />
          <stop offset="50%"  stopColor="#F0C060" />
          <stop offset="82%"  stopColor="#C9922A" />
          <stop offset="100%" stopColor="#8B5E0A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="11" x2="420" y2="11" stroke={`url(#${gid})`} strokeWidth="1" />
      {/* lotus bud centre */}
      <ellipse cx="210" cy="11" rx="8" ry="5.5" fill="none" stroke="#C9922A" strokeWidth="1.1" />
      <ellipse cx="210" cy="11" rx="4"  ry="3"   fill="#C9922A" />
      {/* side accent diamonds */}
      {[155, 265].map(cx => (
        <polygon key={cx}
          points={`${cx},11 ${cx-5},7 ${cx},3 ${cx+5},7`}
          fill="none" stroke="#C9922A" strokeWidth="1" />
      ))}
      {/* tick marks */}
      {[125,145,275,295].map(x => (
        <line key={x} x1={x} y1="8" x2={x} y2="14" stroke="#C9922A" strokeWidth="0.8" />
      ))}
    </svg>
  );
}

/* ══════════ Corner bracket ══════════ */
function Corner({ pos }: { pos: 'tl'|'tr'|'bl'|'br' }) {
  const sx = pos.endsWith('r') ? -1 : 1;
  const sy = pos.startsWith('b') ? -1 : 1;
  return (
    <svg
      viewBox="0 0 48 48"
      style={{
        position: 'absolute', width: 48, height: 48,
        top:    pos.startsWith('t') ? 8 : undefined,
        bottom: pos.startsWith('b') ? 8 : undefined,
        left:   pos.endsWith('l')   ? 8 : undefined,
        right:  pos.endsWith('r')   ? 8 : undefined,
        transform: `scale(${sx},${sy})`,
        transformOrigin: pos.endsWith('r') ? 'right top' : 'left top',
        pointerEvents: 'none',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4,4 Q4,28 28,28" fill="none" stroke="#C9922A" strokeWidth="1.3"/>
      <line x1="4" y1="4" x2="28" y2="4" stroke="#C9922A" strokeWidth="1.3"/>
      <line x1="4" y1="4" x2="4"  y2="28" stroke="#C9922A" strokeWidth="1.3"/>
      <circle cx="4" cy="4" r="2.8" fill="#C9922A"/>
      <circle cx="28" cy="4" r="1.4" fill="none" stroke="#C9922A" strokeWidth="0.9"/>
      <circle cx="4" cy="28" r="1.4" fill="none" stroke="#C9922A" strokeWidth="0.9"/>
    </svg>
  );
}

/* ══════════ Section heading ══════════ */
function SectionHead({ label }: { label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '3px 0 4px' }}>
      <span style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: '#8B4A0A',
      }}>
        {label}
      </span>
    </div>
  );
}

/* ══════════ Menu item row ══════════ */
function Dot({ color }: { color: string }) {
  return (
    <span style={{
      display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
      background: color, flexShrink: 0, marginTop: 3.5,
    }} />
  );
}

export default function PosterCanvas({ config }: PosterCanvasProps) {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  const dateStr = new Date().toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  /* Responsive column layout: ≤4 items → 1 col, else 2 col */
  const useOneCol = (items: typeof vegItems) => items.length <= 4;

  const itemStyle: React.CSSProperties = {
    fontSize: 10.5,
    color: '#2D1A06',
    lineHeight: 1.38,
    fontFamily: 'Georgia, serif',
  };

  return (
    <div
      id="amulya-poster"
      style={{
        position: 'relative',
        width: 420,
        minHeight: 746,
        overflow: 'hidden',
        fontFamily: 'Georgia, "Times New Roman", serif',
        /* parchment background */
        background: [
          'radial-gradient(ellipse at 15% 12%, rgba(200,130,30,0.07) 0%, transparent 50%)',
          'radial-gradient(ellipse at 85% 88%, rgba(180,110,20,0.07) 0%, transparent 50%)',
          'linear-gradient(168deg, #FAF0DC 0%, #F2E4C4 35%, #EADAAD 65%, #F2E4C4 100%)',
        ].join(','),
      }}
    >
      {/* ── grain texture ── */}
      <div style={{
        position:'absolute', inset:0, opacity:0.038, pointerEvents:'none',
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat:'repeat',
      }}/>

      {/* ── outer border ── */}
      <div style={{
        position:'absolute', inset:7, pointerEvents:'none',
        border:'1.5px solid rgba(165,115,25,0.58)',
      }}/>
      {/* ── inner border ── */}
      <div style={{
        position:'absolute', inset:12, pointerEvents:'none',
        border:'0.6px solid rgba(165,115,25,0.28)',
      }}/>

      {/* ── corner ornaments ── */}
      <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>

      {/* ══════════════ CONTENT ══════════════ */}
      <div style={{ position:'relative', zIndex:10, padding:'14px 22px 14px' }}>

        {/* ── LOGO ── */}
        <div style={{ textAlign:'center', marginBottom:4 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/amulya-logo.png"
            alt="Amulya Indian Cuisine"
            style={{ width: 228, display:'inline-block' }}
            crossOrigin="anonymous"
          />
        </div>

        {/* ── top rule ── */}
        <div style={{ margin:'0 -4px 3px' }}><GoldRule id="top" /></div>

        {/* ── BUFFET BANNER ── */}
        <div style={{
          textAlign:'center',
          padding:'5px 12px 6px',
          margin:'0 6px 3px',
          background:'linear-gradient(90deg,transparent,rgba(160,95,10,0.10),rgba(210,140,20,0.16),rgba(160,95,10,0.10),transparent)',
          borderTop:'0.8px solid rgba(160,100,20,0.48)',
          borderBottom:'0.8px solid rgba(160,100,20,0.48)',
        }}>
          <div style={{
            fontSize:8.5, letterSpacing:'0.42em', textTransform:'uppercase',
            color:'#7B4A10', fontFamily:'Georgia,serif', marginBottom:1,
          }}>
            Today&apos;s Special
          </div>
          <div style={{
            fontSize:26, fontWeight:800, letterSpacing:'0.05em',
            background:'linear-gradient(135deg,#6B3508 0%,#B8680F 30%,#E8A828 50%,#B8680F 70%,#6B3508 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            fontFamily:'Georgia,serif', lineHeight:1.08,
          }}>
            {mealType.toUpperCase()} BUFFET
          </div>
          <div style={{ fontSize:10, color:'#7B4A10', marginTop:2, fontStyle:'italic', letterSpacing:'0.04em' }}>
            {day}&nbsp;&nbsp;·&nbsp;&nbsp;{dateStr}
          </div>
        </div>

        {/* ── VEG ── */}
        {vegItems.length > 0 && (<>
          <SectionHead label="🌿  Vegetarian" />
          <div style={{
            display:'grid',
            gridTemplateColumns: useOneCol(vegItems) ? '1fr' : '1fr 1fr',
            columnGap:10, rowGap:1.5, marginBottom:4,
          }}>
            {vegItems.map(item => (
              <div key={item.id} style={{ display:'flex', alignItems:'flex-start', gap:5 }}>
                <Dot color="#2E7D32"/>
                <span style={itemStyle}>{item.name}</span>
              </div>
            ))}
          </div>
        </>)}

        {/* ── mid rule ── */}
        {vegItems.length > 0 && nonVegItems.length > 0 && (
          <div style={{ margin:'2px -4px' }}><GoldRule id="mid" /></div>
        )}

        {/* ── NON-VEG ── */}
        {nonVegItems.length > 0 && (<>
          <SectionHead label="🍗  Non-Vegetarian" />
          <div style={{
            display:'grid',
            gridTemplateColumns: useOneCol(nonVegItems) ? '1fr' : '1fr 1fr',
            columnGap:10, rowGap:1.5, marginBottom:4,
          }}>
            {nonVegItems.map(item => (
              <div key={item.id} style={{ display:'flex', alignItems:'flex-start', gap:5 }}>
                <Dot color="#B71C1C"/>
                <span style={itemStyle}>{item.name}</span>
              </div>
            ))}
          </div>
        </>)}

        {/* ── dessert rule ── */}
        {desserts.length > 0 && (
          <div style={{ margin:'2px -4px' }}><GoldRule id="des" /></div>
        )}

        {/* ── DESSERTS ── */}
        {desserts.length > 0 && (<>
          <SectionHead label="🍮  Desserts" />
          <div style={{ textAlign:'center', marginBottom:4 }}>
            <span style={{ fontSize:10.5, color:'#2D1A06', lineHeight:1.6, fontFamily:'Georgia,serif' }}>
              {desserts.map(d => d.name).join('  ·  ')}
            </span>
          </div>
        </>)}

        {/* ── ACCOMPANIMENTS ── */}
        {accompaniments.length > 0 && (<>
          <div style={{ margin:'2px -4px' }}><GoldRule id="acc" /></div>
          <SectionHead label="Served With" />
          <div style={{ textAlign:'center', marginBottom:4 }}>
            <span style={{ fontSize:10, color:'#5C3510', lineHeight:1.6, fontFamily:'Georgia,serif' }}>
              {accompaniments.map(a => a.name).join('  ·  ')}
            </span>
          </div>
        </>)}

        {/* ── bottom rule ── */}
        <div style={{ margin:'3px -4px 4px' }}><GoldRule id="bot" flip /></div>

        {/* ── FOOTER ── */}
        <div style={{ textAlign:'center' }}>
          <div style={{
            fontSize:8.5, letterSpacing:'0.22em', textTransform:'uppercase',
            color:'#8B5A10', marginBottom:3, fontFamily:'Georgia,serif',
          }}>
            Unlimited Servings &nbsp;·&nbsp; All Inclusive
          </div>
          <div style={{
            fontSize:11.5, fontWeight:700, letterSpacing:'0.03em',
            color:'#7B3B0A', fontFamily:'Georgia,serif',
          }}>
            📞 Reserve Your Table Today
          </div>
          <div style={{
            fontSize:9.5, color:'#9B6520', marginTop:2, letterSpacing:'0.12em',
            fontFamily:'Georgia,serif',
          }}>
            www.amulyaindian.com.au
          </div>
        </div>

      </div>{/* /content */}
    </div>
  );
}
