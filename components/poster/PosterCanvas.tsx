'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
  fontFamily?: string;
}

/* Wrap every 2 words onto a new line */
function formatItemName(name: string): string[] {
  const words = name.split(' ');
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += 2) {
    lines.push(words.slice(i, i + 2).join(' '));
  }
  return lines;
}

function calcTotalLines(items: { name: string }[]): number {
  return items.reduce((sum, item) => {
    return sum + Math.ceil(item.name.split(' ').length / 2);
  }, 0);
}

export default function PosterCanvas({
  config,
  fontFamily = '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif',
}: PosterCanvasProps) {
  const { vegItems, nonVegItems, desserts, accompaniments } = config;

  /*
   * Template is 1024×1536px (full original quality)
   * Box positions measured from full-size image:
   *   VEG:     left=48,  top=394, w=336, h=804
   *   SIDES:   left=399, top=394, w=224, h=633
   *   DESSERTS:left=399, top=1114,w=224, h=117
   *   NONVEG:  left=643, top=394, w=336, h=804
   *
   * The poster is rendered at 1024px wide.
   * For PREVIEW we scale down with CSS — but for EXPORT we capture at natural size.
   */

  const VEG_H     = 804;
  const NONVEG_H  = 804;
  const SIDES_H   = 633;
  const DESSERT_H = 117;

  const calcSizes = (
    totalLines: number,
    boxHeight: number,
    minFont = 16,
    maxFont = 24,
  ) => {
    const lineH = maxFont * 1.5;
    const maxLines = Math.floor(boxHeight / lineH);
    if (totalLines <= maxLines) return { fontSize: maxFont, lineH };
    const newLineH = boxHeight / totalLines;
    const fontSize = Math.max(minFont, newLineH / 1.5);
    return { fontSize, lineH: newLineH };
  };

  const vegSizes     = calcSizes(calcTotalLines(vegItems),     VEG_H);
  const nonvegSizes  = calcSizes(calcTotalLines(nonVegItems),  NONVEG_H);
  const sidesSizes   = calcSizes(calcTotalLines(accompaniments), SIDES_H, 14, 20);
  const dessertSizes = calcSizes(calcTotalLines(desserts),     DESSERT_H, 13, 18);

  const renderItems = (
    items: { id: string; name: string }[],
    dotColor: string,
    sizes: { fontSize: number; lineH: number },
    boxWidth: number,
  ) =>
    items.map((item) => {
      const lines = formatItemName(item.name);
      return (
        <div key={item.id}>
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
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: dotColor,
                    flexShrink: 0,
                    display: 'inline-block',
                    marginRight: 10,
                  }}
                />
              ) : (
                <span style={{ width: 22, flexShrink: 0, display: 'inline-block' }} />
              )}
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: boxWidth - 26,
                }}
              >
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
      style={{
        position: 'relative',
        width: 1024,
        fontFamily,
        overflow: 'hidden',
      }}
    >
      {/* Full-size template background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/poster-template.png"
        alt="Amulya Buffet Poster"
        crossOrigin="anonymous"
        style={{ width: '100%', display: 'block' }}
      />

      {/* VEG ITEMS */}
      <div style={{
        position: 'absolute', left: 50, top: 396,
        width: 332, height: VEG_H,
        overflow: 'hidden', zIndex: 10,
      }}>
        {renderItems(vegItems, '#2E7D32', vegSizes, 332)}
      </div>

      {/* SIDES */}
      <div style={{
        position: 'absolute', left: 401, top: 396,
        width: 220, height: SIDES_H,
        overflow: 'hidden', zIndex: 10,
      }}>
        {renderItems(accompaniments, '#8B6914', sidesSizes, 220)}
      </div>

      {/* DESSERTS */}
      {desserts.length > 0 && (
        <div style={{
          position: 'absolute', left: 401, top: 1116,
          width: 220, height: DESSERT_H,
          overflow: 'hidden', zIndex: 10,
        }}>
          {renderItems(desserts, '#DAA520', dessertSizes, 220)}
        </div>
      )}

      {/* NON-VEG ITEMS */}
      <div style={{
        position: 'absolute', left: 645, top: 396,
        width: 332, height: NONVEG_H,
        overflow: 'hidden', zIndex: 10,
      }}>
        {renderItems(nonVegItems, '#B71C1C', nonvegSizes, 332)}
      </div>
    </div>
  );
}
