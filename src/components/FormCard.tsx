'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, FileDown, Download, Eye } from 'lucide-react';
import { IFormDoc } from '@/lib/types';
import PdfViewerModal from './PdfViewerModal';

interface FormCardProps {
  form: IFormDoc;
}

const categoryColors: Record<string, string> = {
  'Application': 'bg-blue-50 text-blue-700 border-blue-200',
  'Verification': 'bg-purple-50 text-purple-700 border-purple-200',
  'Scholarship': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Admission': 'bg-amber-50 text-amber-700 border-amber-200',
  'General': 'bg-slate-50 text-slate-600 border-slate-200',
};

const FormCard: React.FC<FormCardProps> = ({ form }) => {
  const { t, i18n } = useTranslation();
  const [downloadCount, setDownloadCount] = useState(form.downloadCount || 0);
  const [downloading, setDownloading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const isUr = i18n.language === 'ur';

  const title = isUr && form.titleUr ? form.titleUr : form.titleEn;
  const description = isUr && form.descriptionUr ? form.descriptionUr : form.descriptionEn;
  const catStyle = categoryColors[form.category] || categoryColors['General'];

  const handleDownload = () => {
    setDownloading(true);
    setDownloadCount(prev => prev + 1);
    if (form.file.startsWith('/uploads') || form.file.startsWith('http')) {
      window.open(form.file, '_blank');
    } else {
      window.open(`/api/forms/${form._id || form.id}/download`, '_blank');
    }
    setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <>
      <div className="card-premium border-l-4 border-l-govt-gold/60 p-5 flex flex-col justify-between hover:shadow-md transition" id={`form-card-${form._id || form.id}`}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${catStyle}`}>
              <FileText className="w-3 h-3" />
              {form.category}
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

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => setPreviewOpen(true)}
            className="text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition flex items-center gap-1.5"
            title="Preview PDF document"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleDownload}
            aria-label={`Download ${title}`}
            className={`bg-govt-emerald hover:bg-govt-emerald-dark text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md ${
              downloading ? 'animate-bounce' : ''
            }`}
            id={`download-btn-${form._id || form.id}`}
          >
            <FileDown className="w-4 h-4" />
            <span>{t('forms.downloadForm')}</span>
          </button>
        </div>
      </div>

      <PdfViewerModal
        fileUrl={form.file}
        title={title}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default FormCard;
