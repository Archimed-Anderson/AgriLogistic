import { BLOG_DATASET, BlogPost } from '@/data/blog-dataset';
export type { BlogPost };

export const BlogService = {
  getAllPosts: (): BlogPost[] => {
    return BLOG_DATASET;
  },

  getFeaturedPosts: (): BlogPost[] => {
    return BLOG_DATASET.filter((post) => post.featured);
  },

  getPostBySlug: (slug: string): BlogPost | undefined => {
    return BLOG_DATASET.find((post) => post.slug === slug);
  },

  getPostsByCategory: (category: string): BlogPost[] => {
    if (category === 'Tous' || category === 'All') return BLOG_DATASET;
    return BLOG_DATASET.filter((post) => post.category === category);
  },

  getCategories: (): string[] => {
    const categories = new Set(BLOG_DATASET.map((post) => post.category));
    return ['Tous', ...Array.from(categories)];
  },

  searchPosts: (query: string): BlogPost[] => {
    const lowerQuery = query.toLowerCase();
    return BLOG_DATASET.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery)
    );
  },
};
