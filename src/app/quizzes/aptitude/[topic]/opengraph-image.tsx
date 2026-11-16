import { ImageResponse } from 'next/og';
import { APTITUDE_GROUPS, APTITUDE_PER_PAGE, getAptitudeTopic } from '@/data/aptitudeTopics';

export const runtime = 'nodejs';
export const alt = 'Aptitude Test MCQs with Step-by-Step Solutions';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { topic: string } }) {
  const topic = getAptitudeTopic(params.topic);
  const title = topic ? `${topic.title} — Aptitude MCQs` : 'Quantitative Aptitude Test MCQs';
  const count = topic ? `${topic.count} Solved Questions` : '3,702 Solved Questions';
  const groupLabel =
    APTITUDE_GROUPS.find((g) => g.id === topic?.group)?.label || 'Quantitative Reasoning';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ecfdf5 55%, #fef3c7 100%)',
          padding: '56px 64px',
          fontFamily: 'system-ui, sans-serif',
          border: '12px solid #10b981',
        }}
      >
        {/* Top Brand Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '16px',
                background: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: 900,
                color: '#ffffff',
              }}
            >
              GJ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#0f172a', fontSize: '28px', fontWeight: 900 }}>
                GovtJobs.pk
              </span>
              <span style={{ color: '#059669', fontSize: '16px', fontWeight: 700 }}>
                Official Career &amp; Advanced MCQs Test Prep Portal
              </span>
            </div>
          </div>

          <div
            style={{
              background: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '999px',
              padding: '10px 24px',
              color: '#92400e',
              fontSize: '20px',
              fontWeight: 800,
            }}
          >
            {groupLabel}
          </div>
        </div>

        {/* Center Title & Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              color: '#0f172a',
              fontSize: title.length > 36 ? '50px' : '60px',
              fontWeight: 900,
              lineHeight: 1.12,
              maxWidth: '1040px',
            }}
          >
            {title}
          </div>

          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #a7f3d0',
                borderRadius: '14px',
                padding: '12px 22px',
                color: '#065f46',
                fontSize: '22px',
                fontWeight: 800,
              }}
            >
              ✅ {count}
            </div>
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #cbd5e1',
                borderRadius: '14px',
                padding: '12px 22px',
                color: '#1e293b',
                fontSize: '22px',
                fontWeight: 800,
              }}
            >
              📄 {APTITUDE_PER_PAGE} Questions / Page
            </div>
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #fde68a',
                borderRadius: '14px',
                padding: '12px 22px',
                color: '#92400e',
                fontSize: '22px',
                fontWeight: 800,
              }}
            >
              💡 Step-by-Step Solutions on Click
            </div>
          </div>
        </div>

        {/* Bottom Exam Tags */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid #cbd5e1',
            paddingTop: '20px',
          }}
        >
          <span style={{ color: '#475569', fontSize: '22px', fontWeight: 700 }}>
            FPSC · PPSC · SPSC · KPPSC · NTS · STS SIBA · CSS / PMS
          </span>
          <span style={{ color: '#059669', fontSize: '22px', fontWeight: 900 }}>
            Free Online Practice →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
