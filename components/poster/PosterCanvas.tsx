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
  const { vegItems, nonVegItems, desserts, accompaniments } = config;

  /*
   * Pixel-verified box positions on 1024×1536 template:
   *   VEG:      left=37,  top=404, w=278, h=796
   *   SIDES:    left=351, top=404, w=298, h=633
   *   DESSERTS: left=351, top=1100,w=298, h=100
   *   NONVEG:   left=666, top=404, w=319, h=796
   */

  const calcSizes = (count: number, boxH: number, minFont = 14, maxFont = 26) => {
    if (count === 0) return { fontSize: maxFont, lineH: maxFont * 1.6 };
    const lineH = Math.min(maxFont * 1.6, boxH / count);
    const fontSize = Math.max(minFont, Math.min(maxFont, lineH / 1.6));
    return { fontSize, lineH };
  };

  const vegS     = calcSizes(vegItems.length,       796);
  const nonvegS  = calcSizes(nonVegItems.length,    796);
  const sidesS   = calcSizes(accompaniments.length, 633, 12, 22);
  const dessertS = calcSizes(desserts.length,       100, 12, 20);

  const renderItems = (
    items: { id: string; name: string }[],
    dotColor: string,
    sizes: { fontSize: number; lineH: number },
    boxWidth: number,
  ) => items.map((item) => (
    <div key={item.id} style={{
      display: 'flex', alignItems: 'center',
      height: sizes.lineH,
      fontSize: sizes.fontSize,
      lineHeight: 1,
      color: '#1A0800',
      fontFamily,
      fontWeight: 400,
      letterSpacing: '0.01em',
      overflow: 'hidden',
    }}>
      <span style={{
        width: 12, height: 12, borderRadius: '50%',
        background: dotColor, flexShrink: 0,
        display: 'inline-block', marginRight: 10,
      }}/>
      <span style={{
        overflow: 'hidden', textOverflow: 'ellipsis',
        whiteSpace: 'nowrap', maxWidth: boxWidth - 26,
      }}>
        {item.name}
      </span>
    </div>
  ));

  return (
    <div style={{ position: 'relative', width: 1024, fontFamily, overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/poster-template.png"
        alt="Amulya Buffet Poster"
        crossOrigin="anonymous"
        style={{ width: '100%', display: 'block' }}
      />

      {/* VEG ITEMS */}
      <div style={{ position:'absolute', left:37, top:404, width:278, height:796, overflow:'hidden', zIndex:10 }}>
        {renderItems(vegItems, '#2E7D32', vegS, 278)}
      </div>

      {/* SIDES */}
      <div style={{ position:'absolute', left:351, top:404, width:298, height:633, overflow:'hidden', zIndex:10 }}>
        {renderItems(accompaniments, '#8B6914', sidesS, 298)}
      </div>

      {/* DESSERTS */}
      {desserts.length > 0 && (
        <div style={{ position:'absolute', left:351, top:1100, width:298, height:100, overflow:'hidden', zIndex:10 }}>
          {renderItems(desserts, '#DAA520', dessertS, 298)}
        </div>
      )}

      {/* NON-VEG ITEMS */}
      <div style={{ position:'absolute', left:666, top:404, width:319, height:796, overflow:'hidden', zIndex:10 }}>
        {renderItems(nonVegItems, '#B71C1C', nonvegS, 319)}
      </div>
    </div>
  );
}
