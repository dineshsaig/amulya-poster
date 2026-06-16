'use client';
import React, { useState, useEffect, useRef } from 'react';
import { PosterConfig } from '@/types';
import PosterCanvas from '@/components/poster/PosterCanvas';
import Button from '@/components/ui/Button';
import { downloadPNG, downloadPDF, getPosterFilename } from '@/lib/posterExport';

interface StepPosterProps {
  config: PosterConfig;
  onBack: () => void;
  onReset?: () => void;
}

const FONT_OPTIONS = [
  { id: 'book-antiqua', label: 'Book Antiqua',   value: 'Book Antiqua' },
  { id: 'georgia',      label: 'Georgia',         value: 'Georgia' },
  { id: 'garamond',     label: 'Garamond',        value: 'Garamond' },
  { id: 'times',        label: 'Times New Roman', value: 'Times New Roman' },
  { id: 'palatino',     label: 'Palatino',        value: 'Palatino Linotype' },
];

export default function StepPoster({ config, onBack, onReset }: StepPosterProps) {
  const [downloading, setDownloading] = useState<'png' | 'pdf' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].id);
  const [isIOS, setIsIOS] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<'png' | 'pdf' | null>(null);
  const [downloadError, setDownloadError] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const filename    = getPosterFilename(config.day, config.mealType);
  const currentFont = FONT_OPTIONS.find(f => f.id === selectedFont)?.value ?? FONT_OPTIONS[0].value;
  const totalItems  = config.vegItems.length + config.nonVegItems.length + config.desserts.length;

  async function handleDownload(type: 'png' | 'pdf') {
    setShowSettings(false);
    setDownloading(type);
    setDownloadError(false);
    try {
      if (type === 'png') await downloadPNG('', filename, config, currentFont);
      else                await downloadPDF('', filename, config, currentFont);

      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      setDownloadSuccess(type);
      setDownloadError(false);
      successTimerRef.current = setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (err) {
      console.error('Download failed:', err);
      setDownloadError(true);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="space-y-4">

      {/* Header */}
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
            showSettings ? 'bg-amber-700/20 border-amber-600/40 text-amber-300'
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

      {/* Settings */}
      {showSettings && (
        <div className="bg-stone-900/60 rounded-xl p-4 border border-amber-700/20 space-y-3">
          <p className="text-xs font-semibold text-stone-400">Font Style</p>
          <div className="space-y-1.5">
            {FONT_OPTIONS.map(font => (
              <button key={font.id} onClick={() => setSelectedFont(font.id)}
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
                <div className="text-xs opacity-75 mt-1" style={{ fontFamily: font.value }}>
                  Tomato Dal · Gulab Jamun · Apollo Fish
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      <div
        className="overflow-y-auto overflow-x-hidden rounded-lg border border-stone-700/30"
        style={{ maxHeight: '56vh' }}
      >
        <PosterCanvas config={config} fontFamily={`"${currentFont}", Georgia, serif`} />
      </div>
      <p className="text-center text-xs text-stone-600 -mt-1">
        Scroll to preview · download matches exactly
      </p>

      {/* Download success notification */}
      {downloadSuccess && (
        <div role="status" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30">
          <div className="w-7 h-7 rounded-full bg-emerald-800/50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-emerald-300">
              {downloadSuccess === 'png' ? 'PNG ready' : 'PDF ready'}
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              {downloadSuccess === 'png'
                ? isIOS
                  ? 'New tab opened — long-press the image to save'
                  : 'Saved to Downloads — share to WhatsApp'
                : isIOS
                  ? 'New tab opened — PDF is ready to view'
                  : 'Saved to Downloads — ready to print'}
            </p>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="flex-shrink-0 text-xs text-stone-400 hover:text-stone-200 underline underline-offset-2 cursor-pointer"
            >
              Make another
            </button>
          )}
        </div>
      )}

      {/* Download error notification */}
      {downloadError && (
        <div role="alert" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-900/20 border border-rose-700/30">
          <div className="w-7 h-7 rounded-full bg-rose-800/50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-rose-300">Download failed</p>
            <p className="text-xs text-stone-400 mt-0.5">Check your connection and try again.</p>
          </div>
          <button
            onClick={() => setDownloadError(false)}
            className="flex-shrink-0 text-xs text-stone-500 hover:text-stone-300 cursor-pointer"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Download buttons */}
      <div className="space-y-2.5">
        <Button variant="primary" size="lg" className="w-full text-base font-bold tracking-wide"
          loading={downloading === 'png'} onClick={() => handleDownload('png')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download PNG for WhatsApp
        </Button>
        {isIOS && (
          <p className="text-xs text-stone-500 text-center -mt-1">
            On iPhone/iPad: image opens in a new tab — long-press it and tap <strong className="text-stone-400">Save to Photos</strong>
          </p>
        )}
        <Button variant="secondary" size="lg" className="w-full"
          loading={downloading === 'pdf'} onClick={() => handleDownload('pdf')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Download PDF
        </Button>
      </div>

      {/* Summary */}
      <div className="bg-stone-900/40 rounded-xl p-4 border border-stone-700/30 space-y-3">
        <p className="text-xs font-semibold text-stone-400">Summary</p>
        {config.vegItems.length > 0 && (
          <div>
            <p className="text-xs text-emerald-500 font-medium mb-1">🌿 Veg ({config.vegItems.length})</p>
            <p className="text-xs text-stone-400 leading-relaxed">{config.vegItems.map(i => i.name).join(' · ')}</p>
          </div>
        )}
        {config.nonVegItems.length > 0 && (
          <div>
            <p className="text-xs text-red-400 font-medium mb-1">🍗 Non-Veg ({config.nonVegItems.length})</p>
            <p className="text-xs text-stone-400 leading-relaxed">{config.nonVegItems.map(i => i.name).join(' · ')}</p>
          </div>
        )}
        {config.desserts.length > 0 && (
          <div>
            <p className="text-xs text-pink-400 font-medium mb-1">🍮 Desserts ({config.desserts.length})</p>
            <p className="text-xs text-stone-400">{config.desserts.map(i => i.name).join(' · ')}</p>
          </div>
        )}
      </div>

      <button onClick={onBack} className="w-full text-xs text-stone-500 hover:text-stone-300 py-2 cursor-pointer">
        ← Edit menu items
      </button>
    </div>
  );
}
