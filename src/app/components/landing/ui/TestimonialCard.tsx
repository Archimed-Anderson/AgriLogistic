import { Quote, Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatarSrc: string;
}

export default function TestimonialCard({
  name,
  role,
  content,
  rating,
  avatarSrc,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl p-8 border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
      {/* Quote Icon */}
      <div className="mb-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <Quote className="h-6 w-6 text-emerald-600" />
        </div>
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6 line-clamp-4">"{content}"</p>

      {/* Author */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
          <img
            src={avatarSrc}
            alt={`Photo de ${name}`}
            className="w-full h-full object-cover"
            width={80}
            height={80}
            decoding="async"
            loading="lazy"
          />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-600">{role}</div>
        </div>
      </div>
    </div>
  );
}
