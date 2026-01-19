import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export default function ServiceCard({ icon: Icon, title, description, gradient }: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-xl p-8 border-2 border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      <div className="mt-6 inline-flex items-center text-emerald-600 font-semibold group-hover:gap-2 transition-all duration-300">
        En savoir plus
        <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
