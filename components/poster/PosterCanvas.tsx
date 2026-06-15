'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
}

/* ── thin gold ornament line ── */
function GoldLine() {
  return (
    <div style={{
      height: 1,
      background: 'linear-gradient(90deg, transparent, #B8860B 20%, #DAA520 50%, #B8860B 80%, transparent)',
      margin: '3px 0',
    }} />
  );
}

/* ── decorative scroll divider ── */
function ScrollDivider() {
  return (
    <svg viewBox="0 0 300 14" style={{ display:'block', width:'100%', height:14 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sdg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8B6914" stopOpacity="0"/>
          <stop offset="40%"  stopColor="#DAA520"/>
          <stop offset="60%"  stopColor="#DAA520"/>
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="7" x2="300" y2="7" stroke="url(#sdg)" strokeWidth="0.8"/>
      <circle cx="150" cy="7" r="4" fill="none" stroke="#DAA520" strokeWidth="1"/>
      <circle cx="150" cy="7" r="2" fill="#DAA520"/>
      <circle cx="120" cy="7" r="2" fill="none" stroke="#DAA520" strokeWidth="0.8"/>
      <circle cx="180" cy="7" r="2" fill="none" stroke="#DAA520" strokeWidth="0.8"/>
      <line x1="100" y1="7" x2="115" y2="7" stroke="#DAA520" strokeWidth="0.8"/>
      <line x1="185" y1="7" x2="200" y2="7" stroke="#DAA520" strokeWidth="0.8"/>
    </svg>
  );
}

/* ── section header badge matching the reference design ── */
function SectionBadge({ label, color }: { label: string; color: 'green' | 'maroon' | 'gold' }) {
  const configs = {
    green:  { bg: '#1B4D1B', border: '#DAA520', text: '#F5DEB3' },
    maroon: { bg: '#5C0A14', border: '#DAA520', text: '#F5DEB3' },
    gold:   { bg: '#8B6914', border: '#DAA520', text: '#FFFACD' },
  };
  const c = configs[color];
  return (
    <div style={{
      background: c.bg,
      border: `2px solid ${c.border}`,
      borderRadius: 4,
      padding: '4px 8px',
      textAlign: 'center',
      marginBottom: 6,
      boxShadow: `0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,215,0,0.2)`,
    }}>
      {/* gold top accent line */}
      <div style={{ height:1, background:c.border, marginBottom:3, opacity:0.6 }}/>
      <span style={{
        fontSize: 11,
        fontWeight: 800,
        color: c.text,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily: 'Georgia, serif',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
      }}>
        ✦ {label} ✦
      </span>
      <div style={{ height:1, background:c.border, marginTop:3, opacity:0.6 }}/>
    </div>
  );
}

/* ── single menu item row ── */
function MenuItem({ name, dot }: { name: string; dot: string }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:5, marginBottom:2.5 }}>
      <span style={{
        display:'inline-block', width:6, height:6, borderRadius:'50%',
        background: dot, flexShrink:0, marginTop:3.5,
      }}/>
      <span style={{
        fontSize: 10,
        color: '#1A0A00',
        lineHeight: 1.35,
        fontFamily: 'Georgia, serif',
        fontWeight: 500,
      }}>
        {name}
      </span>
    </div>
  );
}

export default function PosterCanvas({ config }: PosterCanvasProps) {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  const dateStr = new Date().toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  /* poster: 420 wide (rendered), exported at 3× = 1260px */
  return (
    <div
      id="amulya-poster"
      style={{
        position: 'relative',
        width: 420,
        overflow: 'hidden',
        fontFamily: 'Georgia, "Times New Roman", serif',
        background: 'linear-gradient(175deg, #FBF0D3 0%, #F5E6B8 40%, #EDD898 70%, #F5E6B8 100%)',
      }}
    >
      {/* ── paper grain ── */}
      <div style={{
        position:'absolute', inset:0, opacity:0.04, pointerEvents:'none', zIndex:0,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat:'repeat',
      }}/>

      {/* ── outer gold border ── */}
      <div style={{ position:'absolute', inset:5, border:'2px solid #B8860B', zIndex:0, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', inset:9, border:'1px solid rgba(184,134,11,0.4)', zIndex:0, pointerEvents:'none' }}/>

      {/* ══════════ CONTENT ══════════ */}
      <div style={{ position:'relative', zIndex:1, padding:'10px 14px 0' }}>

        {/* ── TOP ROW: badge | title | lady ── */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:0, marginBottom:4 }}>

          {/* Fresh Homemade Authentic badge */}
          <div style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #1B4D1B 60%, #0F2D0F)',
            border: '3px solid #DAA520',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            flexShrink:0,
            padding:4,
            boxShadow:'0 3px 8px rgba(0,0,0,0.4)',
          }}>
            <div style={{ textAlign:'center' }}>
              {['FRESH','HOME','MADE','AUTHEN','TIC'].map((w,i)=>(
                <div key={i} style={{
                  fontSize: 7, fontWeight:800, color:'#F5DEB3',
                  letterSpacing:'0.05em', lineHeight:1.2,
                  textTransform:'uppercase',
                }}>
                  {w}
                </div>
              ))}
            </div>
          </div>

          {/* Centre: logo text + title */}
          <div style={{ flex:1, textAlign:'center', padding:'0 4px' }}>
            {/* Restaurant name */}
            <div style={{ marginBottom:0 }}>
              <div style={{
                fontSize: 30,
                fontWeight: 900,
                color: '#8B1A10',
                fontFamily: 'Georgia, serif',
                lineHeight: 1,
                textShadow: '1px 1px 0px rgba(0,0,0,0.15)',
                letterSpacing: '-0.01em',
              }}>
                Amulya
              </div>
              <div style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: '#2C2C2C',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                marginTop: -2,
              }}>
                INDIAN CUISINE
              </div>
            </div>
            {/* Gold scroll under name */}
            <ScrollDivider />
          </div>

          {/* Lady illustration */}
          <div style={{ width:72, flexShrink:0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/amulya-lady.png"
              alt=""
              crossOrigin="anonymous"
              style={{ width:72, display:'block' }}
            />
          </div>
        </div>

        {/* ── DAY + MEAL TITLE ── */}
        <div style={{
          textAlign:'center',
          background:'linear-gradient(90deg,transparent,rgba(139,26,16,0.08),rgba(139,26,16,0.12),rgba(139,26,16,0.08),transparent)',
          borderTop:'1.5px solid #B8860B',
          borderBottom:'1.5px solid #B8860B',
          padding:'4px 8px 5px',
          margin:'0 -2px 5px',
        }}>
          {/* decorative side elements */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <span style={{ color:'#8B6914', fontSize:12 }}>❧</span>
            <div>
              <div style={{
                fontSize: 24,
                fontWeight: 900,
                color: '#7A1208',
                fontFamily: 'Georgia, serif',
                lineHeight: 1.05,
                letterSpacing: '0.01em',
                textShadow: '1px 1px 2px rgba(0,0,0,0.15)',
                textTransform: 'uppercase',
              }}>
                {day} {mealType}
              </div>
              <div style={{
                fontSize: 16,
                fontWeight: 800,
                color: '#5C0A00',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginTop: -2,
              }}>
                BUFFET
              </div>
            </div>
            <span style={{ color:'#8B6914', fontSize:12 }}>❧</span>
          </div>
          <div style={{ fontSize:8.5, color:'#6B4A0A', letterSpacing:'0.15em', marginTop:1 }}>
            {dateStr}
          </div>
        </div>

        {/* ── 3-COLUMN MENU GRID ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:6, marginBottom:4 }}>

          {/* LEFT: VEG ITEMS */}
          <div>
            <SectionBadge label="Veg Items" color="green" />
            {vegItems.length === 0
              ? <div style={{fontSize:9,color:'#888',textAlign:'center'}}>None selected</div>
              : vegItems.map(item => <MenuItem key={item.id} name={item.name} dot="#2E7D32"/>)
            }
          </div>

          {/* CENTRE: ACCOMPANIMENTS + DESSERTS */}
          <div style={{ width:110 }}>
            <SectionBadge label="Accompaniments / Sides" color="gold" />
            {accompaniments.map(item => (
              <div key={item.id} style={{ display:'flex', alignItems:'flex-start', gap:4, marginBottom:2 }}>
                <span style={{ color:'#8B6914', fontSize:8, lineHeight:1.4, flexShrink:0 }}>●</span>
                <span style={{ fontSize:9, color:'#1A0A00', fontFamily:'Georgia,serif', lineHeight:1.3 }}>
                  {item.name}
                </span>
              </div>
            ))}

            {desserts.length > 0 && (
              <div style={{ marginTop:6 }}>
                <SectionBadge label="Desserts" color="maroon" />
                {desserts.map(item => (
                  <div key={item.id} style={{ display:'flex', alignItems:'flex-start', gap:4, marginBottom:2 }}>
                    <span style={{ color:'#DAA520', fontSize:8, flexShrink:0, lineHeight:1.4 }}>◆</span>
                    <span style={{ fontSize:9, color:'#1A0A00', fontFamily:'Georgia,serif', lineHeight:1.3 }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: NON-VEG ITEMS */}
          <div>
            <SectionBadge label="Non-Veg Items" color="maroon" />
            {nonVegItems.length === 0
              ? <div style={{fontSize:9,color:'#888',textAlign:'center'}}>None selected</div>
              : nonVegItems.map(item => <MenuItem key={item.id} name={item.name} dot="#B71C1C"/>)
            }
          </div>
        </div>

      </div>{/* /content padding */}

      {/* ── FOOD PHOTO STRIP ── */}
      <div style={{ position:'relative', overflow:'hidden', height:90 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/food-strip.png"
          alt=""
          crossOrigin="anonymous"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%', display:'block' }}
        />
        {/* gradient overlay at top for smooth blend */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:20,
          background:'linear-gradient(to bottom, #F5E6B8, transparent)',
        }}/>
      </div>

      {/* ── BOTTOM BANNER: Fresh · Homemade · Authentic ── */}
      <div style={{
        background:'linear-gradient(90deg, #0F2D0F, #1B4D1B, #0F2D0F)',
        borderTop:'2px solid #DAA520',
        padding:'6px 14px',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        gap:0,
      }}>
        {['FRESH','HOMEMADE','AUTHENTIC'].map((word, i) => (
          <React.Fragment key={word}>
            <span style={{
              fontSize:11,
              fontWeight:800,
              color:'#F5DEB3',
              letterSpacing:'0.2em',
              textTransform:'uppercase',
              fontFamily:'Georgia,serif',
              textShadow:'0 1px 3px rgba(0,0,0,0.5)',
            }}>
              {word}
            </span>
            {i < 2 && (
              <span style={{ color:'#DAA520', fontSize:14, margin:'0 10px' }}>●</span>
            )}
          </React.Fragment>
        ))}
      </div>

    </div>
  );
}
