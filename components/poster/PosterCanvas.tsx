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
   * Template: 1024×1536px from new reference design
   * Cleared areas for overlay:
   *   TITLE:    left=15,  top=240, w=994,  h=170
   *   VEG:      left=15,  top=495, w=320,  h=645
   *   SIDES:    left=338, top=495, w=326,  h=500
   *   DESSERTS: left=338, top=998, w=326,  h=140
   *   NONVEG:   left=663, top=495, w=346,  h=645
   */

  const VEG_H     = 645;
  const NONVEG_H  = 645;
  const SIDES_H   = 500;
  const DESSERT_H = 140;

  const calcSizes = (count: number, boxH: number, minFont = 18, maxFont = 34) => {
    if (count === 0) return { fontSize: maxFont, lineH: maxFont * 1.55 };
    const lineH = Math.min(maxFont * 1.55, boxH / count);
    const fontSize = Math.max(minFont, Math.min(maxFont, lineH / 1.55));
    return { fontSize, lineH };
  };

  const vegS     = calcSizes(vegItems.length,       VEG_H);
  const nonvegS  = calcSizes(nonVegItems.length,    NONVEG_H);
  const sidesS   = calcSizes(accompaniments.length, SIDES_H, 16, 28);
  const dessertS = calcSizes(desserts.length,       DESSERT_H, 16, 26);

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
        width: Math.max(10, sizes.fontSize * 0.45),
        height: Math.max(10, sizes.fontSize * 0.45),
        borderRadius: '50%',
        background: dotColor,
        flexShrink: 0,
        display: 'inline-block',
        marginRight: Math.max(8, sizes.fontSize * 0.35),
      }}/>
      <span style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: boxWidth - sizes.fontSize,
      }}>
        {item.name}
      </span>
    </div>
  ));

  return (
    <div style={{ position: 'relative', width: 1024, fontFamily, overflow: 'hidden' }}>

      {/* Background template */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/poster-template.png"
        alt="Amulya Buffet Poster"
        crossOrigin="anonymous"
        style={{ width: '100%', display: 'block' }}
      />

      {/* ── DYNAMIC TITLE OVERLAY ── */}
      <div style={{
        position: 'absolute',
        left: 15, top: 240,
        width: 994, height: 170,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 80,
          fontWeight: 900,
          color: '#3B0A0A',
          fontFamily: '"Book Antiqua", "Palatino Linotype", Georgia, serif',
          lineHeight: 1.05,
          letterSpacing: '0.02em',
          textTransform: 'capitalize',
          textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
        }}>
          {day} {mealType} Buffet
        </div>
      </div>

      {/* ── VEG ITEMS ── */}
      <div style={{
        position: 'absolute', left: 15, top: 495,
        width: 320, height: VEG_H,
        overflow: 'hidden', zIndex: 10, paddingLeft: 10,
      }}>
        {renderItems(vegItems, '#2E7D32', vegS, 310)}
      </div>

      {/* ── SIDES ── */}
      <div style={{
        position: 'absolute', left: 338, top: 495,
        width: 326, height: SIDES_H,
        overflow: 'hidden', zIndex: 10, paddingLeft: 8,
      }}>
        {renderItems(accompaniments, '#8B6914', sidesS, 318)}
      </div>

      {/* ── DESSERTS ── */}
      {desserts.length > 0 && (
        <div style={{
          position: 'absolute', left: 338, top: 998,
          width: 326, height: DESSERT_H,
          overflow: 'hidden', zIndex: 10, paddingLeft: 8,
        }}>
          {renderItems(desserts, '#DAA520', dessertS, 318)}
        </div>
      )}

      {/* ── NON-VEG ITEMS ── */}
      <div style={{
        position: 'absolute', left: 663, top: 495,
        width: 346, height: NONVEG_H,
        overflow: 'hidden', zIndex: 10, paddingLeft: 10,
      }}>
        {renderItems(nonVegItems, '#B71C1C', nonvegS, 336)}
      </div>

    </div>
  );
}
