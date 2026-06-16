'use client';
/**
 * PosterCanvas.tsx — v24  CSS-NATIVE WRAP
 *
 * Dropped the CHAR_W character-width estimate and manual line-splitting.
 * CSS `overflow-wrap: break-word` handles wrapping accurately at any scale.
 * Each column is a flex-column container; text wraps naturally within its
 * available width, matching what the canvas export produces via measureText().
 *
 * BOX MAP (1024 × 1819):
 *   TITLE:    x=30,  y=252, w=964, h=175
 *   VEG:      x=20,  y=539, w=318, h=690
 *   SIDES:    x=355, y=555, w=295, h=408
 *   DESSERTS: x=355, y=1100,w=295, h=130
 *   NONVEG:   x=692, y=539, w=295, h=690
 */

import React, { CSSProperties } from 'react';
import { PosterConfig } from '@/types';

// ── Constants mirror posterExport.ts exactly ────────────────────
const TW         = 1024;
const TH         = 1819;
const FIXED_FONT = 28;    // px in template space
const LINE_H     = 38;    // px per visual line
const ITEM_GAP   =  5;    // px between items
const DOT_R      =  7;    // px bullet radius

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

interface ColumnProps {
  items: { name: string; id: string }[];
  box: Box;
  dotColor: string;
}

function Column({ items, box, dotColor }: ColumnProps) {
  if (items.length === 0) return null;

  // All sizing in cqw so the column scales with the poster container at any preview size.
  const fontCqw  = tocqw(FIXED_FONT);
  const lineH    = (LINE_H / FIXED_FONT).toFixed(3);   // unitless ratio — consistent across scales
  const dotDiamC = tocqw(DOT_R * 2);
  // Center the dot vertically on the first text line
  const dotMTopC = tocqw((LINE_H - DOT_R * 2) / 2);
  const gapC     = tocqw(9);                           // dot → text gap
  const itemGapC = tocqw(ITEM_GAP);                    // inter-item spacing
  const padLeftC = tocqw(6);                           // column left pad

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
          {/* Bullet dot — fixed size, centered on first line */}
          <span style={{
            display:      'inline-block',
            width:        dotDiamC,
            height:       dotDiamC,
            borderRadius: '50%',
            background:   dotColor,
            flexShrink:   0,
            marginTop:    dotMTopC,
          }} />
          {/* Item name — wraps naturally within available column width */}
          <span style={{
            fontSize:     fontCqw,
            fontFamily:   '"Book Antiqua","Palatino Linotype",Georgia,serif',
            color:        '#1A0800',
            lineHeight:   lineH,
            overflowWrap: 'break-word',
            wordBreak:    'break-word',
            flex:         '1',
            minWidth:     '0',
          }}>
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
