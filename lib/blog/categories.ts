// Fixed list of blog categories. Admin UI also supports freeform custom values.
export const BLOG_CATEGORIES = [
  'Industry Insights',
  '3D Design',
  'Sustainability',
  'Technology',
  'Tutorials',
  'Case Studies',
  'Company News',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number] | string;
