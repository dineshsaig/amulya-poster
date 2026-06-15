'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
}

export default function PosterCanvas({ config }: PosterCanvasProps) {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  const dateStr = new Date().toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  /* ── Calculate dynamic font sizes based on item count ── */
  /* Reference image has ~310px height per column for items */
  const VEG_BOX_HEIGHT = 310;
  const NONVEG_BOX_HEIGHT = 310;
  const SIDES_BOX_HEIGHT = 180;
  const DESSERT_BOX_HEIGHT = 100;

  /* If we have N items, fit them in the available space */
  const calcFontSize = (itemCount: number, boxHeight: number, minSize = 8, maxSize = 11) => {
    if (itemCount === 0) return maxSize;
    /* Each item takes up ~18px at size 9.5 (including line-height) */
    const neededHeight = itemCount * 18;
    if (neededHeight <= boxHeight) return maxSize; /* plenty of space */
    /* Scale down proportionally */
    const scaleFactor = boxHeight / neededHeight;
    const size = Math.max(minSize, maxSize * scaleFactor);
    return Math.round(size * 10) / 10; /* round to 1 decimal */
  };

  const vegFontSize = calcFontSize(vegItems.length, VEG_BOX_HEIGHT);
  const nonvegFontSize = calcFontSize(nonVegItems.length, NONVEG_BOX_HEIGHT);
  const sidesFontSize = calcFontSize(accompaniments.length, SIDES_BOX_HEIGHT);
  const dessertFontSize = calcFontSize(desserts.length, DESSERT_BOX_HEIGHT, 7, 10);

  const lineHeightMultiplier = vegFontSize / 9.5; /* scale line-height proportionally */
  const itemLineHeight = 18 * lineHeightMultiplier;

  return (
    <div
      id="amulya-poster"
      style={{
        position: 'relative',
        width: 420,
        height: 'auto',
        fontFamily: 'Georgia, serif',
        overflow: 'hidden',
      }}
    >
      {/* ── REFERENCE IMAGE AS BACKGROUND ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/poster-template.png"
        alt="Amulya Buffet Poster Template"
        crossOrigin="anonymous"
        style={{
          width: '100%',
          display: 'block',
          background: '#F5EDD0',
        }}
      />

      {/* ── DYNAMIC TEXT OVERLAYS ── */}
      {/* All positioned absolutely over the template image */}

      {/* LEFT COLUMN — VEG ITEMS */}
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 295,
          width: 130,
          height: VEG_BOX_HEIGHT,
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {vegItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 4,
              marginBottom: Math.max(1, itemLineHeight - vegFontSize - 2),
              fontSize: vegFontSize,
              lineHeight: 1.3,
              color: '#1A0800',
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#2E7D32',
                flexShrink: 0,
                marginTop: vegFontSize * 0.35,
              }}
            />
            <span style={{ wordBreak: 'break-word' }}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* CENTRE COLUMN TOP — SIDES/ACCOMPANIMENTS */}
      <div
        style={{
          position: 'absolute',
          left: 171,
          top: 295,
          width: 78,
          height: SIDES_BOX_HEIGHT,
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {accompaniments.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 4,
              marginBottom: Math.max(1, itemLineHeight - sidesFontSize - 2),
              fontSize: sidesFontSize,
              lineHeight: 1.3,
              color: '#1A0800',
            }}
          >
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#8B6914',
                flexShrink: 0,
                marginTop: sidesFontSize * 0.35,
              }}
            />
            <span style={{ wordBreak: 'break-word' }}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* CENTRE COLUMN BOTTOM — DESSERTS */}
      {desserts.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 171,
            top: 525,
            width: 78,
            height: DESSERT_BOX_HEIGHT,
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          {desserts.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 4,
                marginBottom: Math.max(1, itemLineHeight - dessertFontSize - 2),
                fontSize: dessertFontSize,
                lineHeight: 1.3,
                color: '#1A0800',
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#DAA520',
                  flexShrink: 0,
                  marginTop: dessertFontSize * 0.35,
                }}
              />
              <span style={{ wordBreak: 'break-word' }}>{item.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* RIGHT COLUMN — NON-VEG ITEMS */}
      <div
        style={{
          position: 'absolute',
          left: 280,
          top: 295,
          width: 130,
          height: NONVEG_BOX_HEIGHT,
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {nonVegItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 4,
              marginBottom: Math.max(1, itemLineHeight - nonvegFontSize - 2),
              fontSize: nonvegFontSize,
              lineHeight: 1.3,
              color: '#1A0800',
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#B71C1C',
                flexShrink: 0,
                marginTop: nonvegFontSize * 0.35,
              }}
            />
            <span style={{ wordBreak: 'break-word' }}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Optional: Overlay the date if needed — currently handled by template */}
    </div>
  );
}
