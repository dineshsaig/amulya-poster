'use client';
/**
 * PosterCanvas.tsx — v19 FIXED
 *
 * CSS preview that mirrors the EXACT same pixel boxes as posterExport.ts.
 * Positions as % of 1024×1819 so it scales correctly in the mobile preview.
 *
 * BOXES (1024×1819 template):
 *   TITLE:    x=30,  y=235, w=964, h=197
 *   VEG:      x=12,  y=555, w=328, h=740
 *   SIDES:    x=342, y=530, w=334, h=435
 *   DESSERTS: x=342, y=1015,w=334, h=278
 *   NONVEG:   x=678, y=555, w=336, h=740
 */

import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
  fontFamily?: string;
}

const W = 1024;
const H = 1819;
const p = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

function BulletList({
  items, dotColor, lineH, fontSize,
}: {
  items: { name: string; id: string }[];
  dotColor: string;
  lineH: number;      // px per line (relative to W/H scale)
  fontSize: number;   // px font size (relative to W/H scale)
}) {
  if (items.length === 0) return null;
  return (
    <>
      {items.map((item, i) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            top: `${((i * lineH) / H * 100).toFixed(3)}%`,
            left: 0, right: 0,
            height: `${(lineH / H * 100).toFixed(3)}%`,
            display: 'flex',
            alignItems: 'center',
            gap: `${(fontSize * 0.28 / W * 100).toFixed(3)}%`,
            overflow: 'hidden',
          }}
        >
          <span style={{
            display:      'inline-block',
            width:        `${(fontSize * 0.40 / W * 100).toFixed(3)}%`,
            aspectRatio:  '1',
            borderRadius: '50%',
            background:   dotColor,
            flexShrink:   0,
          }} />
          <span style={{
            fontSize:     `${(fontSize / W * 100).toFixed(3)}vw`,
            fontFamily:   '"Book Antiqua","Palatino Linotype",Georgia,serif',
            color:        '#1A0800',
            lineHeight:   1,
            whiteSpace:   'nowrap',
            overflow:     'hidden',
          }}>
            {item.name}
          </span>
        </div>
      ))}
    </>
  );
}

export default function PosterCanvas({
  config,
  fontFamily = '"Book Antiqua","Palatino Linotype",Palatino,Georgia,serif',
}: PosterCanvasProps) {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  const title = `${day} ${mealType} Buffet`;
  const titleFS = title.length > 22 ? 60 : title.length > 18 ? 68 : 76;

  // Calculate line heights and font sizes matching posterExport.ts logic
  const calcFS = (n: number, boxH: number, min: number, max: number) =>
    n === 0 ? max : Math.max(min, Math.min(max, Math.floor((boxH / n) * 0.52)));

  const vegLH   = vegItems.length   > 0 ? 740 / vegItems.length   : 740;
  const nvLH    = nonVegItems.length > 0 ? 740 / nonVegItems.length : 740;
  const sidesLH = accompaniments.length > 0 ? 435 / accompaniments.length : 435;
  const desLH   = desserts.length   > 0 ? 278 / desserts.length   : 278;

  const vegFS   = calcFS(vegItems.length,       740, 22, 54);
  const nvFS    = calcFS(nonVegItems.length,     740, 22, 54);
  const sidesFS = calcFS(accompaniments.length,  435, 18, 34);
  const desFS   = calcFS(desserts.length,        278, 18, 40);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: `${W} / ${H}`,
      overflow: 'hidden',
      fontFamily,
    }}>
      {/* Template background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/poster-template.png"
        alt="Amulya poster template"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }}
        draggable={false}
      />

      {/* TITLE  x=30,y=235,w=964,h=197 */}
      <div style={{
        position: 'absolute',
        left: p(30, W), top: p(235, H), width: p(964, W), height: p(197, H),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontSize:   `${(titleFS / W * 100).toFixed(3)}vw`,
          fontWeight: 'bold',
          color:      '#7A0000',
          fontFamily,
          lineHeight: 1.05,
          textAlign:  'center',
          wordBreak:  'break-word',
        }}>
          {title}
        </span>
      </div>

      {/* VEG  x=12,y=555,w=328,h=740 */}
      <div style={{
        position: 'absolute',
        left: p(12, W), top: p(555, H), width: p(328, W), height: p(740, H),
        overflow: 'hidden',
      }}>
        <BulletList items={vegItems} dotColor="#1A6E1A" lineH={vegLH} fontSize={vegFS} />
      </div>

      {/* SIDES  x=342,y=530,w=334,h=435 */}
      <div style={{
        position: 'absolute',
        left: p(342, W), top: p(530, H), width: p(334, W), height: p(435, H),
        overflow: 'hidden',
      }}>
        <BulletList items={accompaniments} dotColor="#5C5C2E" lineH={sidesLH} fontSize={sidesFS} />
      </div>

      {/* DESSERTS  x=342,y=1015,w=334,h=278 */}
      {desserts.length > 0 && (
        <div style={{
          position: 'absolute',
          left: p(342, W), top: p(1015, H), width: p(334, W), height: p(278, H),
          overflow: 'hidden',
        }}>
          <BulletList items={desserts} dotColor="#A05000" lineH={desLH} fontSize={desFS} />
        </div>
      )}

      {/* NONVEG  x=678,y=555,w=336,h=740 */}
      <div style={{
        position: 'absolute',
        left: p(678, W), top: p(555, H), width: p(336, W), height: p(740, H),
        overflow: 'hidden',
      }}>
        <BulletList items={nonVegItems} dotColor="#8B0000" lineH={nvLH} fontSize={nvFS} />
      </div>
    </div>
  );
}
