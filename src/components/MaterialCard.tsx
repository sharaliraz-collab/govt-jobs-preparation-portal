'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileDown, BookOpen, Download } from 'lucide-react';
import { IMaterial } from '@/lib/types';

interface MaterialCardProps {
  material: IMaterial;
}

const subjectColors: Record<string, string> = {
  'General Knowledge': 'bg-blue-50 text-blue-700 border-blue-200',
  'Pakistan Studies': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Islamic Studies': 'bg-teal-50 text-teal-700 border-teal-200',
  'English': 'bg-purple-50 text-purple-700 border-purple-200',
  'Computer Science': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Mathematics': 'bg-amber-50 text-amber-700 border-amber-200',
  'Everyday Science': 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const subjectBorder: Record<string, string> = {
  'General Knowledge': 'border-l-blue-500',
  'Pakistan Studies': 'border-l-emerald-500',
  'Islamic Studies': 'border-l-teal-500',
  'English': 'border-l-purple-500',
  'Computer Science': 'border-l-indigo-500',
  'Mathematics': 'border-l-amber-500',
  'Everyday Science': 'border-l-cyan-500',
};

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const { t, i18n } = useTranslation();
  const [downloadCount, setDownloadCount] = useState(material.downloadCount || 0);
  const [downloading, setDownloading] = useState(false);
  const isUr = i18n.language === 'ur';

  const title = isUr && material.titleUr ? material.titleUr : material.titleEn;
  const description = isUr && material.descriptionUr ? material.descriptionUr : material.descriptionEn;
  const subStyle = subjectColors[material.subject] || 'bg-slate-50 text-slate-600 border-slate-200';
  const borderClass = subjectBorder[material.subject] || 'border-l-slate-400';

  const handleDownload = () => {
    setDownloading(true);
    setDownloadCount(prev => prev + 1);
    if (material.file.startsWith('/uploads')) {
      window.open(material.file, '_blank');
    } else {
      window.open(`/api/materials/${material._id}/download`, '_blank');
    }
    setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <div className={`card-premium border-l-4 ${borderClass} p-5 flex flex-col justify-between`} id={`material-card-${material._id}`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${subStyle}`}>
            <BookOpen className="w-3 h-3" />
            {material.subject}
          </span>
          <span className="text-[10px] text-govt-muted flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full font-medium">
            <Download className="w-3 h-3" />
            {downloadCount}
          </span>
        </div>

        <h3 className={`text-sm font-bold text-govt-charcoal line-clamp-2 ${isUr ? 'font-urdu' : ''}`}>
          {title}
        </h3>

        {description && (
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">PDF Document</span>
        <button
          onClick={handleDownload}
          aria-label={`Download ${title}`}
          className={`bg-govt-emerald hover:bg-govt-emerald-dark text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md ${
            downloading ? 'animate-bounce' : ''
          }`}
          id={`download-btn-${material._id}`}
        >
          <FileDown className="w-4 h-4" />
          <span>{t('materials.downloadPdf')}</span>
        </button>
      </div>
    </div>
  );
};

export default MaterialCard;
