import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '☀️ خوشخبري! سنڌ سولر توانائي پروگرام — مفت سولر سسٽم | GovtJobs.pk',
  description:
    '🌟 خوشخبري! سنڌ حڪومت جي طرفان مفت سولر سسٽم جي ورهاست. ھاڻي ئي پنھنجو ڊيٽا ڀريو ۽ پنھنجي گھر لاءِ مفت سولر پينل حاصل ڪريو. ✅ بغير ڪنھن فيس جي. درخواست جو وقت محدود آھي — دير نه ڪريو! 🙏',
  keywords: [
    'Sindh Solar Energy Program',
    'سنڌ سولر توانائي پروگرام',
    'مفت سولر سسٽم',
    'Free Solar Panels Sindh',
    'سنڌ حڪومت',
    'Government of Sindh Solar',
    'HESCO SEPCO Solar',
    'Solar Panel Application Form',
    'سولر پينل فارم',
    'Sindh Government Free Solar',
  ],
  openGraph: {
    type: 'website',
    url: 'https://govt-jobs-preparation-portal.vercel.app/forms/sindh-solar',
    siteName: 'GovtJobs.pk — Government Jobs & Programs Portal',
    title: '☀️ خوشخبري! سنڌ حڪومت مفت سولر سسٽم ڏي رھي آھي — ھاڻي ئي فارم ڀريو!',
    description:
      '🌞 سنڌ سولر توانائي پروگرام شروع ٿي ويو آھي! حڪومت سنڌ پنھنجي شھرين کي مفت سولر پينل ڏئي رھي آھي.\n\n✅ مفت سولر سسٽم (1KW کان 5KW)\n📋 آن لائن درخواست بلڪل مفت\n🏠 گھريلو، زرعي ۽ ڪمرشل ڪنيڪشن\n⚡ HESCO ۽ SEPCO صارفين لاءِ\n🎫 فوري اقرارنامو (Acknowledgment Slip)\n\nدير نه ڪريو — ھاڻي ئي پنھنجو ڊيٽا ڀريو! 🙏',
    images: [
      {
        url: 'https://govt-jobs-preparation-portal.vercel.app/og-solar.png',
        width: 1200,
        height: 630,
        alt: 'سنڌ سولر توانائي پروگرام — مفت سولر سسٽم لاءِ درخواست ڏيو',
      },
    ],
    locale: 'sd_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: '☀️ سنڌ حڪومت مفت سولر سسٽم ڏئي رھي آھي — ھاڻي فارم ڀريو!',
    description:
      '🌟 مفت سولر پروگرام شروع! آن لائن درخواست ڀريو ۽ گھر ۾ سولر پينل لڳايو. ✅ بلڪل مفت. دير نه ڪريو! 🙏',
    images: ['https://govt-jobs-preparation-portal.vercel.app/og-solar.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://govt-jobs-preparation-portal.vercel.app/forms/sindh-solar',
  },
};

export default function SindhSolarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
