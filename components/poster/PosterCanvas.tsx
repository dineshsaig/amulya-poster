'use client';
/**
 * PosterCanvas.tsx — v21 FINAL
 *
 * Mirrors posterExport.ts v21 exactly:
 *   • Uniform font size per column (all items same size)
 *   • Natural line height capped at fontSize×2.2 (no huge gaps)
 *   • Items vertically centred as a group within the box
 *   • Fixed small dot (7px) for maximum text room
 *
 * BOX MAP (1024 × 1819):
 *   TITLE:    x=30,  y=252, w=964, h=175
 *   VEG:      x=12,  y=560, w=328, h=730
 *   SIDES:    x=342, y=565, w=334, h=398
 *   DESSERTS: x=342, y=1100,w=334, h=193
 *   NONVEG:   x=678, y=560, w=336, h=730
 */

import React, { useMemo, CSSProperties } from 'react';
import { PosterConfig } from '@/types';

const TW = 1024;
const TH = 1819;

const px   = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;
const vw   = (v: number)                => `${((v / TW) * 100).toFixed(3)}vw`;

// Fixed dot radius matching posterExport.ts (DOT_R = 7)
const DOT_R = 7;

interface Box { x: number; y: number; w: number; h: number }

/**
 * Estimate uniform font size for a column using the same logic as posterExport.ts.
 * Approximates Book Antiqua glyph width as fontSize × 0.60.
 */
function calcUniformFont(
  items: { name: string }[],
  box: Box,
  minFont: number,
  maxFont: number,
): number {
  if (items.length === 0) return maxFont;

  const textX   = box.x + 5 + DOT_R + DOT_R + 9;
  const maxTextW = box.w - (textX - box.x) - 6;
  const longest  = Math.max(...items.map(it => it.name.length));

  let fs = maxFont;
  while (fs > minFont && longest * fs * 0.60 > maxTextW) fs -= 1;
  return fs;
}

interface ColumnProps {
  items: { name: string; id: string }[];
  box: Box;
  dotColor: string;
  minFont: number;
  maxFont: number;
}

function Column({ items, box, dotColor, minFont, maxFont }: ColumnProps) {
  const fontPx = useMemo(
    () => calcUniformFont(items, box, minFont, maxFont),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.map(i => i.name).join(','), box.w, box.h, minFont, maxFont],
  );

  if (items.length === 0) return null;

  const n        = items.length;
  const maxLineH = fontPx * 2.2;
  const lineH    = Math.min(box.h / n, maxLineH);
  const groupH   = lineH * n;
  const startY   = box.y + (box.h - groupH) / 2;

  const lineHPct = (lineH / TH) * 100;
  const fontVw   = vw(fontPx);
  const dotVw    = vw(DOT_R);

  // dot cx from left edge of box
  const dotCXpx   = box.x + 5 + DOT_R;
  const textXpx   = dotCXpx + DOT_R + 9;

  return (
    <div style={{
      position: 'absolute',
      left:     px(box.x, TW),
      top:      px(startY, TH),
      width:    px(box.w, TW),
      height:   px(groupH, TH),
      overflow: 'hidden',
    }}>
      {items.map((item, i) => {
        const rowStyle: CSSProperties = {
          position:   'absolute',
          top:        `${(i * lineHPct).toFixed(3)}%`,
          left:       0,
          right:      0,
          height:     `${lineHPct.toFixed(3)}%`,
          display:    'flex',
          alignItems: 'center',
          overflow:   'hidden',
        };
        const dotStyle: CSSProperties = {
          position:     'absolute',
          left:         px(dotCXpx - box.x - DOT_R, box.w),
          width:        `calc(${dotVw} * 2)`,
          aspectRatio:  '1',
          borderRadius: '50%',
          background:   dotColor,
          flexShrink:   0,
        };
        const textStyle: CSSProperties = {
          position:   'absolute',
          left:       px(textXpx - box.x, box.w),
          right:      '1%',
          fontSize:   fontVw,
          fontFamily: '"Book Antiqua","Palatino Linotype",Georgia,serif',
          color:      '#1A0800',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          overflow:   'hidden',
        };
        return (
          <div key={item.id} style={rowStyle}>
            <span style={dotStyle} />
            <span style={textStyle}>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function PosterCanvas({
  config,
  fontFamily = '"Book Antiqua","Palatino Linotype",Palatino,Georgia,serif',
}: {
  config: PosterConfig;
  fontFamily?: string;
}) {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  const title   = `${day} ${mealType} Buffet`;
  const titleFS = title.length > 22 ? 58 : title.length > 18 ? 66 : 74;

  const BOXES: Record<string, Box> = {
    title:    { x: 30,  y: 252,  w: 964, h: 175 },
    veg:      { x: 12,  y: 560,  w: 328, h: 730 },
    sides:    { x: 342, y: 565,  w: 334, h: 398 },
    desserts: { x: 342, y: 1100, w: 334, h: 193 },
    nonveg:   { x: 678, y: 560,  w: 336, h: 730 },
  };

  return (
    <div style={{
      position:    'relative',
      width:       '100%',
      aspectRatio: `${TW} / ${TH}`,
      overflow:    'hidden',
      fontFamily,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/poster-template.png"
        alt="Amulya poster"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }}
        draggable={false}
      />

      {/* TITLE */}
      <div style={{
        position:       'absolute',
        left:           px(BOXES.title.x, TW),
        top:            px(BOXES.title.y, TH),
        width:          px(BOXES.title.w, TW),
        height:         px(BOXES.title.h, TH),
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontSize:   vw(titleFS),
          fontWeight: 'bold',
          color:      '#7A0000',
          fontFamily,
          lineHeight: 1.05,
          textAlign:  'center',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </span>
      </div>

      <Column items={vegItems}       box={BOXES.veg}      dotColor="#1A6E1A" minFont={18} maxFont={52} />
      <Column items={accompaniments} box={BOXES.sides}    dotColor="#5C5C2E" minFont={16} maxFont={32} />
      {desserts.length > 0 && (
        <Column items={desserts}     box={BOXES.desserts} dotColor="#A05000" minFont={16} maxFont={36} />
      )}
      <Column items={nonVegItems}    box={BOXES.nonveg}   dotColor="#8B0000" minFont={18} maxFont={52} />
    </div>
  );
}
