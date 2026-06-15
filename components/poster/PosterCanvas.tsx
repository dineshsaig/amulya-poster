'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
}

function GoldDivider() {
  return (
    <svg viewBox="0 0 420 16" style={{ display:'block', width:'100%', height:16 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gd1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8B6914" stopOpacity="0"/>
          <stop offset="20%"  stopColor="#C9A84C"/>
          <stop offset="50%"  stopColor="#F0C040"/>
          <stop offset="80%"  stopColor="#C9A84C"/>
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="8" x2="420" y2="8" stroke="url(#gd1)" strokeWidth="1.2"/>
      <ellipse cx="210" cy="8" rx="8" ry="5" fill="none" stroke="#C9A84C" strokeWidth="1.2"/>
      <ellipse cx="210" cy="8" rx="3.5" ry="2.5" fill="#C9A84C"/>
      <path d="M185,8 Q192,4 198,8 Q192,12 185,8Z" fill="none" stroke="#C9A84C" strokeWidth="0.9"/>
      <path d="M235,8 Q228,4 222,8 Q228,12 235,8Z" fill="none" stroke="#C9A84C" strokeWidth="0.9"/>
      <line x1="160" y1="6" x2="160" y2="10" stroke="#C9A84C" strokeWidth="1"/>
      <line x1="260" y1="6" x2="260" y2="10" stroke="#C9A84C" strokeWidth="1"/>
    </svg>
  );
}

function CornerImg({ pos }: { pos: 'tl'|'tr'|'bl'|'br' }) {
  const isRight  = pos.endsWith('r');
  const isBottom = pos.startsWith('b');
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/corner-${pos}.png`}
      alt=""
      crossOrigin="anonymous"
      style={{
        position:'absolute',
        width: 58, height: 58,
        top:    isBottom ? undefined : 3,
        bottom: isBottom ? 3 : undefined,
        left:   isRight  ? undefined : 3,
        right:  isRight  ? 3 : undefined,
        zIndex: 10,
        pointerEvents:'none',
        objectFit:'contain',
      }}
    />
  );
}

function SectionHeader({ label, bg, color }: { label:string; bg:string; color:string }) {
  return (
    <div style={{
      background: bg,
      padding: '5px 8px',
      textAlign: 'center',
      borderBottom: '1.5px solid #B8860B',
    }}>
      <div style={{ height:1, background:'rgba(218,165,32,0.45)', marginBottom:3 }}/>
      <span style={{
        fontSize: 10, fontWeight: 900, color,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        fontFamily: 'Georgia, serif',
        textShadow: '0 1px 2px rgba(0,0,0,0.45)',
      }}>
        {label}
      </span>
      <div style={{ height:1, background:'rgba(218,165,32,0.45)', marginTop:3 }}/>
    </div>
  );
}

function Item({ name, dot }: { name:string; dot:string }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:5, marginBottom:3 }}>
      <span style={{
        width:6, height:6, borderRadius:'50%', background:dot,
        flexShrink:0, marginTop:3.5, display:'inline-block',
      }}/>
      <span style={{
        fontSize: 9.5, color:'#1A0800', lineHeight:1.35,
        fontFamily:'Georgia, serif',
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

  const BORDER = '#B8860B';

  return (
    <div
      id="amulya-poster"
      style={{
        position:'relative',
        width: 420,
        overflow:'hidden',
        background:'#F5EDD0',
        fontFamily:'Georgia, serif',
      }}
    >
      {/* warm radial glow */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
        background:'radial-gradient(ellipse at 50% 25%, rgba(255,248,215,0.55) 0%, transparent 65%)',
      }}/>

      {/* outer gold border */}
      <div style={{ position:'absolute', inset:5,  border:`2px solid ${BORDER}`,   zIndex:0, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', inset:10, border:`0.75px solid rgba(184,134,11,0.3)`, zIndex:0, pointerEvents:'none' }}/>

      {/* Corner ornaments */}
      <CornerImg pos="tl"/><CornerImg pos="tr"/>
      <CornerImg pos="bl"/><CornerImg pos="br"/>

      {/* ══ CONTENT ══ */}
      <div style={{ position:'relative', zIndex:1, padding:'14px 16px 0' }}>

        {/* ── HEADER: logo left/centre, lady top-right absolutely positioned ── */}
        <div style={{ position:'relative', textAlign:'center', paddingRight:88, minHeight:76, marginBottom:4 }}>
          {/* Full logo (includes the lady from original logo — that's fine) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/amulya-logo.png"
            alt="Amulya Indian Cuisine"
            crossOrigin="anonymous"
            style={{ width:195, display:'inline-block', marginTop:4 }}
          />

          {/* Reference lady — placed top right, OUTSIDE the logo area */}
          <div style={{
            position:'absolute', top:-6, right:-10,
            width:90,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ref-lady.png"
              alt=""
              crossOrigin="anonymous"
              style={{ width:'100%', display:'block' }}
            />
          </div>
        </div>

        {/* gold divider */}
        <GoldDivider />

        {/* ── TITLE ── */}
        <div style={{
          textAlign:'center',
          padding:'5px 6px 5px',
          margin:'2px 0 3px',
          background:'linear-gradient(90deg,transparent,rgba(139,26,16,0.07),rgba(139,26,16,0.11),rgba(139,26,16,0.07),transparent)',
          borderTop:`1.5px solid ${BORDER}`,
          borderBottom:`1.5px solid ${BORDER}`,
        }}>
          <div style={{
            fontSize:20, fontWeight:900, color:'#8B0000',
            textTransform:'uppercase', letterSpacing:'0.03em',
            lineHeight:1.08, fontFamily:'Georgia,serif',
            textShadow:'0 1px 3px rgba(0,0,0,0.1)',
          }}>
            {day} {mealType}
          </div>
          <div style={{
            fontSize:15, fontWeight:900, color:'#6B0000',
            textTransform:'uppercase', letterSpacing:'0.3em', lineHeight:1,
          }}>
            BUFFET
          </div>
          <div style={{ fontSize:8.5, color:'#7B5510', letterSpacing:'0.14em', marginTop:2 }}>
            {dateStr}
          </div>
        </div>

        <GoldDivider />

        {/* ── 3-COLUMN GRID ── */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'1fr 94px 1fr',
          gap:5,
          margin:'5px 0 0',
          alignItems:'start',
        }}>

          {/* LEFT — VEG */}
          <div style={{ border:`1.5px solid ${BORDER}`, borderRadius:2, overflow:'hidden' }}>
            <SectionHeader label="Veg Items" bg="#1B5E1B" color="#F5DEB3"/>
            <div style={{ padding:'6px 7px', background:'rgba(255,253,235,0.55)' }}>
              {vegItems.length === 0
                ? <div style={{fontSize:8.5,color:'#bbb',textAlign:'center',padding:'6px 0'}}>—</div>
                : vegItems.map(i => <Item key={i.id} name={i.name} dot="#2E7D32"/>)
              }
            </div>
          </div>

          {/* CENTRE — SIDES + DESSERTS */}
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <div style={{ border:`1.5px solid ${BORDER}`, borderRadius:2, overflow:'hidden' }}>
              <SectionHeader label="Sides" bg="#7A5C0A" color="#FFFACD"/>
              <div style={{ padding:'6px 7px', background:'rgba(255,253,235,0.55)' }}>
                {accompaniments.map(i => <Item key={i.id} name={i.name} dot="#8B6914"/>)}
              </div>
            </div>
            {desserts.length > 0 && (
              <div style={{ border:`1.5px solid ${BORDER}`, borderRadius:2, overflow:'hidden' }}>
                <SectionHeader label="Desserts" bg="#5C0A14" color="#F5DEB3"/>
                <div style={{ padding:'6px 7px', background:'rgba(255,253,235,0.55)' }}>
                  {desserts.map(i => <Item key={i.id} name={i.name} dot="#DAA520"/>)}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — NON-VEG */}
          <div style={{ border:`1.5px solid ${BORDER}`, borderRadius:2, overflow:'hidden' }}>
            <SectionHeader label="Non-Veg Items" bg="#5C0A14" color="#F5DEB3"/>
            <div style={{ padding:'6px 7px', background:'rgba(255,253,235,0.55)' }}>
              {nonVegItems.length === 0
                ? <div style={{fontSize:8.5,color:'#bbb',textAlign:'center',padding:'6px 0'}}>—</div>
                : nonVegItems.map(i => <Item key={i.id} name={i.name} dot="#B71C1C"/>)
              }
            </div>
          </div>

        </div>

        {/* thin line before food */}
        <div style={{
          height:1.5, marginTop:5,
          background:`linear-gradient(90deg,transparent,${BORDER} 20%,${BORDER} 80%,transparent)`,
        }}/>
      </div>

      {/* ── REAL FOOD PHOTOS ── */}
      <div style={{ overflow:'hidden', height:118, position:'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/food-strip.png"
          alt=""
          crossOrigin="anonymous"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }}
        />
        {/* blend top */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:14,
          background:'linear-gradient(to bottom,#F5EDD0,transparent)',
        }}/>
      </div>

      {/* ── FOOTER BAR ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/footer-bar.png"
        alt="Fresh • Homemade • Authentic"
        crossOrigin="anonymous"
        style={{ width:'100%', display:'block' }}
      />

    </div>
  );
}
