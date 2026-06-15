'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
}

function GoldScrollDivider() {
  return (
    <svg viewBox="0 0 420 18" style={{ display:'block', width:'100%', height:18 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gsd" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8B6914" stopOpacity="0"/>
          <stop offset="25%"  stopColor="#B8860B"/>
          <stop offset="50%"  stopColor="#DAA520"/>
          <stop offset="75%"  stopColor="#B8860B"/>
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="9" x2="420" y2="9" stroke="url(#gsd)" strokeWidth="1"/>
      <ellipse cx="210" cy="9" rx="9" ry="6" fill="none" stroke="#B8860B" strokeWidth="1.2"/>
      <ellipse cx="210" cy="9" rx="4" ry="3" fill="#B8860B"/>
      <path d="M175,9 Q183,4 190,9 Q183,14 175,9Z" fill="none" stroke="#B8860B" strokeWidth="0.9"/>
      <path d="M245,9 Q237,4 230,9 Q237,14 245,9Z" fill="none" stroke="#B8860B" strokeWidth="0.9"/>
      <line x1="155" y1="6" x2="155" y2="12" stroke="#B8860B" strokeWidth="0.8"/>
      <line x1="265" y1="6" x2="265" y2="12" stroke="#B8860B" strokeWidth="0.8"/>
    </svg>
  );
}

function SectionPanel({ children, headerBg, headerText, headerLabel }: {
  children: React.ReactNode;
  headerBg: string; headerText: string; headerLabel: string;
}) {
  return (
    <div style={{ border:'1.5px solid #B8860B', borderRadius:2, overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ background:headerBg, padding:'4px 6px 3px', textAlign:'center', borderBottom:'1.5px solid #B8860B' }}>
        <div style={{ height:1, background:'rgba(218,165,32,0.5)', marginBottom:2 }}/>
        <span style={{ fontSize:10, fontWeight:900, color:headerText, letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'Georgia,serif' }}>
          {headerLabel}
        </span>
        <div style={{ height:1, background:'rgba(218,165,32,0.5)', marginTop:2 }}/>
      </div>
      <div style={{ flex:1, padding:'5px 6px', background:'rgba(255,252,235,0.5)' }}>
        {children}
      </div>
    </div>
  );
}

function Item({ name, dotColor }: { name: string; dotColor: string }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:5, marginBottom:3 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:dotColor, flexShrink:0, marginTop:3, display:'inline-block' }}/>
      <span style={{ fontSize:9.5, color:'#1A0800', lineHeight:1.3, fontFamily:'Georgia,serif' }}>{name}</span>
    </div>
  );
}

function CornerImg({ pos }: { pos:'tl'|'tr'|'bl'|'br' }) {
  const isRight = pos.endsWith('r');
  const isBottom = pos.startsWith('b');
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/corner-${pos}.png`} alt="" crossOrigin="anonymous"
      style={{ position:'absolute', width:52, height:52, top:isBottom?undefined:2, bottom:isBottom?2:undefined,
        left:isRight?undefined:2, right:isRight?2:undefined, opacity:0.92, pointerEvents:'none', zIndex:5 }}/>
  );
}

export default function PosterCanvas({ config }: PosterCanvasProps) {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;
  const dateStr = new Date().toLocaleDateString('en-AU', { day:'numeric', month:'long', year:'numeric' });

  return (
    <div id="amulya-poster" style={{
      position:'relative', width:420, overflow:'hidden',
      fontFamily:'Georgia,"Times New Roman",serif',
      background:'#F5EDD0',
    }}>
      {/* warm vignette */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
        background:'radial-gradient(ellipse at 50% 25%, rgba(255,248,210,0.55) 0%, transparent 70%)' }}/>
      {/* borders */}
      <div style={{ position:'absolute', inset:6, border:'1.5px solid #B8860B', zIndex:0, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', inset:10, border:'0.5px solid rgba(184,134,11,0.3)', zIndex:0, pointerEvents:'none' }}/>

      <CornerImg pos="tl"/><CornerImg pos="tr"/><CornerImg pos="bl"/><CornerImg pos="br"/>

      <div style={{ position:'relative', zIndex:1, padding:'12px 14px 0' }}>

        {/* ── HEADER: logo left-centre, lady right ── */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:2 }}>

          {/* Full Amulya logo — takes up left 72% */}
          <div style={{ flex:1 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/amulya-logo.png" alt="Amulya Indian Cuisine" crossOrigin="anonymous"
              style={{ width:210, display:'block' }}/>
          </div>

          {/* Lady — right side, no overlap */}
          <div style={{ width:88, flexShrink:0, marginBottom:-4 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ref-lady.png" alt="" crossOrigin="anonymous"
              style={{ width:'100%', display:'block' }}/>
          </div>
        </div>

        <GoldScrollDivider />

        {/* ── TITLE ── */}
        <div style={{ textAlign:'center', padding:'4px 0 3px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <span style={{ color:'#8B6914', fontSize:12 }}>❧</span>
            <div>
              <div style={{ fontSize:22, fontWeight:900, color:'#8B0000', letterSpacing:'0.03em',
                textTransform:'uppercase', lineHeight:1.05, fontFamily:'Georgia,serif',
                textShadow:'0 1px 2px rgba(0,0,0,0.1)' }}>
                {day} {mealType}
              </div>
              <div style={{ fontSize:16, fontWeight:900, color:'#6B0000', letterSpacing:'0.28em',
                textTransform:'uppercase', lineHeight:1 }}>
                BUFFET
              </div>
            </div>
            <span style={{ color:'#8B6914', fontSize:12 }}>❧</span>
          </div>
          <div style={{ fontSize:8.5, color:'#7B5510', letterSpacing:'0.15em', marginTop:2 }}>
            {dateStr}
          </div>
        </div>

        <GoldScrollDivider />

        {/* ── 3-COLUMN GRID ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 98px 1fr', gap:5, margin:'5px 0 5px', alignItems:'start' }}>

          {/* VEG */}
          <SectionPanel headerLabel="Veg Items" headerBg="#1B5E1B" headerText="#F5DEB3">
            {vegItems.length === 0
              ? <div style={{fontSize:8.5,color:'#aaa',textAlign:'center',padding:'6px 0'}}>—</div>
              : vegItems.map(i => <Item key={i.id} name={i.name} dotColor="#2E7D32"/>)
            }
          </SectionPanel>

          {/* CENTRE */}
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <SectionPanel headerLabel="Sides" headerBg="#7A5C0A" headerText="#FFFACD">
              {accompaniments.map(i => <Item key={i.id} name={i.name} dotColor="#8B6914"/>)}
            </SectionPanel>
            {desserts.length > 0 && (
              <SectionPanel headerLabel="Desserts" headerBg="#5C0A14" headerText="#F5DEB3">
                {desserts.map(i => <Item key={i.id} name={i.name} dotColor="#DAA520"/>)}
              </SectionPanel>
            )}
          </div>

          {/* NON-VEG */}
          <SectionPanel headerLabel="Non-Veg Items" headerBg="#5C0A14" headerText="#F5DEB3">
            {nonVegItems.length === 0
              ? <div style={{fontSize:8.5,color:'#aaa',textAlign:'center',padding:'6px 0'}}>—</div>
              : nonVegItems.map(i => <Item key={i.id} name={i.name} dotColor="#B71C1C"/>)
            }
          </SectionPanel>
        </div>

        <div style={{ height:1, background:'linear-gradient(90deg,transparent,#B8860B 20%,#DAA520 50%,#B8860B 80%,transparent)', margin:'2px 0 0' }}/>
      </div>

      {/* ── FOOD STRIP ── */}
      <div style={{ position:'relative', overflow:'hidden', height:115 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/food-strip.png" alt="" crossOrigin="anonymous"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 18%', display:'block' }}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:18,
          background:'linear-gradient(to bottom, #F5EDD0, transparent)' }}/>
      </div>

      {/* ── FOOTER BAR ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/footer-bar.png" alt="" crossOrigin="anonymous" style={{ width:'100%', display:'block' }}/>
    </div>
  );
}
