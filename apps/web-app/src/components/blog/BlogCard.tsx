"use client"

import { BlogPost } from "@/lib/blog-service"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white rounded-[32px] border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image 
          src={post.image} 
          alt={post.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest text-primary shadow-sm border border-slate-100">
            {post.category}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6 lg:p-8 space-y-4">
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-emerald-500" /> {post.publishedAt}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-emerald-500" /> {post.readTime}</span>
        </div>
        <h3 className="text-xl font-black text-[#0A2619] leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 overflow-hidden relative">
               <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
            </div>
            <div>
               <p className="text-xs font-bold text-primary">{post.author.name}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{post.author.role}</p>
            </div>
          </div>
          <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}
