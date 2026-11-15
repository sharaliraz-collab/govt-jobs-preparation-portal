// Auto-generated from the Aptitude MCQ bank (src/data/aptitude/*.json).
export type AptitudeGroupId = 'arithmetic' | 'numbers' | 'timework' | 'geometry' | 'counting';

export interface AptitudeTopic {
  id: number;
  slug: string;
  title: string;
  count: number;
  group: AptitudeGroupId;
}

export interface AptitudeQuestion {
  /** question text (may contain LaTeX) */
  q: string;
  /** answer options (may contain LaTeX) */
  o: string[];
  /** index of the correct option */
  a: number;
  /** step-by-step solution (may contain LaTeX) � empty string when unavailable */
  s: string;
}

export const APTITUDE_GROUPS: { id: AptitudeGroupId; label: string; blurb: string }[] = [
  { id: 'arithmetic', label: 'Arithmetic & Finance', blurb: 'Average, percentage, ratio, profit & loss, interest, discount' },
  { id: 'numbers', label: 'Numbers & Algebra', blurb: 'Number system, HCF & LCM, surds, logarithm, progressions, algebra' },
  { id: 'timework', label: 'Time, Speed & Work', blurb: 'Trains, boats, pipes, work, ages, calendar and clock problems' },
  { id: 'geometry', label: 'Geometry & Mensuration', blurb: 'Triangles, area, volume, trigonometry, coordinate geometry' },
  { id: 'counting', label: 'Probability & Counting', blurb: 'Permutation, combination and probability' },
];

export const APTITUDE_TOPICS: AptitudeTopic[] = [
  { id: 1, slug: 'average', title: 'Average', count: 100, group: 'arithmetic' },
  { id: 2, slug: 'interest', title: 'Interest', count: 100, group: 'arithmetic' },
  { id: 3, slug: 'number-system', title: 'Number System', count: 100, group: 'numbers' },
  { id: 4, slug: 'percentage', title: 'Percentage', count: 100, group: 'arithmetic' },
  { id: 5, slug: 'progressions', title: 'Progressions', count: 91, group: 'numbers' },
  { id: 6, slug: 'ratio', title: 'Ratio', count: 100, group: 'arithmetic' },
  { id: 7, slug: 'profit-and-loss', title: 'Profit and Loss', count: 100, group: 'arithmetic' },
  { id: 8, slug: 'speed-time-and-distance', title: 'Speed Time and Distance', count: 100, group: 'timework' },
  { id: 9, slug: 'time-and-work', title: 'Time and Work', count: 100, group: 'timework' },
  { id: 10, slug: 'permutation-and-combination', title: 'Permutation and Combination', count: 100, group: 'counting' },
  { id: 11, slug: 'alligation', title: 'Alligation', count: 94, group: 'arithmetic' },
  { id: 12, slug: 'triangles', title: 'Triangles', count: 100, group: 'geometry' },
  { id: 13, slug: 'partnership', title: 'Partnership', count: 100, group: 'arithmetic' },
  { id: 14, slug: 'problems-on-trains', title: 'Problems on Trains', count: 86, group: 'timework' },
  { id: 15, slug: 'height-and-distance', title: 'Height and Distance', count: 100, group: 'geometry' },
  { id: 16, slug: 'compound-interest', title: 'Compound Interest', count: 100, group: 'arithmetic' },
  { id: 17, slug: 'problems-on-ages', title: 'Problems on Ages', count: 52, group: 'timework' },
  { id: 18, slug: 'calendar', title: 'Calendar', count: 84, group: 'timework' },
  { id: 19, slug: 'clock', title: 'Clock', count: 41, group: 'timework' },
  { id: 20, slug: 'area', title: 'Area', count: 100, group: 'geometry' },
  { id: 21, slug: 'volume-and-surface-area', title: 'Volume and Surface Area', count: 100, group: 'geometry' },
  { id: 22, slug: 'problems-on-numbers', title: 'Problems on Numbers', count: 100, group: 'numbers' },
  { id: 23, slug: 'problems-on-hcf-and-lcm', title: 'Problems on H.C.F and L.C.M', count: 100, group: 'numbers' },
  { id: 24, slug: 'decimal-fraction', title: 'Decimal Fraction', count: 100, group: 'arithmetic' },
  { id: 25, slug: 'simplification', title: 'Simplification', count: 100, group: 'arithmetic' },
  { id: 26, slug: 'square-root-and-cube-root', title: 'Square Root and Cube Root', count: 100, group: 'numbers' },
  { id: 27, slug: 'surds-and-indices', title: 'Surds and Indices', count: 100, group: 'numbers' },
  { id: 28, slug: 'chain-rule', title: 'Chain Rule', count: 66, group: 'arithmetic' },
  { id: 29, slug: 'pipes-and-cistern', title: 'Pipes and Cistern', count: 67, group: 'timework' },
  { id: 30, slug: 'boats-and-streams', title: 'Boats and Streams', count: 49, group: 'timework' },
  { id: 31, slug: 'logarithm', title: 'Logarithm', count: 47, group: 'numbers' },
  { id: 32, slug: 'races-and-games', title: 'Races and Games', count: 45, group: 'timework' },
  { id: 33, slug: 'stocks-and-shares', title: 'Stocks and Shares', count: 24, group: 'arithmetic' },
  { id: 34, slug: 'probability', title: 'Probability', count: 100, group: 'counting' },
  { id: 35, slug: 'true-discount', title: 'True Discount', count: 100, group: 'arithmetic' },
  { id: 36, slug: 'bankers-discount', title: 'Bankers Discount', count: 50, group: 'arithmetic' },
  { id: 37, slug: 'trigonometry', title: 'Trigonometry', count: 100, group: 'geometry' },
  { id: 38, slug: 'algebra', title: 'Algebra', count: 100, group: 'numbers' },
  { id: 39, slug: 'circular-measurement-of-angle', title: 'Circular Measurement of Angle', count: 27, group: 'geometry' },
  { id: 40, slug: 'coordinate-geometry', title: 'Coordinate Geometry', count: 90, group: 'geometry' },
  { id: 41, slug: 'geometry', title: 'Geometry', count: 100, group: 'geometry' },
  { id: 42, slug: 'mensuration-2d', title: 'Mensuration 2D', count: 89, group: 'geometry' },
  { id: 43, slug: 'mensuration-3d', title: 'Mensuration 3D', count: 100, group: 'geometry' },
];

export const APTITUDE_TOTAL_QUESTIONS = 3702;
export const APTITUDE_PER_PAGE = 10;

export function getAptitudeTopic(slug: string): AptitudeTopic | undefined {
  return APTITUDE_TOPICS.find((t) => t.slug === slug);
}
