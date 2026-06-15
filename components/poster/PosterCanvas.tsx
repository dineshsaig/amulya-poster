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

  const sidesH   = desserts.length > 0 ? (1155 - 555 - 10) : 600;

  const calcSizes = (count: number, boxH: number, min = 20, max = 38) => {
    if (count === 0) return { fontSize: max, lineH: max * 1.55 };
    const lineH = Math.min(max * 1.55, boxH / count);
    return { fontSize: Math.max(min, Math.min(max, lineH / 1.55)), lineH };
  };

  const vegS     = calcSizes(vegItems.length,       800);
  const nonvegS  = calcSizes(nonVegItems.length,    800);
  const sidesS   = calcSizes(accompaniments.length, sidesH, 18, 30);
  const dessertS = calcSizes(desserts.length,       200, 18, 30);

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
        width: Math.max(9, sizes.fontSize * 0.46),
        height: Math.max(9, sizes.fontSize * 0.46),
        borderRadius: '50%', background: dot,
        flexShrink: 0, display: 'inline-block',
        marginRight: Math.max(8, sizes.fontSize * 0.32),
      }}/>
      <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth: maxW }}>
        {name}
      </span>
    </div>
  );

  const titleText = `${day} ${mealType} Buffet`;
  const titleSize = titleText.length > 22 ? 56 : titleText.length > 18 ? 64 : 72;

  return (
    <div style={{ position: 'relative', width: 1024, overflow: 'hidden', fontFamily }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/poster-template.png" alt="" crossOrigin="anonymous" style={{ width: '100%', display: 'block' }}/>

      {/* TITLE */}
      <div style={{
        position: 'absolute', left: 120, top: 220, width: 770, height: 160,
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
      }}>
        <div style={{ fontSize: titleSize, fontWeight: 900, color: '#5C0A00', fontFamily, lineHeight: 1.05, textAlign: 'center' }}>
          {titleText}
        </div>
      </div>

      {/* VEG */}
      <div style={{ position:'absolute', left:35, top:555, width:283, height:800, overflow:'hidden', zIndex:10 }}>
        {vegItems.map(i => <Item key={i.id} name={i.name} dot="#2E7D32" sizes={vegS} maxW={248}/>)}
      </div>

      {/* SIDES */}
      <div style={{ position:'absolute', left:354, top:555, width:301, height:sidesH, overflow:'hidden', zIndex:10 }}>
        {accompaniments.map(i => <Item key={i.id} name={i.name} dot="#8B6914" sizes={sidesS} maxW={266}/>)}
      </div>

      {/* DESSERTS */}
      {desserts.length > 0 && (
        <div style={{ position:'absolute', left:354, top:1155, width:301, height:200, overflow:'hidden', zIndex:10 }}>
          {desserts.map(i => <Item key={i.id} name={i.name} dot="#8B4513" sizes={dessertS} maxW={266}/>)}
        </div>
      )}

      {/* NON-VEG */}
      <div style={{ position:'absolute', left:690, top:555, width:299, height:800, overflow:'hidden', zIndex:10 }}>
        {nonVegItems.map(i => <Item key={i.id} name={i.name} dot="#B71C1C" sizes={nonvegS} maxW={264}/>)}
      </div>
    </div>
  );
}
