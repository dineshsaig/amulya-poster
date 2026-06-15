'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
}

function GoldLine() {
  return (
    <div style={{
      height: 1.5,
      background: 'linear-gradient(90deg, transparent 0%, #B8860B 20%, #DAA520 50%, #B8860B 80%, transparent 100%)',
      margin: '2px 0',
    }} />
  );
}

function ScrollDivider() {
  return (
    <svg viewBox="0 0 260 12" style={{ display: 'block', width: '100%', height: 12 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sdg2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#8B6914" stopOpacity="0"/>
          <stop offset="35%"  stopColor="#DAA520"/>
          <stop offset="65%"  stopColor="#DAA520"/>
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1="0" y1="6" x2="260" y2="6" stroke="url(#sdg2)" strokeWidth="0.8"/>
      <circle cx="130" cy="6" r="3.5" fill="none" stroke="#DAA520" strokeWidth="1"/>
      <circle cx="130" cy="6" r="1.5" fill="#DAA520"/>
      <circle cx="108" cy="6" r="1.5" fill="none" stroke="#DAA520" strokeWidth="0.7"/>
      <circle cx="152" cy="6" r="1.5" fill="none" stroke="#DAA520" strokeWidth="0.7"/>
      <line x1="88"  y1="6" x2="103" y2="6" stroke="#DAA520" strokeWidth="0.7"/>
      <line x1="157" y1="6" x2="172" y2="6" stroke="#DAA520" strokeWidth="0.7"/>
    </svg>
  );
}

function SectionBadge({ label, color }: { label: string; color: 'green' | 'maroon' | 'gold' }) {
  const cfg = {
    green:  { bg: '#1B4D1B', border: '#DAA520', text: '#F5DEB3' },
    maroon: { bg: '#5C0A14', border: '#DAA520', text: '#F5DEB3' },
    gold:   { bg: '#7A5C0A', border: '#DAA520', text: '#FFFACD' },
  }[color];
  return (
    <div style={{
      background: cfg.bg,
      border: `1.5px solid ${cfg.border}`,
      borderRadius: 3,
      padding: '3px 6px',
      textAlign: 'center',
      marginBottom: 5,
    }}>
      <div style={{ height: 1, background: cfg.border, marginBottom: 2, opacity: 0.5 }} />
      <span style={{
        fontSize: 9.5, fontWeight: 800, color: cfg.text,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        fontFamily: 'Georgia, serif',
      }}>
        ✦ {label} ✦
      </span>
      <div style={{ height: 1, background: cfg.border, marginTop: 2, opacity: 0.5 }} />
    </div>
  );
}

function VegItem({ name }: { name: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 2 }}>
      <span style={{ color: '#2E7D32', fontSize: 7, flexShrink: 0, marginTop: 2, lineHeight: 1 }}>●</span>
      <span style={{ fontSize: 9, color: '#1A0800', fontFamily: 'Georgia,serif', lineHeight: 1.3, wordBreak: 'break-word' }}>
        {name}
      </span>
    </div>
  );
}

function NonVegItem({ name }: { name: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 2 }}>
      <span style={{ color: '#B71C1C', fontSize: 7, flexShrink: 0, marginTop: 2, lineHeight: 1 }}>●</span>
      <span style={{ fontSize: 9, color: '#1A0800', fontFamily: 'Georgia,serif', lineHeight: 1.3, wordBreak: 'break-word' }}>
        {name}
      </span>
    </div>
  );
}

function SideItem({ name, diamond = false }: { name: string; diamond?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 2 }}>
      <span style={{ color: diamond ? '#DAA520' : '#8B6914', fontSize: diamond ? 7 : 7, flexShrink: 0, marginTop: 2, lineHeight: 1 }}>
        {diamond ? '◆' : '●'}
      </span>
      <span style={{ fontSize: 9, color: '#1A0800', fontFamily: 'Georgia,serif', lineHeight: 1.3, wordBreak: 'break-word' }}>
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

  return (
    <div
      id="amulya-poster"
      style={{
        position: 'relative',
        width: 420,
        overflow: 'hidden',
        fontFamily: 'Georgia, "Times New Roman", serif',
        background: 'linear-gradient(170deg, #FBF0D2 0%, #F4E3B0 50%, #EDD898 100%)',
      }}
    >
      {/* grain texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.035, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }} />
      {/* outer border */}
      <div style={{ position: 'absolute', inset: 5, border: '2px solid #B8860B', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 9, border: '0.75px solid rgba(184,134,11,0.35)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '10px 12px 0' }}>

        {/* ── HEADER ROW ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>

          {/* Fresh/Homemade/Authentic badge */}
          <div style={{
            width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
            background: 'radial-gradient(circle at 40% 40%, #2E6B2E, #0F2D0F)',
            border: '2.5px solid #DAA520',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}>
            <div style={{ textAlign: 'center' }}>
              {['FRESH', 'HOME', 'MADE', 'AUTHEN', 'TIC'].map((w, i) => (
                <div key={i} style={{ fontSize: 6.5, fontWeight: 900, color: '#F5DEB3', letterSpacing: '0.03em', lineHeight: 1.25 }}>
                  {w}
                </div>
              ))}
            </div>
          </div>

          {/* Centre logo — just use the full logo image, no text overlay */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/amulya-logo.png"
              alt="Amulya Indian Cuisine"
              crossOrigin="anonymous"
              style={{ width: 185, display: 'inline-block' }}
            />
          </div>

          {/* Lady illustration — cropped tighter */}
          <div style={{ width: 64, flexShrink: 0, display: 'flex', alignItems: 'flex-end' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/amulya-lady.png"
              alt=""
              crossOrigin="anonymous"
              style={{ width: 64, display: 'block' }}
            />
          </div>
        </div>

        <ScrollDivider />

        {/* ── DAY + MEAL TITLE ── */}
        <div style={{
          textAlign: 'center',
          background: 'linear-gradient(90deg,transparent,rgba(139,26,16,0.09),rgba(139,26,16,0.13),rgba(139,26,16,0.09),transparent)',
          borderTop: '1.5px solid #B8860B',
          borderBottom: '1.5px solid #B8860B',
          padding: '4px 6px 4px',
          margin: '3px -4px 4px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <span style={{ color: '#8B6914', fontSize: 11 }}>❧</span>
            <div>
              <div style={{
                fontSize: 18,
                fontWeight: 900,
                color: '#7A1208',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                lineHeight: 1.1,
                textShadow: '0 1px 2px rgba(0,0,0,0.12)',
                fontFamily: 'Georgia, serif',
              }}>
                {day} {mealType}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 900,
                color: '#5C0800',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}>
                BUFFET
              </div>
            </div>
            <span style={{ color: '#8B6914', fontSize: 11 }}>❧</span>
          </div>
          <div style={{ fontSize: 8, color: '#7B5010', letterSpacing: '0.15em', marginTop: 2 }}>
            {dateStr}
          </div>
        </div>

        {/* ── 3-COLUMN GRID ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '155px 96px 155px',
          gap: 4,
          marginBottom: 4,
          alignItems: 'start',
        }}>

          {/* LEFT — VEG */}
          <div>
            <SectionBadge label="Veg Items" color="green" />
            {vegItems.length === 0
              ? <div style={{ fontSize: 8, color: '#999', textAlign: 'center' }}>None selected</div>
              : vegItems.map(item => <VegItem key={item.id} name={item.name} />)
            }
          </div>

          {/* CENTRE — ACCOMPANIMENTS + DESSERTS */}
          <div>
            <SectionBadge label="Sides" color="gold" />
            {accompaniments.map(item => <SideItem key={item.id} name={item.name} />)}

            {desserts.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <SectionBadge label="Desserts" color="maroon" />
                {desserts.map(item => <SideItem key={item.id} name={item.name} diamond />)}
              </div>
            )}
          </div>

          {/* RIGHT — NON-VEG */}
          <div>
            <SectionBadge label="Non-Veg Items" color="maroon" />
            {nonVegItems.length === 0
              ? <div style={{ fontSize: 8, color: '#999', textAlign: 'center' }}>None selected</div>
              : nonVegItems.map(item => <NonVegItem key={item.id} name={item.name} />)
            }
          </div>

        </div>

        <GoldLine />

      </div>

      {/* ── FOOD STRIP ── */}
      <div style={{ height: 100, overflow: 'hidden', position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/food-strip.png"
          alt=""
          crossOrigin="anonymous"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%', display: 'block' }}
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 18,
          background: 'linear-gradient(to bottom, #EDD898, transparent)',
        }} />
      </div>

      {/* ── FOOTER BANNER ── */}
      <div style={{
        background: 'linear-gradient(90deg, #0D270D, #1B4D1B, #0D270D)',
        borderTop: '2px solid #DAA520',
        padding: '6px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0,
      }}>
        {['FRESH', 'HOMEMADE', 'AUTHENTIC'].map((word, i) => (
          <React.Fragment key={word}>
            <span style={{
              fontSize: 11, fontWeight: 900, color: '#F5DEB3',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              fontFamily: 'Georgia, serif',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}>
              {word}
            </span>
            {i < 2 && <span style={{ color: '#DAA520', fontSize: 14, margin: '0 10px' }}>●</span>}
          </React.Fragment>
        ))}
      </div>

    </div>
  );
}
