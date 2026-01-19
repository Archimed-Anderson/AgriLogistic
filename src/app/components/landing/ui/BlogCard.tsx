import { Calendar, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  gradient: string;
}

export default function BlogCard({ title, excerpt, date, category, imageSrc, imageAlt, gradient }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          width={800}
          height={534}
          decoding="async"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-xs font-semibold text-emerald-600">{category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4" />
          <time>{date}</time>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>

        {/* Read More */}
        <button className="inline-flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-2 transition-all duration-300">
          Lire la suite
          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </article>
  );
}
