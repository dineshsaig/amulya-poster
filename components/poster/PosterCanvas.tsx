'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
}

export default function PosterCanvas({ config }: PosterCanvasProps) {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  /* ── Calculate dynamic font sizes based on item count ── */
  /* Actual available box heights in the template */
  const VEG_BOX_HEIGHT = 230;      /* was 310, actually 230 */
  const NONVEG_BOX_HEIGHT = 230;
  const SIDES_BOX_HEIGHT = 140;
  const DESSERT_BOX_HEIGHT = 70;

  const calcFontSize = (itemCount: number, boxHeight: number, minSize = 7, maxSize = 9.5) => {
    if (itemCount === 0) return maxSize;
    const neededHeight = itemCount * 18;
    if (neededHeight <= boxHeight) return maxSize;
    const scaleFactor = boxHeight / neededHeight;
    const size = Math.max(minSize, maxSize * scaleFactor);
    return Math.round(size * 10) / 10;
  };

  const vegFontSize = calcFontSize(vegItems.length, VEG_BOX_HEIGHT);
  const nonvegFontSize = calcFontSize(nonVegItems.length, NONVEG_BOX_HEIGHT);
  const sidesFontSize = calcFontSize(accompaniments.length, SIDES_BOX_HEIGHT);
  const dessertFontSize = calcFontSize(desserts.length, DESSERT_BOX_HEIGHT, 6.5, 8.5);

  const itemLineHeight = 18;

  return (
    <div
      id="amulya-poster"
      style={{
        position: 'relative',
        width: 420,
        height: 'auto',
        fontFamily: '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif',
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

      {/* LEFT COLUMN — VEG ITEMS */}
      {/* Veg box: starts at top ~220px, height ~230px */}
      <div
        style={{
          position: 'absolute',
          left: 35,
          top: 223,
          width: 125,
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
              marginBottom: 0,
              height: itemLineHeight,
              fontSize: vegFontSize,
              lineHeight: `${itemLineHeight}px`,
              color: '#1A0800',
              fontFamily: '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif',
              fontWeight: 400,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#2E7D32',
                flexShrink: 0,
                marginTop: 6,
              }}
            />
            <span style={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* CENTRE COLUMN TOP — SIDES/ACCOMPANIMENTS */}
      {/* Sides box: starts at top ~223px, height ~140px */}
      <div
        style={{
          position: 'absolute',
          left: 173,
          top: 223,
          width: 74,
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
              gap: 3,
              marginBottom: 0,
              height: itemLineHeight,
              fontSize: sidesFontSize,
              lineHeight: `${itemLineHeight}px`,
              color: '#1A0800',
              fontFamily: '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif',
              fontWeight: 400,
            }}
          >
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#8B6914',
                flexShrink: 0,
                marginTop: 7,
              }}
            />
            <span style={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: sidesFontSize }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* CENTRE COLUMN BOTTOM — DESSERTS */}
      {/* Desserts box: starts at top ~375px, height ~70px */}
      {desserts.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 173,
            top: 375,
            width: 74,
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
                gap: 3,
                marginBottom: 0,
                height: itemLineHeight,
                fontSize: dessertFontSize,
                lineHeight: `${itemLineHeight}px`,
                color: '#1A0800',
                fontFamily: '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif',
                fontWeight: 400,
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#DAA520',
                  flexShrink: 0,
                  marginTop: 7,
                }}
              />
              <span style={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* RIGHT COLUMN — NON-VEG ITEMS */}
      {/* Non-Veg box: starts at top ~223px, height ~230px */}
      <div
        style={{
          position: 'absolute',
          left: 260,
          top: 223,
          width: 125,
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
              marginBottom: 0,
              height: itemLineHeight,
              fontSize: nonvegFontSize,
              lineHeight: `${itemLineHeight}px`,
              color: '#1A0800',
              fontFamily: '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif',
              fontWeight: 400,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#B71C1C',
                flexShrink: 0,
                marginTop: 6,
              }}
            />
            <span style={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
