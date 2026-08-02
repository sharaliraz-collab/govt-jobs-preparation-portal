'use client';

import React, { useState } from 'react';
import { Eye, X, FileDown, ExternalLink, Maximize2, Minimize2, FileText, Printer } from 'lucide-react';

interface PdfViewerModalProps {
  fileUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PdfViewerModal({ fileUrl, title, isOpen, onClose }: PdfViewerModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen || !fileUrl) return null;

  const formattedUrl = fileUrl.startsWith('/uploads') || fileUrl.startsWith('http')
    ? fileUrl
    : `/uploads/${fileUrl}`;

  const handlePrint = () => {
    const win = window.open(formattedUrl, '_blank');
    if (win) {
      win.focus();
      setTimeout(() => {
        try {
          win.print();
        } catch (e) {
          // If cross-origin print fails, user uses browser print
        }
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in no-print">
      <div
        className={`bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isExpanded
            ? 'w-full h-full max-w-none max-h-none rounded-none'
            : 'w-full max-w-4xl h-[90vh] max-h-[850px]'
        }`}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate leading-snug">
                {title}
              </h3>
              <p className="text-[10px] text-emerald-300 font-mono truncate">PDF Document Viewer &amp; Printable Gazette</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black px-3 py-1.5 rounded-lg transition shadow-xs"
              title="Print document or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            <a
              href={formattedUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>

            <a
              href={formattedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:block p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title={isExpanded ? 'Minimize' : 'Full Screen'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-red-600/80 rounded-lg transition"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          <iframe
            src={`${formattedUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-full border-0"
            title={title}
          />
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
          <span>Having trouble viewing? Print or download the PDF file directly.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-[11px] font-bold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Out PDF</span>
            </button>
            <a
              href={formattedUrl}
              download
              className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
