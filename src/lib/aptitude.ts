import { AptitudeQuestion, getAptitudeTopic } from '@/data/aptitudeTopics';

/**
 * Loads the question bank for one aptitude topic (server-side).
 * Each topic lives in its own JSON file so only the requested chunk is bundled/loaded.
 */
export async function loadAptitudeQuestions(slug: string): Promise<AptitudeQuestion[]> {
  if (!getAptitudeTopic(slug)) return [];
  try {
    const mod = await import(`@/data/aptitude/${slug}.json`);
    const data = (mod as any).default ?? mod;
    return Array.isArray(data) ? (data as AptitudeQuestion[]) : [];
  } catch (error) {
    console.error(`Failed to load aptitude topic "${slug}":`, error);
    return [];
  }
}
