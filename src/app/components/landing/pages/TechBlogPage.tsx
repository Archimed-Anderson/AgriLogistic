import { useState } from "react";
import { Clock, ArrowRight, User, Tag, Calendar, ChevronRight, Mail } from "lucide-react";
import FooterSection from "../sections/FooterSection";

export function TechBlogPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [selectedFilter, setSelectedFilter] = useState("Tous");

  const categories = ["Tous", "Actualités", "Expertises", "Témoignages", "RSE"];

  // Featured Release Article
  const featuredArticle = {
    id: "agrologistic-v2",
    title: "AgroLogistic V2.0 : L'ère de la Logistique Intelligente",
    excerpt: "Découvrez la nouvelle version majeure de notre plateforme. Traçabilité Blockchain native, optimisation IA temps réel et interface repensée pour les coopératives.",
    author: {
      name: "Thomas Tech",
      role: "CTO AgroLogistic",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    category: "Actualités",
    date: "20 Janvier 2026",
    readTime: 5,
    image_url: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
  };

  const articles = [
    {
      id: "1",
      title: "Comment l'IoT révolutionne la chaîne du froid",
      excerpt: "Étude de cas sur l'intégration de capteurs LoRaWAN chez GreenLog, réduisant les pertes de marchandises de 40%.",
      author: { name: "Sarah Green", avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
      category: "Expertises",
      date: "15 Janvier 2026",
      readTime: 8,
      image_url: "https://images.unsplash.com/photo-1555664424-778a69022365?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: "2",
      title: "Blockchain et Agriculture : Au-delà du Buzz",
      excerpt: "Comprendre concrètement comment AgroLogistic utilise la blockchain pour certifier chaque transaction de votre exploitation.",
      author: { name: "Alex Chain", avatar_url: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
      category: "Expertises",
      date: "10 Janvier 2026",
      readTime: 12,
      image_url: "https://images.unsplash.com/photo-1639322537228-ad71c4295843?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
     {
      id: "3",
      title: "Témoignage : La Coopérative du Sud",
      excerpt: "Retour d'expérience sur l'implémentation de nos outils de gestion de tournées et l'impact sur la rentabilité.",
      author: { name: "Marie Route", avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
      category: "Témoignages",
      date: "5 Janvier 2026",
      readTime: 15,
      image_url: "https://images.unsplash.com/photo-1595839019779-11ba1ef5dcef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"
    },
    {
      id: "4",
      title: "Réduire son empreinte carbone en logistique",
      excerpt: "Nos meilleures pratiques pour configurer l'algorithme de routing et économiser jusqu'à 20% de carburant.",
      author: { name: "Jean Durable", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
      category: "RSE",
      date: "28 Décembre 2025",
      readTime: 6,
      image_url: "https://images.unsplash.com/photo-1469122312224-c5846569feb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2089&q=80"
    }
  ];

  const filteredArticles = selectedFilter === "Tous" 
    ? articles 
    : articles.filter(a => a.category === selectedFilter);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-700">
      
      {/* Header Section */}
      <section className="bg-slate-50 border-b border-slate-200">
         <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-6xl mb-6 tracking-tight">
               Le Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">AgroLogistic</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
               Explorez nos dernières actualités, découvrez nos expertises techniques et inspirez-vous des réussites de nos partenaires.
            </p>
         </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
         
         {/* Categories Filter */}
         <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
            {categories.map((cat) => (
               <button 
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                     selectedFilter === cat 
                     ? "bg-slate-900 text-white shadow-lg transform scale-105" 
                     : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  }`}
               >
                  {cat}
               </button>
            ))}
         </div>

         {/* Featured Article (Only show if filter is "Tous" or matches category) */}
         {(selectedFilter === "Tous" || selectedFilter === featuredArticle.category) && (
           <div 
             onClick={() => onNavigate('/blog/v2-release')} 
             className="mb-20 group cursor-pointer"
           >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[450px] overflow-hidden rounded-3xl shadow-xl">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-all duration-500 z-10" />
                    <img 
                       src={featuredArticle.image_url} 
                       alt={featuredArticle.title}
                       className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                    />
                 </div>
                 <div className="flex flex-col justify-center space-y-6">
                    <div className="flex items-center gap-3 text-sm font-medium">
                       <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wide text-xs">
                          À la une
                       </span>
                       <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                       <span className="text-slate-500">{featuredArticle.date}</span>
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                       {featuredArticle.title}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                       {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                       <div className="flex items-center gap-3">
                          <img src={featuredArticle.author.avatar_url} alt={featuredArticle.author.name} className="h-10 w-10 rounded-full bg-slate-200 object-cover" />
                          <div>
                             <div className="text-sm font-bold text-slate-900">{featuredArticle.author.name}</div>
                             <div className="text-xs text-slate-500">{featuredArticle.author.role}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:translate-x-1 transition-transform">
                          Lire l'article <ArrowRight className="h-5 w-5" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}

         {/* Articles Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredArticles.map((article) => (
               <article key={article.id} className="flex flex-col group cursor-pointer" onClick={() => onNavigate(`/blog/${article.id}`)}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 shadow-sm">
                     <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-slate-900/0 transition-colors z-10" />
                     <img 
                        src={article.image_url} 
                        alt={article.title} 
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                     />
                     <div className="absolute top-4 left-4 z-20">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm uppercase tracking-wide">
                           {article.category}
                        </span>
                     </div>
                  </div>
                  
                  <div className="flex flex-col flex-1">
                     <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{article.date}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <Clock className="h-3.5 w-3.5 ml-1" />
                        <span>{article.readTime} min lecture</span>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-emerald-700 transition-colors">
                        {article.title}
                     </h3>
                     <p className="text-base text-slate-600 flex-1 line-clamp-3 mb-6">
                        {article.excerpt}
                     </p>
                     
                     <div className="flex items-center gap-3">
                        <img src={article.author.avatar_url} alt={article.author.name} className="h-8 w-8 rounded-full bg-slate-200 object-cover" />
                        <span className="text-sm font-semibold text-slate-900">{article.author.name}</span>
                     </div>
                  </div>
               </article>
            ))}
         </div>
         
         {/* Load More Button (Mockup) */}
         <div className="mt-16 text-center">
            <button className="px-8 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all">
               Charger plus d'articles
            </button>
         </div>

         {/* Newsletter Section */}
         <div className="mt-32 relative rounded-3xl overflow-hidden bg-slate-900 px-6 py-16 sm:px-16 shadow-2xl">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
                     Restez informé
                  </h2>
                  <p className="text-lg text-slate-400 mb-8">
                     Recevez nos dernières analyses, mises à jour produits et invitations à nos webinaires directement dans votre boîte mail.
                  </p>
                  <div className="flex items-start gap-4 text-slate-300 text-sm">
                     <div className="flex items-center gap-2"><CheckBadge /> Pas de spam</div>
                     <div className="flex items-center gap-2"><CheckBadge /> Désabonnement facile</div>
                  </div>
               </div>
               <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <form className="flex flex-col gap-4">
                     <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-slate-400" />
                           </div>
                           <input 
                              type="email" 
                              name="email" 
                              id="email" 
                              className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl leading-5 bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                              placeholder="votre@email.com" 
                           />
                        </div>
                     </div>
                     <button type="button" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 md:py-3 md:text-lg md:px-10 transition-colors shadow-lg shadow-emerald-900/20">
                        S'inscrire à la newsletter
                     </button>
                     <p className="text-center text-xs text-slate-500 mt-2">
                        En vous inscrivant, vous acceptez notre politique de confidentialité.
                     </p>
                  </form>
               </div>
            </div>
         </div>

      </section>

      <FooterSection />
    </div>
  );
}

function CheckBadge() {
   return (
      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
   )
}
