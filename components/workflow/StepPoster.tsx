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

export default function StepPoster({ config, onBack }: StepPosterProps) {
  const [downloading, setDownloading] = useState<'png' | 'pdf' | null>(null);

  const filename = getPosterFilename(config.day, config.mealType);

  async function handleDownload(type: 'png' | 'pdf') {
    setDownloading(type);
    try {
      if (type === 'png') {
        await downloadPNG('amulya-poster', filename);
      } else {
        await downloadPDF('amulya-poster', filename);
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  }

  const totalItems =
    config.vegItems.length + config.nonVegItems.length + config.desserts.length;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-amber-100" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Your Poster is Ready!
        </h2>
        <p className="text-stone-400 text-sm mt-1">
          {config.day} {config.mealType} · {totalItems} menu items
        </p>
      </div>

      {/* Poster preview */}
      <div className="flex justify-center">
        <div className="shadow-2xl shadow-black/60 ring-1 ring-amber-900/30 overflow-hidden"
          style={{ transform: 'scale(0.68)', transformOrigin: 'top center', marginBottom: '-190px' }}>
          <PosterCanvas config={config} />
        </div>
      </div>

      {/* Download actions */}
      <div className="space-y-2.5 pt-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full text-base font-bold tracking-wide"
          loading={downloading === 'png'}
          onClick={() => handleDownload('png')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PNG
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          loading={downloading === 'pdf'}
          onClick={() => handleDownload('pdf')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </Button>
      </div>

      {/* Summary */}
      <div className="bg-stone-900/40 rounded-xl p-4 border border-stone-700/30 space-y-2">
        <div className="text-[10px] text-amber-600 uppercase tracking-widest font-semibold mb-3">Poster Summary</div>

        {config.vegItems.length > 0 && (
          <div>
            <div className="text-[10px] text-emerald-500 uppercase tracking-wide mb-1">
              🌿 Veg ({config.vegItems.length})
            </div>
            <div className="text-xs text-stone-400">
              {config.vegItems.map((i) => i.name).join(', ')}
            </div>
          </div>
        )}

        {config.nonVegItems.length > 0 && (
          <div>
            <div className="text-[10px] text-red-400 uppercase tracking-wide mb-1">
              🍗 Non-Veg ({config.nonVegItems.length})
            </div>
            <div className="text-xs text-stone-400">
              {config.nonVegItems.map((i) => i.name).join(', ')}
            </div>
          </div>
        )}

        {config.desserts.length > 0 && (
          <div>
            <div className="text-[10px] text-pink-400 uppercase tracking-wide mb-1">
              🍮 Desserts ({config.desserts.length})
            </div>
            <div className="text-xs text-stone-400">
              {config.desserts.map((i) => i.name).join(', ')}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onBack}
        className="w-full text-xs text-stone-500 hover:text-stone-300 transition-colors py-2 cursor-pointer"
      >
        ← Edit menu items
      </button>
    </div>
  );
}
