'use client';

import * as React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlogService, BlogPost } from '@/lib/blog-service';
import { BlogCard } from '@/components/blog/BlogCard';
import { FeaturedBlogCard } from '@/components/blog/FeaturedBlogCard';
import { BlogTabs } from '@/components/blog/BlogTabs';
import { Search, Newspaper, ChevronLeft, ChevronRight, Hash, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogListingPage() {
  const [activeTab, setActiveTab] = React.useState<'featured' | 'all'>('all');
  const [activeCategory, setActiveCategory] = React.useState('Tous');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;

  // Set document title for SEO and Testing
  React.useEffect(() => {
    document.title = 'Blog AgriLogistic | Expertise B2B AgTech';
  }, []);

  const allCategories = BlogService.getCategories();
  const featuredPosts = BlogService.getFeaturedPosts();

  // Filtering logic
  const filteredPosts = React.useMemo(() => {
    let posts =
      activeTab === 'featured'
        ? BlogService.getFeaturedPosts()
        : BlogService.getPostsByCategory(activeCategory);

    if (searchQuery) {
      posts = BlogService.searchPosts(searchQuery);
    }

    return posts;
  }, [activeTab, activeCategory, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when tab/cat/search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container px-6 mx-auto">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0A2619]/5 border border-[#0A2619]/10">
              <Newspaper className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">
                AgriLogistic Editorial & Research
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0A2619] tracking-tighter leading-[0.95] mb-4">
              L'intelligence au service <br />
              <span className="text-primary italic">de la terre.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
              Analyses profondes, études de cas et innovations technologiques pour les leaders de
              l'industrie agroalimentaire mondiale.
            </p>
          </div>

          {/* Tab Controller */}
          <BlogTabs activeTab={activeTab} onChange={setActiveTab} />

          {/* Search & Category Filter (Visible only in "All" tab or when searching) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 pb-12 border-b border-slate-100">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 no-scrollbar">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                      whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                      ${
                        activeCategory === cat
                          ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                          : 'bg-white text-slate-400 border border-slate-100 hover:text-primary hover:bg-slate-50'
                      }
                    `}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer les articles..."
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Content Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + activeCategory + searchQuery + currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'featured' && !searchQuery ? (
                /* Featured Grid - Large Highlight then grid */
                <div className="space-y-12">
                  {featuredPosts.slice(0, 1).map((post) => (
                    <FeaturedBlogCard key={post.id} post={post} />
                  ))}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 pt-8">
                    {featuredPosts.slice(1).map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              ) : (
                /* Standard Grid - 3 columns */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {paginatedPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-20">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-100 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`
                              h-12 w-12 rounded-2xl text-[11px] font-black transition-all
                              ${
                                currentPage === pageNumber
                                  ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-110'
                                  : 'text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-100'
                              }
                            `}
                          >
                            {pageNumber}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-100 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Empty State */}
              {paginatedPosts.length === 0 && (
                <div className="py-32 flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <Hash className="h-8 w-8 text-slate-200" />
                  </div>
                  <h2 className="text-2xl font-black text-primary">Aucun résultat</h2>
                  <p className="text-slate-400 max-w-xs">
                    Nous n'avons trouvé aucun article correspondant à vos critères.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('Tous');
                      setActiveTab('all');
                    }}
                    className="mt-4 px-8 py-3 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-primary/20"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Newsletter Section */}
          <div className="mt-32 border-t border-slate-100 pt-32">
            <div className="relative overflow-hidden rounded-[50px] bg-[#0A2619] p-12 lg:p-24">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="h-3.5 w-3.5" /> Newsletter
                  </div>
                  <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-[0.95]">
                    AgriLogistic <br />
                    <span className="text-emerald-400">Monthly Digest.</span>
                  </h2>
                  <p className="text-emerald-50/60 font-medium text-lg max-w-md">
                    Le meilleur de la tech agricole mondiale, condensé chaque mois dans votre boîte
                    mail.
                  </p>
                </div>
                <div className="bg-white/5 p-8 lg:p-12 rounded-[40px] border border-white/10 backdrop-blur-3xl">
                  <div className="flex flex-col gap-4">
                    <input
                      type="email"
                      placeholder="votre.email@entreprise.com"
                      className="h-16 px-8 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/20 outline-none transition-all font-medium"
                    />
                    <button className="h-16 rounded-2xl bg-emerald-500 text-[#0A2619] font-black uppercase tracking-widest text-xs hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20">
                      S'abonner maintenant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
