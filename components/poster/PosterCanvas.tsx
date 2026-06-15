'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
  fontFamily?: string;
}

/* Smart line break — only wrap if single word is very long */
function renderLine(name: string) {
  return name; // Keep full name on one line — CSS handles overflow
}

export default function PosterCanvas({
  config,
  fontFamily = '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif',
}: PosterCanvasProps) {
  const { vegItems, nonVegItems, desserts, accompaniments } = config;

  /*
   * Template: 1024×1536px (original quality)
   * Pixel-verified box positions:
   *   VEG:      left=50,  top=396, w=332, h=804
   *   SIDES:    left=401, top=396, w=220, h=633
   *   DESSERTS: left=401, top=1100,w=220, h=100
   *   NONVEG:   left=645, top=396, w=332, h=804
   */

  const VEG_H     = 804;
  const NONVEG_H  = 804;
  const SIDES_H   = 633;
  const DESSERT_H = 100;

  /* Font size scales smoothly with item count */
  const calcSizes = (count: number, boxH: number, minFont = 15, maxFont = 26) => {
    if (count === 0) return { fontSize: maxFont, lineH: maxFont * 1.6 };
    const lineH = Math.min(maxFont * 1.6, boxH / count);
    const fontSize = Math.max(minFont, Math.min(maxFont, lineH / 1.6));
    return { fontSize, lineH: Math.max(lineH, fontSize * 1.3) };
  };

  const vegS     = calcSizes(vegItems.length,      VEG_H);
  const nonvegS  = calcSizes(nonVegItems.length,   NONVEG_H);
  const sidesS   = calcSizes(accompaniments.length, SIDES_H, 13, 22);
  const dessertS = calcSizes(desserts.length,       DESSERT_H, 13, 20);

  const renderItems = (
    items: { id: string; name: string }[],
    dotColor: string,
    sizes: { fontSize: number; lineH: number },
    boxWidth: number,
  ) => items.map((item) => (
    <div
      key={item.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: sizes.lineH,
        fontSize: sizes.fontSize,
        lineHeight: 1,
        color: '#1A0800',
        fontFamily,
        fontWeight: 400,
        letterSpacing: '0.01em',
        overflow: 'hidden',
      }}
    >
      <span style={{
        width: 11, height: 11, borderRadius: '50%',
        background: dotColor, flexShrink: 0,
        display: 'inline-block', marginRight: 9,
      }}/>
      <span style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: boxWidth - 24,
      }}>
        {renderLine(item.name)}
      </span>
    </div>
  ));

  return (
    <div
      id="amulya-poster"
      style={{ position: 'relative', width: 1024, fontFamily, overflow: 'hidden' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/poster-template.png"
        alt="Amulya Buffet Poster"
        crossOrigin="anonymous"
        style={{ width: '100%', display: 'block' }}
      />

      {/* VEG */}
      <div style={{ position:'absolute', left:50, top:396, width:332, height:VEG_H, overflow:'hidden', zIndex:10 }}>
        {renderItems(vegItems, '#2E7D32', vegS, 332)}
      </div>

      {/* SIDES */}
      <div style={{ position:'absolute', left:401, top:396, width:220, height:SIDES_H, overflow:'hidden', zIndex:10 }}>
        {renderItems(accompaniments, '#8B6914', sidesS, 220)}
      </div>

      {/* DESSERTS */}
      {desserts.length > 0 && (
        <div style={{ position:'absolute', left:401, top:1100, width:220, height:DESSERT_H, overflow:'hidden', zIndex:10 }}>
          {renderItems(desserts, '#DAA520', dessertS, 220)}
        </div>
      )}

      {/* NON-VEG */}
      <div style={{ position:'absolute', left:645, top:396, width:332, height:NONVEG_H, overflow:'hidden', zIndex:10 }}>
        {renderItems(nonVegItems, '#B71C1C', nonvegS, 332)}
      </div>
    </div>
  );
}
