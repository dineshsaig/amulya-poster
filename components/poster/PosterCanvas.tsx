'use client';
import React from 'react';
import { PosterConfig } from '@/types';

interface PosterCanvasProps {
  config: PosterConfig;
}

export default function PosterCanvas({ config }: PosterCanvasProps) {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  /* ── Calculate dynamic font sizes based on item count ── */
  const VEG_BOX_HEIGHT = 310;
  const NONVEG_BOX_HEIGHT = 310;
  const SIDES_BOX_HEIGHT = 180;
  const DESSERT_BOX_HEIGHT = 100;

  const calcFontSize = (itemCount: number, boxHeight: number, minSize = 7.5, maxSize = 10.5) => {
    if (itemCount === 0) return maxSize;
    const neededHeight = itemCount * 19;
    if (neededHeight <= boxHeight) return maxSize;
    const scaleFactor = boxHeight / neededHeight;
    const size = Math.max(minSize, maxSize * scaleFactor);
    return Math.round(size * 10) / 10;
  };

  const vegFontSize = calcFontSize(vegItems.length, VEG_BOX_HEIGHT);
  const nonvegFontSize = calcFontSize(nonVegItems.length, NONVEG_BOX_HEIGHT);
  const sidesFontSize = calcFontSize(accompaniments.length, SIDES_BOX_HEIGHT);
  const dessertFontSize = calcFontSize(desserts.length, DESSERT_BOX_HEIGHT, 7, 9.5);

  const itemLineHeight = 19;

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
      <div
        style={{
          position: 'absolute',
          left: 33,
          top: 305,
          width: 128,
          height: VEG_BOX_HEIGHT,
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {vegItems.map((item, idx) => (
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
      <div
        style={{
          position: 'absolute',
          left: 172,
          top: 305,
          width: 76,
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
            <span style={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* CENTRE COLUMN BOTTOM — DESSERTS */}
      {desserts.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 172,
            top: 535,
            width: 76,
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
      <div
        style={{
          position: 'absolute',
          left: 281,
          top: 305,
          width: 128,
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
