import { ImageResponse } from 'next/og';
import { getNewsById } from '@/lib/data/content';

export const runtime = 'nodejs';
export const alt = 'News & Notification';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const article = await getNewsById(params.id);

  const title = article?.titleEn || 'News & Notification';
  const category = article?.category || 'General';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #1d4ed8 100%)',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 900,
              color: '#1e3a5f',
            }}
          >
            GJ
          </div>
          <span style={{ color: '#bfdbfe', fontSize: '28px', fontWeight: 700 }}>GovtJobs.pk</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              background: 'rgba(251,191,36,0.2)',
              borderRadius: '8px',
              padding: '8px 20px',
              color: '#fbbf24',
              fontSize: '22px',
              fontWeight: 700,
              alignSelf: 'flex-start',
            }}
          >
            {category.toUpperCase()}
          </div>
          <div
            style={{
              color: 'white',
              fontSize: title.length > 60 ? '42px' : '52px',
              fontWeight: 900,
              lineHeight: 1.15,
              maxWidth: '1000px',
            }}
          >
            {title.length > 100 ? `${title.slice(0, 97)}...` : title}
          </div>
        </div>

        <span style={{ color: '#93c5fd', fontSize: '22px' }}>govtjobs.pk/news</span>
      </div>
    ),
    { ...size }
  );
}
