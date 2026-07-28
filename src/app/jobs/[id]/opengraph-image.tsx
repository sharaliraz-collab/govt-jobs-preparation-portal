import { ImageResponse } from 'next/og';
import { getJobById } from '@/lib/data/content';

export const runtime = 'nodejs';
export const alt = 'Government Job Posting';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const job = await getJobById(params.id);

  const title = job?.titleEn || 'Government Job Posting';
  const department = job?.department || 'GovtJobs.pk';
  const location = job?.location || 'Pakistan';
  const deadline = job?.deadline
    ? new Date(job.deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #047857 100%)',
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
              color: '#064e3b',
            }}
          >
            GJ
          </div>
          <span style={{ color: '#d1fae5', fontSize: '28px', fontWeight: 700 }}>GovtJobs.pk</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '8px 20px',
              color: '#fbbf24',
              fontSize: '22px',
              fontWeight: 700,
              alignSelf: 'flex-start',
            }}
          >
            GOVERNMENT JOB
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
          <div style={{ display: 'flex', gap: '32px', color: '#a7f3d0', fontSize: '26px' }}>
            <span>{department}</span>
            <span>📍 {location}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {deadline && (
            <span style={{ color: '#fca5a5', fontSize: '24px', fontWeight: 700 }}>
              Apply by {deadline}
            </span>
          )}
          <span style={{ color: '#6ee7b7', fontSize: '22px' }}>govtjobs.pk/jobs</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
