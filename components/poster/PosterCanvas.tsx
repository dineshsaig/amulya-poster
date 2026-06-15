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
   * Template: 1024×1536px
   * Content area: y=492 to y=1161  (total height = 669px)
   * Columns:
   *   VEG:    x=40,  w=262
   *   SIDES:  x=338, w=313
   *   NONVEG: x=662, w=322
   *
   * Layout strategy:
   * - VEG & NONVEG get the full 669px height
   * - SIDES gets the top portion, DESSERTS gets the bottom
   * - We render a "Desserts" sub-header in code at the split point
   */

  const CONTENT_TOP  = 492;
  const CONTENT_BOT  = 1158;
  const CONTENT_H    = CONTENT_BOT - CONTENT_TOP; // 666px

  // Desserts header height (rendered in code)
  const DESSERT_HDR_H = 60;

  // Calculate sides height vs desserts height
  const sidesCount   = accompaniments.length;
  const dessertCount = desserts.length;

  // Sides gets proportional space, desserts gets the rest
  const totalCentreSections = sidesCount + dessertCount;
  const sidesH = dessertCount > 0
    ? Math.min(CONTENT_H - DESSERT_HDR_H - dessertCount * 55, Math.floor(CONTENT_H * 0.65))
    : CONTENT_H;
  const dessertH = dessertCount > 0
    ? CONTENT_H - sidesH - DESSERT_HDR_H
    : 0;
  const dessertTop = CONTENT_TOP + sidesH + DESSERT_HDR_H;

  // Auto-scale font sizes
  const calcSizes = (count: number, boxH: number, minFont = 18, maxFont = 36) => {
    if (count === 0) return { fontSize: maxFont, lineH: maxFont * 1.55 };
    const lineH = Math.min(maxFont * 1.55, boxH / count);
    const fontSize = Math.max(minFont, Math.min(maxFont, lineH / 1.55));
    return { fontSize, lineH };
  };

  const vegS     = calcSizes(vegItems.length,    CONTENT_H);
  const nonvegS  = calcSizes(nonVegItems.length, CONTENT_H);
  const sidesS   = calcSizes(sidesCount,         sidesH, 16, 30);
  const dessertS = calcSizes(dessertCount,        dessertH, 16, 28);

  const renderItems = (
    items: { id: string; name: string }[],
    dotColor: string,
    sizes: { fontSize: number; lineH: number },
    boxWidth: number,
  ) => items.map((item) => (
    <div key={item.id} style={{
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
    }}>
      <span style={{
        width: Math.max(10, sizes.fontSize * 0.42),
        height: Math.max(10, sizes.fontSize * 0.42),
        borderRadius: '50%',
        background: dotColor,
        flexShrink: 0,
        display: 'inline-block',
        marginRight: Math.max(10, sizes.fontSize * 0.32),
      }}/>
      <span style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: boxWidth - sizes.fontSize - 10,
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

      {/* ── DYNAMIC TITLE ── */}
      <div style={{
        position: 'absolute',
        left: 15, top: 235,
        width: 994, height: 175,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 76,
          fontWeight: 900,
          color: '#3B0A0A',
          fontFamily,
          lineHeight: 1.08,
          letterSpacing: '0.01em',
          textShadow: '1px 1px 3px rgba(0,0,0,0.12)',
        }}>
          {day} {mealType} Buffet
        </div>
      </div>

      {/* ── VEG ITEMS ── */}
      <div style={{
        position: 'absolute',
        left: 40, top: CONTENT_TOP,
        width: 262, height: CONTENT_H,
        overflow: 'hidden', zIndex: 10,
        paddingLeft: 4,
      }}>
        {renderItems(vegItems, '#2E7D32', vegS, 256)}
      </div>

      {/* ── SIDES ── */}
      <div style={{
        position: 'absolute',
        left: 338, top: CONTENT_TOP,
        width: 313, height: sidesH,
        overflow: 'hidden', zIndex: 10,
        paddingLeft: 4,
      }}>
        {renderItems(accompaniments, '#8B6914', sidesS, 307)}
      </div>

      {/* ── DESSERTS HEADER (rendered in code) ── */}
      {desserts.length > 0 && (
        <div style={{
          position: 'absolute',
          left: 338,
          top: CONTENT_TOP + sidesH,
          width: 313,
          height: DESSERT_HDR_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '90%',
          }}>
            <div style={{ flex: 1, height: 2, background: 'linear-gradient(to right, transparent, #B8860B)' }}/>
            <span style={{
              fontSize: 28, fontWeight: 800,
              color: '#3B0A0A',
              fontFamily,
              letterSpacing: '0.08em',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
            }}>
              ✦ Desserts ✦
            </span>
            <div style={{ flex: 1, height: 2, background: 'linear-gradient(to left, transparent, #B8860B)' }}/>
          </div>
        </div>
      )}

      {/* ── DESSERTS ITEMS ── */}
      {desserts.length > 0 && (
        <div style={{
          position: 'absolute',
          left: 338,
          top: dessertTop,
          width: 313,
          height: dessertH,
          overflow: 'hidden', zIndex: 10,
          paddingLeft: 4,
        }}>
          {renderItems(desserts, '#DAA520', dessertS, 307)}
        </div>
      )}

      {/* ── NON-VEG ITEMS ── */}
      <div style={{
        position: 'absolute',
        left: 662, top: CONTENT_TOP,
        width: 322, height: CONTENT_H,
        overflow: 'hidden', zIndex: 10,
        paddingLeft: 4,
      }}>
        {renderItems(nonVegItems, '#B71C1C', nonvegS, 316)}
      </div>

    </div>
  );
}
