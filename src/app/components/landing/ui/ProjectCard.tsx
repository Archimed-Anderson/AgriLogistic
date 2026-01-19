import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  gradient: string;
}

export default function ProjectCard({ title, category, imageSrc, imageAlt, gradient }: ProjectCardProps) {
  return (
    <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-[300px]">
      {/* Background Image */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover mix-blend-overlay opacity-90"
          width={900}
          height={600}
          decoding="async"
          loading="lazy"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <span className="text-emerald-300 text-sm font-semibold mb-2">{category}</span>
        <h3 className="text-white text-2xl font-bold mb-3">{title}</h3>
        <button className="inline-flex items-center text-white font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          Voir le projet
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
