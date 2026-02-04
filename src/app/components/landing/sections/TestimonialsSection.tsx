import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    content:
      'Cette plateforme a transformé notre gestion quotidienne. La marketplace nous permet de vendre nos récoltes au meilleur prix garantis.',
    author: 'Jean Dupont',
    role: 'Propriétaire de Ferme',
    rating: 5,
  },
  {
    content:
      "L'outil de logistique est incroyablement précis. Nous avons réduit nos coûts de transport de 25% en utilisant AgroLogistic.",
    author: 'Sophie Marceau',
    role: 'Directrice Logistique',
    rating: 5,
  },
  {
    content:
      "Les prévisions IA sont justes et nous aident à mieux planifier nos cultures. Un outil indispensable pour l'agriculture moderne.",
    author: 'Pierre Martin',
    role: 'Agronome',
    rating: 4,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center md:mb-16 mb-12">
          <span className="text-green-600 font-semibold tracking-wide uppercase text-sm">
            Testimonials
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Best Feedback From Happy Clients
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative group hover:-translate-y-2 transition-transform duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-green-100 group-hover:text-green-500 transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-slate-600 mb-6 italic leading-relaxed">"{testimonial.content}"</p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                  <img
                    src={`https://ui-avatars.com/api/?name=${testimonial.author}&background=random`}
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{testimonial.author}</p>
                  <p className="text-slate-400 text-xs uppercase tracking-wide">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
