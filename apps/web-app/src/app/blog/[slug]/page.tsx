import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { BlogService } from "@/lib/blog-service"
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Metadata } from "next"

// 1. generateStaticParams for full static pre-rendering
export async function generateStaticParams() {
  const posts = BlogService.getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 2. generateMetadata for dynamic SEO titles/descriptions
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = BlogService.getPostBySlug(params.slug)
  if (!post) return { title: "Article non trouvé | AgriLogistic" }

  return {
    title: `${post.title} | Blog AgriLogistic`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
    },
  }
}

export default function BlogPostDetailPage({ params }: { params: { slug: string } }) {
  const post = BlogService.getPostBySlug(params.slug)
  const relatedPosts = BlogService.getPostsByCategory(post?.category || "Tous")
    .filter(p => p.id !== post?.id)
    .slice(0, 3)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* 3. Reading Progress Bar (Fixed on Top) */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-slate-100 z-[100]">
        <div className="h-full bg-primary w-0 transition-all duration-300" id="reading-progress" />
      </div>

      <Navbar />

      <main className="pt-32 pb-24">
        {/* Article Header */}
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto space-y-12">
            <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary/60">{post.category}</span>
            </nav>

            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-[#0A2619] tracking-tighter leading-[1] transition-all">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between gap-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-slate-100 overflow-hidden ring-4 ring-slate-50 relative">
                    <Image 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary flex items-center gap-1.5">
                      {post.author.name}
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{post.author.role}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2.5"><Calendar className="h-4 w-4 text-emerald-500" /> {post.publishedAt}</span>
                    <span className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-emerald-500" /> {post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 hover:border-primary/20 hover:text-primary transition-all shadow-sm">
                        <Share2 className="h-4 w-4" />
                     </button>
                     <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 hover:border-primary/20 hover:text-primary transition-all shadow-sm">
                        <Bookmark className="h-4 w-4" />
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image - Hero Style */}
        <div className="container px-6 mx-auto mt-16 mb-24">
           <div className="relative aspect-[21/9] w-full rounded-[60px] overflow-hidden shadow-2xl group">
              <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2619]/20 to-transparent" />
           </div>
        </div>

        {/* Content Layout */}
        <div className="container px-6 mx-auto">
           <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
              
              {/* Main Reading Area */}
              <article className="w-full lg:w-[65%] order-2 lg:order-1">
                 <div className="prose prose-lg prose-slate max-w-none 
                   prose-headings:font-black prose-headings:text-[#0A2619] prose-headings:tracking-tight
                   prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg
                   prose-strong:text-primary prose-strong:font-black
                   prose-img:rounded-[40px] prose-img:shadow-xl
                   prose-blockquote:border-none prose-blockquote:p-0 prose-blockquote:my-12
                 ">
                    <div className="bg-emerald-50/50 p-8 md:p-12 rounded-[40px] border border-emerald-100/50 mb-16">
                      <p className="text-xl md:text-2xl font-bold text-primary leading-snug m-0">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="space-y-8 whitespace-pre-wrap text-lg text-slate-600 leading-[1.8]">
                      {post.content}
                    </div>

                    <div className="my-20">
                      <blockquote className="relative p-12 rounded-[50px] bg-[#0A2619] text-white overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
                        <span className="text-6xl text-emerald-400 font-serif absolute top-4 left-8 opacity-20">"</span>
                        <p className="text-2xl md:text-3xl font-black leading-tight relative z-10 m-0">
                          La technologie ne remplace pas l'agriculteur, elle lui donne les super-pouvoirs nécessaires pour faire face au changement climatique.
                        </p>
                        <footer className="mt-8 flex items-center gap-4 relative z-10">
                          <div className="h-px w-12 bg-emerald-500/30" />
                          <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">AgriLogistic Vision 2030</span>
                        </footer>
                      </blockquote>
                    </div>
                 </div>

                 {/* Tags & Interaction */}
                 <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                    <div className="flex flex-wrap gap-2.5">
                       {["AgTech", "IA", "Innovation"].map(tag => (
                         <span key={tag} className="px-5 py-2.5 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-emerald-50 transition-all cursor-pointer">
                           #{tag}
                         </span>
                       ))}
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Share This</p>
                      <div className="flex items-center gap-3">
                        <button className="p-3 bg-slate-50 rounded-full hover:bg-primary hover:text-white transition-all"><Share2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                 </div>

                 {/* Author Bio Card */}
                 <div className="mt-16 p-8 md:p-12 rounded-[48px] bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                    <div className="h-24 w-24 rounded-full overflow-hidden relative ring-8 ring-white shadow-xl">
                      <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                    </div>
                    <div className="text-center md:text-left space-y-3">
                      <h4 className="text-xl font-black text-[#0A2619]">Écrit par {post.author.name}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Expert reconnu en {post.category.toLowerCase()} avec plus de 10 ans d'expérience dans l'accompagnement des transformations digitales agricoles.</p>
                      <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Voir ses publications</button>
                    </div>
                 </div>
              </article>

              {/* Sidebar recommendations */}
              <aside className="w-full lg:w-[30%] order-1 lg:order-2">
                 <div className="sticky top-32 space-y-12">
                    
                    {/* Newsletter Box */}
                    <div className="p-10 rounded-[48px] bg-[#0A2619] text-white relative overflow-hidden shadow-2xl">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl rounded-full" />
                       <h3 className="text-2xl font-black mb-4 relative z-10 leading-tight">AgriLogistic <br/>Digest.</h3>
                       <p className="text-emerald-50/60 font-medium text-sm mb-8">Les meilleures analyses AgTech chaque lundi.</p>
                       <form className="space-y-4 relative z-10">
                          <input 
                            type="email" 
                            placeholder="Email professionnel" 
                            className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:bg-white/10 transition-all text-sm font-medium" 
                          />
                          <button className="w-full h-14 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-emerald-500 shadow-xl shadow-primary/20 transition-all active:scale-95">
                            S'inscrire
                          </button>
                       </form>
                    </div>

                    {/* Related Articles */}
                    <div className="space-y-8">
                       <h3 className="text-xl font-black text-[#0A2619] flex items-center gap-3">
                         Articles similaires
                         <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                       </h3>
                       <div className="space-y-8">
                          {relatedPosts.map(p => (
                            <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-5">
                               <div className="relative h-20 w-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
                                  <Image 
                                    src={p.image} 
                                    alt={p.title} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                  />
                               </div>
                               <div className="space-y-1.5">
                                  <h4 className="text-sm font-black text-primary leading-snug group-hover:text-emerald-500 transition-colors line-clamp-2">{p.title}</h4>
                                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                    <span>{p.publishedAt}</span>
                                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                                    <span>{p.readTime}</span>
                                  </div>
                               </div>
                            </Link>
                          ))}
                       </div>
                    </div>

                    <Link href="/blog" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-slate-50 transition-all group">
                       <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                       Tous les articles
                    </Link>
                 </div>
              </aside>

           </div>
        </div>

        {/* 4. Scroll Management script (Hydrated in component usually, but we use a simpler client-side logic if needed) */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.onscroll = function() {
            var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrolled = (winScroll / height) * 100;
            var el = document.getElementById("reading-progress");
            if (el) el.style.width = scrolled + "%";
          };
        `}} />
      </main>

      <Footer />
    </div>
  )
}
