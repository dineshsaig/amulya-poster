'use client';
/**
 * PosterCanvas.tsx — v23  FIXED-FONT + SMART WRAP
 *
 * All columns use FIXED_FONT = 28px.
 * Long names wrap at word boundaries (same logic as posterExport.ts).
 * Layout is top-aligned with natural item spacing.
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

// ── Constants mirror posterExport.ts exactly ────────────────────
const TW         = 1024;
const TH         = 1819;
const FIXED_FONT = 28;    // px in template space
const LINE_H     = 38;    // px per visual line
const ITEM_GAP   =  5;    // px between items
const DOT_R      =  7;    // px bullet radius

// Book Antiqua glyph width ≈ 0.60× font-size per character
// (used only for preview width estimation; canvas uses measureText)
const CHAR_W = 0.60;

interface Box { x: number; y: number; w: number; h: number }

const BOXES: Record<string, Box> = {
  title:    { x:  30, y: 252, w: 964, h: 175 },
  veg:      { x:  20, y: 539, w: 318, h: 690 },   // h trimmed to match column border bottom
  sides:    { x: 355, y: 555, w: 295, h: 408 },
  desserts: { x: 355, y:1000, w: 295, h: 210 },   // moved up to center-column space below sides
  nonveg:   { x: 692, y: 539, w: 295, h: 690 },   // h trimmed to match column border bottom
};

const pct   = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;
// cqw (container query width) scales fonts relative to the PosterCanvas container
// width, not the viewport — correct in scaled containers and all screen sizes.
const tocqw = (v: number)               => `${((v / TW) * 100).toFixed(3)}cqw`;

/** Approx wrap matching smartWrap() in posterExport.ts */
function previewWrap(name: string, maxW: number): string[] {
  const charPx = FIXED_FONT * CHAR_W;
  if (name.length * charPx <= maxW) return [name];

  const words = name.split(' ');
  let splitIdx = words.length - 1;
  for (let i = words.length - 1; i >= 1; i--) {
    if (words.slice(0, i).join(' ').length * charPx <= maxW) {
      splitIdx = i;
      break;
    }
  }
  const l1 = words.slice(0, splitIdx).join(' ') || words[0];
  const l2 = words.slice(splitIdx).join(' ');
  return [l1, l2];
}

interface ColumnProps {
  items: { name: string; id: string }[];
  box: Box;
  dotColor: string;
}

function Column({ items, box, dotColor }: ColumnProps) {
  const dotCXpx = box.x + 6 + DOT_R;
  const textXpx = dotCXpx + DOT_R + 9;
  const maxW    = box.x + box.w - textXpx - 6;

  // Pre-compute wrapped lines for each item
  const wrapped = useMemo(
    () => items.map(it => previewWrap(it.name, maxW)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.map(i => i.name).join('|'), maxW],
  );

  if (items.length === 0) return null;

  // Build visual rows (absolute positions in template-px from box.y)
  type Row = { text: string; yOffset: number; hasDot: boolean };
  const rows: Row[] = [];
  let curY = 0;  // relative to box.y

  items.forEach((item, ii) => {
    const lines = wrapped[ii];
    lines.forEach((line, li) => {
      const yOffset = curY + li * LINE_H;   // TOP of line (not center)
      rows.push({ text: line, yOffset, hasDot: li === 0 });
    });
    curY += lines.length * LINE_H + ITEM_GAP;
  });

  const fontCqw     = tocqw(FIXED_FONT);
  const dotCqw      = tocqw(DOT_R);
  const dotLeftPct  = ((dotCXpx - DOT_R - box.x) / box.w * 100).toFixed(3);
  const textLeftPct = ((textXpx - box.x) / box.w * 100).toFixed(3);
  // lineHpct and topPct must be relative to box.h (the wrapper height),
  // not TH (the template height). top: N% on an abs-positioned child is N%
  // of the containing block's height — which is the column wrapper, not the template.
  const lineHpct    = (LINE_H / box.h * 100).toFixed(3);

  const wrapStyle: CSSProperties = {
    position: 'absolute',
    left:     pct(box.x, TW),
    top:      pct(box.y, TH),
    width:    pct(box.w, TW),
    height:   pct(box.h, TH),
    overflow: 'hidden',
  };

  return (
    <div style={wrapStyle}>
      {rows.map((row, ri) => {
        // topPct: relative to column wrapper height (box.h), not template height (TH).
        // top: N% on an abs-positioned child resolves against the containing block height.
        const topPct = (row.yOffset / box.h * 100).toFixed(3);

        const rowStyle: CSSProperties = {
          position: 'absolute',
          top:      `${topPct}%`,
          left:     0,
          right:    0,
          height:   `${lineHpct}%`,
          overflow: 'hidden',
        };

        const dotStyle: CSSProperties = {
          position:     'absolute',
          left:         `${dotLeftPct}%`,
          top:          '50%',
          transform:    'translateY(-50%)',
          width:        `calc(${dotCqw} * 2)`,
          aspectRatio:  '1',
          borderRadius: '50%',
          background:   dotColor,
        };

        const textStyle: CSSProperties = {
          position:   'absolute',
          left:       `${textLeftPct}%`,
          right:      '1%',
          top:        '50%',
          transform:  'translateY(-50%)',
          fontSize:   fontCqw,
          fontFamily: '"Book Antiqua","Palatino Linotype",Georgia,serif',
          color:      '#1A0800',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          overflow:   'hidden',
        };

        return (
          <div key={ri} style={rowStyle}>
            {row.hasDot && <span style={dotStyle} />}
            <span style={textStyle}>{row.text}</span>
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
      position:      'relative',
      width:         '100%',
      aspectRatio:   `${TW} / ${TH}`,
      overflow:      'hidden',
      fontFamily,
      containerType: 'inline-size',  // makes cqw resolve to this element's width
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
        left:           pct(BOXES.title.x, TW),
        top:            pct(BOXES.title.y, TH),
        width:          pct(BOXES.title.w, TW),
        height:         pct(BOXES.title.h, TH),
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontSize:   tocqw(titleFS),
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

      <Column items={vegItems}       box={BOXES.veg}      dotColor="#1A6E1A" />
      <Column items={accompaniments} box={BOXES.sides}    dotColor="#5C5C2E" />
      {desserts.length > 0 && (
        <Column items={desserts}     box={BOXES.desserts} dotColor="#A05000" />
      )}
      <Column items={nonVegItems}    box={BOXES.nonveg}   dotColor="#8B0000" />
    </div>
  );
}
