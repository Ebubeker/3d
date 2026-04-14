// Fixed list of blog categories. Admin UI also supports freeform custom values.
export const BLOG_CATEGORIES = [
  'Virtual Sampling and 3D',
  'Tech Packs and Technical Design',
  'Fashion Development',
  'Case Studies',
  'Industry Insights',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number] | string;
