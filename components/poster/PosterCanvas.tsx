'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
  fontFamily?: string;
}

/* Word-wrap to max 2 words per line for display */
function formatItemName(name: string): string[] {
  const words = name.split(' ');
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += 2) {
    lines.push(words.slice(i, i + 2).join(' '));
  }
  return lines;
}

/* Calculate line height based on item counts - items with 3+ words need 2 lines */
function calcTotalLines(items: { name: string }[]): number {
  return items.reduce((sum, item) => {
    const words = item.name.split(' ').length;
    return sum + (words > 2 ? 2 : 1);
  }, 0);
}

export default function PosterCanvas({ config, fontFamily = '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif' }: PosterCanvasProps) {
  const { vegItems, nonVegItems, desserts, accompaniments } = config;

  /* ── Exact box dimensions from pixel analysis ── */
  /* Veg/NonVeg: x=18, y=160, w=140, h=330  */
  /* Sides: x=162, y=160, w=96, h=260        */
  /* Desserts: x=162, y=455, w=96, h=50      */

  const VEG_BOX_H    = 330;
  const NONVEG_BOX_H = 330;
  const SIDES_BOX_H  = 260;
  const DESSERT_BOX_H= 48;

  /* Dynamic font + line-height calculation */
  const calcSizes = (totalLines: number, boxHeight: number, minFont = 7, maxFont = 9.5) => {
    const maxLinesAtMax = Math.floor(boxHeight / (maxFont * 1.55));
    if (totalLines <= maxLinesAtMax) {
      return { fontSize: maxFont, lineH: maxFont * 1.55 };
    }
    const lineH = boxHeight / totalLines;
    const fontSize = Math.max(minFont, lineH / 1.55);
    return { fontSize, lineH };
  };

  const vegLines    = calcTotalLines(vegItems);
  const nonvegLines = calcTotalLines(nonVegItems);
  const sidesLines  = calcTotalLines(accompaniments);
  const dessertLines= calcTotalLines(desserts);

  const vegSizes     = calcSizes(vegLines,     VEG_BOX_H);
  const nonvegSizes  = calcSizes(nonvegLines,  NONVEG_BOX_H);
  const sidesSizes   = calcSizes(sidesLines,   SIDES_BOX_H, 7, 8.5);
  const dessertSizes = calcSizes(dessertLines, DESSERT_BOX_H, 6.5, 8);

  const renderItems = (
    items: { id: string; name: string }[],
    dotColor: string,
    sizes: { fontSize: number; lineH: number },
    boxWidth: number
  ) => items.map((item) => {
    const lines = formatItemName(item.name);
    return (
      <div key={item.id} style={{ marginBottom: 0 }}>
        {lines.map((line, li) => (
          <div
            key={li}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: sizes.lineH,
              fontSize: sizes.fontSize,
              lineHeight: `${sizes.lineH}px`,
              color: '#1A0800',
              fontFamily,
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            {li === 0 ? (
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: dotColor, flexShrink: 0,
                display: 'inline-block', marginRight: 4,
              }}/>
            ) : (
              <span style={{ width: 9, flexShrink: 0, display: 'inline-block' }}/>
            )}
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: boxWidth - 14,
            }}>
              {line}
            </span>
          </div>
        ))}
      </div>
    );
  });

  return (
    <div
      id="amulya-poster"
      style={{ position: 'relative', width: 420, fontFamily, overflow: 'hidden' }}
    >
      {/* Background template */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/poster-template.png"
        alt="Amulya Buffet Poster Template"
        crossOrigin="anonymous"
        style={{ width: '100%', display: 'block' }}
      />

      {/* ── VEG ITEMS — left column ── */}
      <div style={{
        position: 'absolute', left: 20, top: 162,
        width: 138, height: VEG_BOX_H,
        overflow: 'hidden', zIndex: 10,
      }}>
        {renderItems(vegItems, '#2E7D32', vegSizes, 138)}
      </div>

      {/* ── SIDES — centre column top ── */}
      <div style={{
        position: 'absolute', left: 164, top: 162,
        width: 92, height: SIDES_BOX_H,
        overflow: 'hidden', zIndex: 10,
      }}>
        {renderItems(accompaniments, '#8B6914', sidesSizes, 92)}
      </div>

      {/* ── DESSERTS — centre column bottom ── */}
      {desserts.length > 0 && (
        <div style={{
          position: 'absolute', left: 164, top: 457,
          width: 92, height: DESSERT_BOX_H,
          overflow: 'hidden', zIndex: 10,
        }}>
          {renderItems(desserts, '#DAA520', dessertSizes, 92)}
        </div>
      )}

      {/* ── NON-VEG ITEMS — right column ── */}
      <div style={{
        position: 'absolute', left: 264, top: 162,
        width: 138, height: NONVEG_BOX_H,
        overflow: 'hidden', zIndex: 10,
      }}>
        {renderItems(nonVegItems, '#B71C1C', nonvegSizes, 138)}
      </div>
    </div>
  );
}
