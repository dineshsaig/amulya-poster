'use client';
/**
 * PosterCanvas.tsx — v27  CREAM TEMPLATE
 *
 * Mirrors posterExport.ts v26 exactly.
 *
 * Template PNG has logo, borders, "VEG ITEMS / ACCOMPANIMENTS / NON-VEG ITEMS"
 * column headers, food photos, and address all baked in.
 *
 * This component overlays:
 *   1. Title  — "Tuesday Lunch Buffet" in the gap between logo and column headers
 *   2. Columns — veg (left) · sides (center top) · desserts (center bottom) · nonveg (right)
 *
 * BOX MAP (1024 × 1819):
 *   TITLE:    x=30,  y=310,  w=964, h=170
 *   VEG:      x=10,  y=634,  w=330, h=588
 *   SIDES:    x=346, y=634,  w=330, h=395
 *   DESSERTS: x=346, y=1046, w=330, h=170
 *   NONVEG:   x=686, y=634,  w=330, h=588
 */

import { useMemo, CSSProperties } from 'react';
import { PosterConfig } from '@/types';

const TW             = 1024;
const TH             = 1819;
const VEG_NONVEG_MAX = 30;
const VEG_NONVEG_MIN = 22;
const SIDES_DES_MAX  = 32;
const SIDES_DES_MIN  = 24;
const LINE_RATIO     = 38 / 28;
const ITEM_GAP       =  5;
const DOT_R          =  7;
const CHAR_W         = 0.57; // Patrick Hand average char width ratio

interface Box { x: number; y: number; w: number; h: number }

const BOXES: Record<string, Box> = {
  title:    { x:  30, y: 280,  w: 964, h: 170 },
  veg:      { x:  40, y: 590,  w: 300, h: 588 },
  sides:    { x: 360, y: 590,  w: 330, h: 415 },
  desserts: { x: 380, y: 1269, w: 330, h: 135 },
  nonveg:   { x: 700, y: 590,  w: 330, h: 588 },
};

const pct   = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;
const tocqw = (v: number)               => `${((v / TW) * 100).toFixed(3)}cqw`;

function computePreviewFont(
  items: { name: string }[],
  box: Box,
  maxFont: number,
  minFont: number,
): { fontSize: number; lineH: number } {
  if (items.length === 0) return { fontSize: maxFont, lineH: Math.ceil(maxFont * LINE_RATIO) };
  const textX = 6 + DOT_R + DOT_R + 9;
  const maxW  = box.w - textX - 6;
  for (let fs = maxFont; fs >= minFont; fs--) {
    const lh     = Math.ceil(fs * LINE_RATIO);
    const charPx = fs * CHAR_W;
    let totalH   = -ITEM_GAP;
    for (const item of items) {
      totalH += (item.name.length * charPx <= maxW ? 1 : 2) * lh + ITEM_GAP;
    }
    if (totalH <= box.h) return { fontSize: fs, lineH: lh };
  }
  return { fontSize: minFont, lineH: Math.ceil(minFont * LINE_RATIO) };
}

function Column({ items, box, dotColor, maxFont, minFont }: {
  items: { name: string; id: string }[];
  box: Box;
  dotColor: string;
  maxFont: number;
  minFont: number;
}) {
  if (items.length === 0) return null;
  const itemKey = items.map(i => i.name).join('|');
  const { fontSize, lineH } = useMemo(
    () => computePreviewFont(items, box, maxFont, minFont),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemKey, box.w, box.h, maxFont, minFont],
  );
  const fontCqw  = tocqw(fontSize);
  const lhRatio  = (lineH / fontSize).toFixed(3);
  const dotDiamC = tocqw(DOT_R * 2);
  const dotMTopC = tocqw((lineH - DOT_R * 2) / 2);
  const gapC     = tocqw(9);
  const itemGapC = tocqw(ITEM_GAP);
  const padLeftC = tocqw(6);

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
          <span style={{
            display:      'inline-block',
            width:        dotDiamC,
            height:       dotDiamC,
            borderRadius: '50%',
            background:   dotColor,
            flexShrink:   0,
            marginTop:    dotMTopC,
          }} />
          <span style={{
            fontSize:     fontCqw,
            fontFamily:   '"Patrick Hand","Comic Sans MS",cursive',
            color:        '#1A0800',
            lineHeight:   lhRatio,
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

export default function PosterCanvas({ config }: { config: PosterConfig }) {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;
  const title   = `${day} ${mealType} Buffet`;
  const titleFS = title.length > 22 ? 95 : title.length > 18 ? 115 : 145;

  return (
    <div style={{
      position:      'relative',
      width:         '100%',
      aspectRatio:   `${TW} / ${TH}`,
      overflow:      'hidden',
      containerType: 'inline-size',
    }}>
      {/* Template: logo · borders · column headers · food photos · address */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/poster-template.png"
        alt="Amulya poster"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }}
        draggable={false}
      />

      {/* Title — Cinzel Black, 145px max, auto-shrinks */}
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
          fontWeight: '900',
          fontFamily: '"Cinzel",Georgia,serif',
          color:      '#7A0000',
          lineHeight: 1.05,
          textAlign:  'center',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </span>
      </div>

      {/* Menu item columns */}
      <Column items={vegItems}       box={BOXES.veg}      dotColor="#1A6E1A" maxFont={VEG_NONVEG_MAX} minFont={VEG_NONVEG_MIN} />
      <Column items={accompaniments} box={BOXES.sides}    dotColor="#5C5C2E" maxFont={SIDES_DES_MAX}  minFont={SIDES_DES_MIN}  />
      {desserts.length > 0 && (
        <Column items={desserts}     box={BOXES.desserts} dotColor="#A05000" maxFont={SIDES_DES_MAX}  minFont={SIDES_DES_MIN}  />
      )}
      <Column items={nonVegItems}    box={BOXES.nonveg}   dotColor="#8B0000" maxFont={VEG_NONVEG_MAX} minFont={VEG_NONVEG_MIN} />
    </div>
  );
}
