'use client';
/**
 * PosterCanvas.tsx — v25  AUTO-SHRINK PER COLUMN (preview)
 *
 * Mirrors the auto-shrink logic in posterExport.ts v24.
 * Each column computes the largest font size where all items fit within
 * its box height (using CHAR_W approximation since measureText isn't
 * available in React). CSS overflow-wrap handles any residual wrapping.
 *
 * BOX MAP (1024 × 1819):
 *   TITLE:    x=30,  y=252, w=964, h=175
 *   VEG:      x=20,  y=539, w=318, h=690
 *   SIDES:    x=355, y=555, w=295, h=408
 *   DESSERTS: x=355, y=1100,w=295, h=130
 *   NONVEG:   x=692, y=539, w=295, h=690
 */

import React, { useMemo, CSSProperties } from 'react';
import { PosterConfig } from '@/types';

// ── Constants mirror posterExport.ts exactly ────────────────────
const TW         = 1024;
const TH         = 1819;
const MAX_FONT   = 28;         // px — starting size per column
const MIN_FONT   = 18;         // px — smallest allowed
const LINE_RATIO = 38 / 28;   // proportional line height (1.357)
const ITEM_GAP   =  5;         // px between items
const DOT_R      =  7;         // px bullet radius

// Conservative Book Antiqua width estimate — slightly over-estimates
// to match canvas measureText behaviour (avoids under-wrapping).
const CHAR_W = 0.62;

interface Box { x: number; y: number; w: number; h: number }

const BOXES: Record<string, Box> = {
  title:    { x:  30, y: 252, w: 964, h: 175 },
  veg:      { x:  20, y: 539, w: 318, h: 690 },
  sides:    { x: 355, y: 555, w: 295, h: 408 },
  desserts: { x: 355, y:1100, w: 295, h: 130 },
  nonveg:   { x: 692, y: 539, w: 295, h: 690 },
};

const pct   = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;
const tocqw = (v: number)               => `${((v / TW) * 100).toFixed(3)}cqw`;

/**
 * Estimate the largest font size (MAX_FONT → MIN_FONT) where all items
 * fit within box.h using CHAR_W character width approximation.
 */
function computePreviewFont(
  items: { name: string }[],
  box: Box,
): { fontSize: number; lineH: number } {
  if (items.length === 0) {
    return { fontSize: MAX_FONT, lineH: Math.ceil(MAX_FONT * LINE_RATIO) };
  }

  // Text starts at 29px from the left edge of the box (dot area included)
  const textX = 6 + DOT_R + DOT_R + 9;  // = 29px from box left
  const maxW  = box.w - textX - 6;

  for (let fs = MAX_FONT; fs >= MIN_FONT; fs--) {
    const lh     = Math.ceil(fs * LINE_RATIO);
    const charPx = fs * CHAR_W;

    let totalH = -ITEM_GAP;
    for (const item of items) {
      // Estimate line count: 1 if fits single line, 2 if wraps
      const lineCount = item.name.length * charPx <= maxW ? 1 : 2;
      totalH += lineCount * lh + ITEM_GAP;
    }

    if (totalH <= box.h) return { fontSize: fs, lineH: lh };
  }

  return { fontSize: MIN_FONT, lineH: Math.ceil(MIN_FONT * LINE_RATIO) };
}

interface ColumnProps {
  items: { name: string; id: string }[];
  box: Box;
  dotColor: string;
}

function Column({ items, box, dotColor }: ColumnProps) {
  if (items.length === 0) return null;

  const { fontSize, lineH } = useMemo(
    () => computePreviewFont(items, box),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.map(i => i.name).join('|'), box.w, box.h],
  );

  const fontCqw    = tocqw(fontSize);
  const lineHRatio = (lineH / fontSize).toFixed(3);
  const dotDiamC   = tocqw(DOT_R * 2);
  // Center dot vertically on the first text line
  const dotMTopC   = tocqw((lineH - DOT_R * 2) / 2);
  const gapC       = tocqw(9);
  const itemGapC   = tocqw(ITEM_GAP);
  const padLeftC   = tocqw(6);

  return (
    <div style={{
      position:    'absolute',
      left:        pct(box.x, TW),
      top:         pct(box.y, TH),
      width:       pct(box.w, TW),
      height:      pct(box.h, TH),
      overflow:    'hidden',
      paddingLeft: padLeftC,
      boxSizing:   'border-box',
    }}>
      {items.map((item) => (
        <div key={item.id} style={{
          display:      'flex',
          alignItems:   'flex-start',
          gap:          gapC,
          marginBottom: itemGapC,
        }}>
          {/* Bullet */}
          <span style={{
            display:      'inline-block',
            width:        dotDiamC,
            height:       dotDiamC,
            borderRadius: '50%',
            background:   dotColor,
            flexShrink:   0,
            marginTop:    dotMTopC,
          }} />
          {/* Item name — CSS handles wrapping; font is pre-computed to fit */}
          <span style={{
            fontSize:     fontCqw,
            fontFamily:   '"Book Antiqua","Palatino Linotype",Georgia,serif',
            color:        '#1A0800',
            lineHeight:   lineHRatio,
            overflowWrap: 'break-word',
            wordBreak:    'break-word',
            flex:         '1',
            minWidth:     '0',
          } as CSSProperties}>
            {item.name}
          </span>
        </div>
      ))}
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
      containerType: 'inline-size',
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
