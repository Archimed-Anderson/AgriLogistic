"use client"

import { BlogPost } from "@/lib/blog-service"
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface FeaturedBlogCardProps {
  post: BlogPost;
}

export function FeaturedBlogCard({ post }: FeaturedBlogCardProps) {
  return (
    <Link 
      href={`/blog/${post.slug}`} 
      className="group relative block w-full overflow-hidden rounded-[40px] bg-[#0A2619] text-white transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20"
    >
      <div className="flex flex-col lg:flex-row min-h-[480px]">
        {/* Image Section */}
        <div className="relative w-full lg:w-3/5 overflow-hidden">
          <Image 
            src={post.image} 
            alt={post.title} 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2619] via-[#0A2619]/40 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2619] via-[#0A2619]/20 to-transparent lg:hidden" />
          
          {/* Floating Category Badge */}
          <div className="absolute top-8 left-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
              <Sparkles className="h-3 w-3" /> {post.category}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex w-full flex-col justify-center p-8 lg:p-12 xl:p-16 lg:w-2/5 space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-6 text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {post.publishedAt}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {post.readTime}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black leading-[1.1] tracking-tight group-hover:text-accent transition-colors">
              {post.title}
            </h2>
            <p className="text-emerald-50/70 font-medium leading-relaxed line-clamp-3 text-lg">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white/10 p-0.5 border border-white/10 overflow-hidden relative">
                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover rounded-full" />
              </div>
              <div>
                <p className="text-sm font-black text-white">{post.author.name}</p>
                <p className="text-[10px] font-bold text-emerald-400 capitalize">{post.author.role}</p>
              </div>
            </div>
            
            <div className="h-12 w-12 rounded-2xl bg-accent text-primary flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-xl shadow-accent/20">
              <ArrowRight className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
