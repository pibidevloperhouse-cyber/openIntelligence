'use client';

import React, { useRef, useEffect, useState } from 'react';

/**
 * Official PiBi Open Intelligence Builder Badge
 * Rendered using the user-designed template from public/docs/pibi.pdf
 * Coordinates & styling calibrated to 1609x977 template.
 */
export default function DigitalBadge({
  studentName = 'Student Innovator',
  institution = 'Engineering College',
  dept = '',
  year = '',
  projectTitle = '',
  registrationId = '',
  className = '',
}) {
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [renderError, setRenderError] = useState(false);

  const academicYearText = [year, dept].filter(Boolean).join(' • ') || '2026 Innovation Candidate';

  useEffect(() => {
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      if (isCancelled) return;
      try {
        if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (e) {
        // Fallback to default system fonts
      }

      canvas.width = 1609;
      canvas.height = 977;

      // Draw background template from pibi.pdf
      ctx.drawImage(img, 0, 0, 1609, 977);

      // Draw Student Name (Column 1)
      drawSmartText(ctx, studentName || 'Student Innovator', 245, 295, {
        maxFontSize: 26,
        minSingleFontSize: 21,
        multiFontSize: 20,
        minMultiFontSize: 16,
        color: '#0e3869',
      });

      // Draw College Name (Column 2) - supports clean 2-line wrapping for long college names
      drawSmartText(ctx, institution || 'Engineering College', 710, 295, {
        maxFontSize: 26,
        minSingleFontSize: 21,
        multiFontSize: 20,
        minMultiFontSize: 15,
        color: '#0e3869',
      });

      // Draw Academic Year / Dept (Column 3)
      drawSmartText(ctx, academicYearText, 1180, 320, {
        maxFontSize: 26,
        minSingleFontSize: 21,
        multiFontSize: 20,
        minMultiFontSize: 15,
        color: '#0e3869',
      });

      setImageLoaded(true);
    };

    img.onerror = () => {
      console.error('[DigitalBadge] Failed to load /images/pibi_badge_clean.png');
      setRenderError(true);
    };

    img.src = '/images/pibi_badge_clean.png?v=pibi1';

    return () => {
      isCancelled = true;
    };
  }, [studentName, institution, dept, year, academicYearText]);

  return (
    <div className={`relative mx-auto w-full max-w-4xl ${className}`}>
      {/* Outer Cyan/Teal Ambient Glow */}
      <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#1f6fb2]/40 via-[#2ec4b6]/40 to-[#06b6d4]/40 blur-xl opacity-80 -z-10" />

      {/* Main Container Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#070e1e] p-2 sm:p-3 border border-teal-500/30 shadow-2xl overflow-hidden">
        {/* Loading placeholder skeleton */}
        {!imageLoaded && !renderError && (
          <div className="aspect-[1609/977] w-full rounded-xl bg-slate-900 animate-pulse flex flex-col items-center justify-center text-slate-400 gap-2">
            <span className="w-8 h-8 border-3 border-[#2ec4b6] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
              Loading Official Builder Badge...
            </span>
          </div>
        )}

        {/* Fallback in case of image load error */}
        {renderError && (
          <div className="aspect-[1609/977] w-full rounded-xl bg-slate-900 p-8 flex flex-col items-center justify-center text-center text-white space-y-4">
            <p className="text-sm text-rose-400 font-bold">Could not load badge template image.</p>
            <p className="text-xs text-slate-400">Please refresh or check that /images/pibi_badge_clean.png exists.</p>
          </div>
        )}

        {/* The Badge Canvas */}
        <canvas
          ref={canvasRef}
          className={`w-full h-auto rounded-xl sm:rounded-2xl shadow-md block transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 pointer-events-none'
          }`}
          style={{ imageRendering: 'auto' }}
        />
      </div>
    </div>
  );
}

/**
 * Smart multi-line text renderer for canvas badges.
 * Automatically fits text on 1 line if possible, or wraps cleanly onto 2 lines
 * if the text is long (such as long college names, student names, or department titles),
 * preventing ugly truncations or overflows.
 */
function drawSmartText(
  ctx,
  text,
  x,
  maxWidth = 295,
  {
    maxFontSize = 26,
    minSingleFontSize = 21,
    multiFontSize = 20,
    minMultiFontSize = 15,
    color = '#0e3869',
    areaTop = 716,
    areaBottom = 776,
  } = {}
) {
  if (!text) return;
  const safeText = String(text).trim();
  if (!safeText) return;

  const fontStack = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  ctx.textBaseline = 'top';
  ctx.fillStyle = color;

  // 1. Try single line: scale down from maxFontSize to minSingleFontSize
  let singleSize = maxFontSize;
  ctx.font = `bold ${singleSize}px ${fontStack}`;
  let singleWidth = ctx.measureText(safeText).width;

  while (singleWidth > maxWidth && singleSize > minSingleFontSize) {
    singleSize -= 1;
    ctx.font = `bold ${singleSize}px ${fontStack}`;
    singleWidth = ctx.measureText(safeText).width;
  }

  // If it comfortably fits on 1 line, position at exact icon alignment line (y = 706)
  if (singleWidth <= maxWidth) {
    ctx.fillText(safeText, x, 706);
    return;
  }

  // 2. Needs multi-line wrapping (up to 2 lines)
  const words = safeText.split(/\s+/);
  let bestLines = null;
  let finalFontSize = multiFontSize;

  // Try fitting words into 2 lines, stepping down font size
  for (let fs = multiFontSize; fs >= minMultiFontSize; fs -= 1) {
    ctx.font = `bold ${fs}px ${fontStack}`;
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = word;
        }
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    // Check if it fit into at most 2 lines, and no line exceeds maxWidth
    if (lines.length <= 2 && lines.every(l => ctx.measureText(l).width <= maxWidth)) {
      bestLines = lines;
      finalFontSize = fs;
      break;
    }
  }

  // 3. Fallback: if words couldn't fit or it's a very long unbroken word
  if (!bestLines) {
    finalFontSize = minMultiFontSize;
    ctx.font = `bold ${finalFontSize}px ${fontStack}`;

    if (words.length > 1) {
      // Split evenly by word count into 2 lines
      const mid = Math.ceil(words.length / 2);
      let l1 = words.slice(0, mid).join(' ');
      let l2 = words.slice(mid).join(' ');

      while (l1.length > 3 && ctx.measureText(l1).width > maxWidth) {
        l1 = l1.slice(0, -1);
      }
      if (ctx.measureText(l2).width > maxWidth) {
        while (l2.length > 3 && ctx.measureText(l2 + '...').width > maxWidth) {
          l2 = l2.slice(0, -1);
        }
        l2 = l2 + '...';
      }
      bestLines = [l1, l2];
    } else {
      // Single unbroken word (e.g. test input like "qwertyuiopsdfgh...")
      let idx = 0;
      let l1 = '';
      while (idx < safeText.length && ctx.measureText(l1 + safeText[idx]).width <= maxWidth) {
        l1 += safeText[idx];
        idx++;
      }
      let l2 = safeText.slice(idx);
      if (ctx.measureText(l2).width > maxWidth) {
        while (l2.length > 3 && ctx.measureText(l2 + '...').width > maxWidth) {
          l2 = l2.slice(0, -1);
        }
        l2 = l2 + '...';
      }
      bestLines = [l1, l2].filter(Boolean);
    }
  }

  // 4. Render the 2 lines starting at y = 703 directly under the label
  ctx.font = `bold ${finalFontSize}px ${fontStack}`;
  const lineHeight = finalFontSize + 4;
  const startY = 703;

  bestLines.forEach((line, index) => {
    ctx.fillText(line, x, startY + index * lineHeight);
  });
}

// Backward-compatible alias
function drawFittedText(ctx, text, x, y, maxWidth, maxFontSize = 26, minFontSize = 17, color = '#0e3869') {
  drawSmartText(ctx, text, x, maxWidth, {
    maxFontSize,
    minSingleFontSize: minFontSize,
    color,
  });
}

/**
 * High-Resolution PNG Exporter
 * Renders the full 1609x977 badge with user data and triggers browser download.
 */
export async function generateBadgePng({
  studentName = 'Student Innovator',
  institution = 'Engineering College',
  dept = '',
  year = '',
  projectTitle = '',
  registrationId = 'PIBI-2026-BDR-CONFIRMED',
}) {
  if (typeof window === 'undefined') {
    throw new Error('Canvas export only supported in browser environment');
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1609;
  canvas.height = 977;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize 2D canvas context');

  // Load clean template image from pibi1.pdf
  const img = await loadImage('/images/pibi_badge_clean.png?v=pibi1');
  ctx.drawImage(img, 0, 0, 1609, 977);

  const academicYearText = [year, dept].filter(Boolean).join(' • ') || '2026 Innovation Candidate';

  // Draw details onto canvas slots with smart wrapping
  drawSmartText(ctx, studentName || 'Student Innovator', 245, 295, {
    maxFontSize: 26,
    minSingleFontSize: 21,
    multiFontSize: 20,
    minMultiFontSize: 16,
    color: '#0e3869',
  });
  drawSmartText(ctx, institution || 'Engineering College', 710, 295, {
    maxFontSize: 26,
    minSingleFontSize: 21,
    multiFontSize: 20,
    minMultiFontSize: 15,
    color: '#0e3869',
  });
  drawSmartText(ctx, academicYearText, 1180, 320, {
    maxFontSize: 26,
    minSingleFontSize: 21,
    multiFontSize: 20,
    minMultiFontSize: 15,
    color: '#0e3869',
  });

  // Generate PNG Data URL and initiate instant download
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const cleanName = sanitizeFilename(studentName || 'Student');
  const cleanReg = sanitizeFilename(registrationId || 'PIBI');
  const fileName = `pibi-builder-badge-${cleanName}-${cleanReg}.png`;

  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { success: true, fileName };
}

function sanitizeFilename(name) {
  return String(name)
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '');
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from: ${src}`));
    img.src = src;
  });
}
