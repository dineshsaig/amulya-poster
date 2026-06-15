'use client';
/**
 * PosterCanvas.tsx — v22 PIXEL-PERFECT
 *
 * Mirrors posterExport.ts v22 exactly.
 *
 * KEY CHANGES from v21:
 *  • BOXES x/y corrected from pixel scan of real template borders
 *  • TOP-ALIGNED: startY = box.y  (no more vertical centering)
 *  • lineH capped at fontSize×2.0  (natural spacing, no over-spreading)
 *  • NONVEG x=692 (was 678 — was landing ON the column border line)
 *
 * BOX MAP (1024 × 1819):
 *   TITLE:    x=30,  y=252, w=964, h=175
 *   VEG:      x=20,  y=539, w=318, h=754
 *   SIDES:    x=355, y=555, w=295, h=408
 *   DESSERTS: x=355, y=1100,w=295, h=193
 *   NONVEG:   x=692, y=539, w=295, h=754
 */

import React, { useMemo, CSSProperties } from 'react';
import { PosterConfig } from '@/types';

const TW   = 1024;
const TH   = 1819;
const DOT_R = 7;   // fixed dot radius, same as posterExport.ts

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;
const vw  = (v: number)                => `${((v / TW) * 100).toFixed(3)}vw`;

interface Box { x: number; y: number; w: number; h: number }

const BOXES: Record<string, Box> = {
  title:    { x: 30,  y: 252,  w: 964, h: 175 },
  veg:      { x: 20,  y: 539,  w: 318, h: 754 },
  sides:    { x: 355, y: 555,  w: 295, h: 408 },
  desserts: { x: 355, y: 1100, w: 295, h: 193 },
  nonveg:   { x: 692, y: 539,  w: 295, h: 754 },
};

/**
 * Same uniform-font algorithm as posterExport.ts.
 * Approximates Book Antiqua width as fontSize × 0.60 per char.
 */
function calcUniformFont(
  items: { name: string }[],
  box: Box,
  minFont: number,
  maxFont: number,
): number {
  if (items.length === 0) return maxFont;
  const dotCX   = box.x + 6 + DOT_R;
  const textX   = dotCX + DOT_R + 9;
  const maxW    = box.x + box.w - textX - 6;
  const longest = Math.max(...items.map(it => it.name.length));

  let fs = maxFont;
  while (fs > minFont && longest * fs * 0.60 > maxW) fs -= 1;
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
    [items.map(i => i.name).join('|'), box.w, box.h, minFont, maxFont],
  );

  if (items.length === 0) return null;

  const n       = items.length;
  const lineH   = Math.min(box.h / n, fontPx * 2.0);  // capped, no over-spreading
  const startY  = box.y;                               // TOP aligned — no centering

  // Geometry in template-px → convert to %/vw for CSS
  const dotCXpx  = box.x + 6 + DOT_R;
  const textXpx  = dotCXpx + DOT_R + 9;

  // Column wrapper at FULL box size (overflow:hidden clips excess)
  const wrapStyle: CSSProperties = {
    position: 'absolute',
    left:     pct(box.x, TW),
    top:      pct(startY, TH),
    width:    pct(box.w, TW),
    height:   pct(box.h, TH),
    overflow: 'hidden',
  };

  const lineHpct = (lineH / TH) * 100;
  const fontVw   = vw(fontPx);
  const dotVw    = vw(DOT_R);

  return (
    <div style={wrapStyle}>
      {items.map((item, i) => {
        const rowTop = (i * lineH / TH * 100).toFixed(3);

        const rowStyle: CSSProperties = {
          position:   'absolute',
          top:        `${rowTop}%`,
          left:       0,
          right:      0,
          height:     `${lineHpct.toFixed(3)}%`,
          display:    'flex',
          alignItems: 'center',
          overflow:   'hidden',
        };

        // Dot: position relative to box left
        const dotLeftPct = ((dotCXpx - DOT_R - box.x) / box.w * 100).toFixed(3);
        const dotStyle: CSSProperties = {
          position:     'absolute',
          left:         `${dotLeftPct}%`,
          width:        `calc(${dotVw} * 2)`,
          aspectRatio:  '1',
          borderRadius: '50%',
          background:   dotColor,
          flexShrink:   0,
        };

        // Text: starts at textXpx relative to box left
        const textLeftPct = ((textXpx - box.x) / box.w * 100).toFixed(3);
        const textStyle: CSSProperties = {
          position:   'absolute',
          left:       `${textLeftPct}%`,
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

  return (
    <div style={{
      position:    'relative',
      width:       '100%',
      aspectRatio: `${TW} / ${TH}`,
      overflow:    'hidden',
      fontFamily,
    }}>
      {/* Template background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/poster-template.png"
        alt="Amulya poster"
        style={{
          position:  'absolute',
          inset:     0,
          width:     '100%',
          height:    '100%',
          objectFit: 'fill',
        }}
        draggable={false}
      />

      {/* TITLE */}
      <div style={{
        position:       'absolute',
        left:           pct(BOXES.title.x, TW),
        top:            pct(BOXES.title.y, TH),
        width:          pct(BOXES.title.w, TW),
        height:         pct(BOXES.title.h, TH),
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

      {/* VEG  x=20, y=539, w=318, h=754 */}
      <Column items={vegItems}       box={BOXES.veg}      dotColor="#1A6E1A" minFont={18} maxFont={52} />

      {/* SIDES  x=355, y=555, w=295, h=408 */}
      <Column items={accompaniments} box={BOXES.sides}    dotColor="#5C5C2E" minFont={16} maxFont={32} />

      {/* DESSERTS  x=355, y=1100, w=295, h=193 */}
      {desserts.length > 0 && (
        <Column items={desserts}     box={BOXES.desserts} dotColor="#A05000" minFont={16} maxFont={36} />
      )}

      {/* NONVEG  x=692, y=539, w=295, h=754 */}
      <Column items={nonVegItems}    box={BOXES.nonveg}   dotColor="#8B0000" minFont={18} maxFont={52} />
    </div>
  );
}
