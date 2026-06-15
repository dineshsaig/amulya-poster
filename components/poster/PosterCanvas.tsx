'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
  fontFamily?: string;
}

export default function PosterCanvas({
  config,
  fontFamily = '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif',
}: PosterCanvasProps) {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  /*
   * New Canva template positions (1024×1536px):
   *   TITLE:    x=120, y=225, w=770, h=110
   *   VEG:      x=38,  y=496, w=277, h=590
   *   SIDES:    x=351, y=496, w=296, h=440
   *   DESSERTS: x=351, y=960, w=296, h=125
   *   NONVEG:   x=683, y=496, w=302, h=590
   */

  const calcSizes = (count: number, boxH: number, min = 16, max = 32) => {
    if (count === 0) return { fontSize: max, lineH: max * 1.5 };
    const lineH = Math.min(max * 1.5, boxH / count);
    return { fontSize: Math.max(min, Math.min(max, lineH / 1.5)), lineH };
  };

  const sidesH   = desserts.length > 0 ? (960 - 496 - 10) : 440;
  const vegS     = calcSizes(vegItems.length,       590);
  const nonvegS  = calcSizes(nonVegItems.length,    590);
  const sidesS   = calcSizes(accompaniments.length, sidesH, 14, 26);
  const dessertS = calcSizes(desserts.length,       125, 14, 24);

  const Item = ({ name, dot, sizes, maxW }: {
    name: string; dot: string;
    sizes: { fontSize: number; lineH: number }; maxW: number;
  }) => (
    <div style={{
      display: 'flex', alignItems: 'center',
      height: sizes.lineH, overflow: 'hidden',
      fontSize: sizes.fontSize, color: '#1A0800',
      fontFamily, fontWeight: 400,
    }}>
      <span style={{
        width: Math.max(8, sizes.fontSize * 0.44),
        height: Math.max(8, sizes.fontSize * 0.44),
        borderRadius: '50%', background: dot,
        flexShrink: 0, display: 'inline-block',
        marginRight: Math.max(6, sizes.fontSize * 0.3),
      }}/>
      <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth: maxW }}>
        {name}
      </span>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: 1024, overflow: 'hidden', fontFamily }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/poster-template.png" alt="" crossOrigin="anonymous" style={{ width: '100%', display: 'block' }}/>

      {/* TITLE */}
      <div style={{
        position: 'absolute', left: 120, top: 225, width: 770, height: 110,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10, textAlign: 'center',
      }}>
        <div style={{
          fontSize: `${day.length + mealType.length > 18 ? 52 : 66}px`,
          fontWeight: 900, color: '#5C0A00', fontFamily, lineHeight: 1.05,
        }}>
          {day} {mealType} Buffet
        </div>
      </div>

      {/* VEG */}
      <div style={{ position:'absolute', left:38, top:496, width:277, height:590, overflow:'hidden', zIndex:10 }}>
        {vegItems.map(i => <Item key={i.id} name={i.name} dot="#2E7D32" sizes={vegS} maxW={240}/>)}
      </div>

      {/* SIDES */}
      <div style={{ position:'absolute', left:351, top:496, width:296, height:sidesH, overflow:'hidden', zIndex:10 }}>
        {accompaniments.map(i => <Item key={i.id} name={i.name} dot="#8B6914" sizes={sidesS} maxW={260}/>)}
      </div>

      {/* DESSERTS */}
      {desserts.length > 0 && (
        <div style={{ position:'absolute', left:351, top:960, width:296, height:125, overflow:'hidden', zIndex:10 }}>
          {desserts.map(i => <Item key={i.id} name={i.name} dot="#8B4513" sizes={dessertS} maxW={260}/>)}
        </div>
      )}

      {/* NON-VEG */}
      <div style={{ position:'absolute', left:683, top:496, width:302, height:590, overflow:'hidden', zIndex:10 }}>
        {nonVegItems.map(i => <Item key={i.id} name={i.name} dot="#B71C1C" sizes={nonvegS} maxW={265}/>)}
      </div>
    </div>
  );
}
