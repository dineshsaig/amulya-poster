'use client';
import React, { useState } from 'react';
import { PosterConfig } from '@/types';
import PosterCanvas from '@/components/poster/PosterCanvas';
import Button from '@/components/ui/Button';
import { downloadPNG, downloadPDF, getPosterFilename } from '@/lib/posterExport';

interface StepPosterProps {
  config: PosterConfig;
  onBack: () => void;
}

const FONT_OPTIONS = [
  { id: 'book-antiqua', label: 'Book Antiqua',   value: '"Book Antiqua", "Palatino Linotype", Palatino, Georgia, serif' },
  { id: 'georgia',      label: 'Georgia',         value: 'Georgia, "Times New Roman", serif' },
  { id: 'garamond',     label: 'Garamond',        value: '"Garamond", "EB Garamond", Georgia, serif' },
  { id: 'times',        label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { id: 'palatino',     label: 'Palatino',        value: '"Palatino Linotype", Palatino, Georgia, serif' },
];

export default function StepPoster({ config, onBack }: StepPosterProps) {
  const [downloading, setDownloading] = useState<'png' | 'pdf' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].id);

  const filename = getPosterFilename(config.day, config.mealType);
  const currentFont = FONT_OPTIONS.find(f => f.id === selectedFont)?.value ?? FONT_OPTIONS[0].value;
  const totalItems = config.vegItems.length + config.nonVegItems.length + config.desserts.length;

  async function handleDownload(type: 'png' | 'pdf') {
    setShowSettings(false);
    setDownloading(type);
    try {
      if (type === 'png') await downloadPNG('amulya-poster', filename);
      else await downloadPDF('amulya-poster', filename);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="space-y-4">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-amber-100" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Your Poster is Ready!
          </h2>
          <p className="text-stone-400 text-sm mt-0.5">
            {config.day} {config.mealType} · {totalItems} items
          </p>
        </div>
        <button
          onClick={() => setShowSettings(s => !s)}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-all cursor-pointer ${
            showSettings
              ? 'bg-amber-700/20 border-amber-600/40 text-amber-300'
              : 'bg-stone-800/60 border-stone-700/40 text-stone-400 hover:text-stone-200'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Settings
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="bg-stone-900/60 rounded-xl p-4 border border-amber-700/20 space-y-3">
          <div className="text-[10px] text-amber-600 uppercase tracking-widest font-semibold">Font Style</div>
          <div className="space-y-1.5">
            {FONT_OPTIONS.map(font => (
              <button
                key={font.id}
                onClick={() => setSelectedFont(font.id)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all cursor-pointer ${
                  selectedFont === font.id
                    ? 'bg-amber-700/20 border-amber-600/40 text-amber-200'
                    : 'bg-stone-800/40 border-stone-700/30 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                  {selectedFont === font.id && <span className="text-amber-400 text-xs">✓</span>}
                </div>
                <div className="text-[10px] opacity-50 mt-0.5" style={{ fontFamily: font.value }}>
                  Tomato Dal · Gulab Jamun · Apollo Fish
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── SCALED PREVIEW (display only) ── */}
      <div className="flex justify-center overflow-hidden" style={{ height: 310 }}>
        <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center' }}>
          <PosterCanvas config={config} fontFamily={currentFont} />
        </div>
      </div>

      {/* ── HIDDEN FULL-SIZE EXPORT ELEMENT ── */}
      {/* This is what html2canvas actually captures — full 420px, no scaling */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: 420,
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <div id="amulya-poster">
          <PosterCanvas config={config} fontFamily={currentFont} />
        </div>
      </div>

      {/* Download buttons */}
      <div className="space-y-2.5">
        <Button
          variant="primary" size="lg"
          className="w-full text-base font-bold tracking-wide"
          loading={downloading === 'png'}
          onClick={() => handleDownload('png')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download PNG
        </Button>
        <Button
          variant="secondary" size="lg"
          className="w-full"
          loading={downloading === 'pdf'}
          onClick={() => handleDownload('pdf')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Download PDF
        </Button>
      </div>

      {/* Summary */}
      <div className="bg-stone-900/40 rounded-xl p-4 border border-stone-700/30 space-y-3">
        <div className="text-[10px] text-amber-600 uppercase tracking-widest font-semibold">Summary</div>
        {config.vegItems.length > 0 && (
          <div>
            <div className="text-[10px] text-emerald-500 uppercase tracking-wide mb-1">🌿 Veg ({config.vegItems.length})</div>
            <div className="text-xs text-stone-400">{config.vegItems.map(i => i.name).join(' · ')}</div>
          </div>
        )}
        {config.nonVegItems.length > 0 && (
          <div>
            <div className="text-[10px] text-red-400 uppercase tracking-wide mb-1">🍗 Non-Veg ({config.nonVegItems.length})</div>
            <div className="text-xs text-stone-400">{config.nonVegItems.map(i => i.name).join(' · ')}</div>
          </div>
        )}
        {config.desserts.length > 0 && (
          <div>
            <div className="text-[10px] text-pink-400 uppercase tracking-wide mb-1">🍮 Desserts ({config.desserts.length})</div>
            <div className="text-xs text-stone-400">{config.desserts.map(i => i.name).join(' · ')}</div>
          </div>
        )}
      </div>

      <button onClick={onBack} className="w-full text-xs text-stone-500 hover:text-stone-300 py-2 cursor-pointer">
        ← Edit menu items
      </button>
    </div>
  );
}
