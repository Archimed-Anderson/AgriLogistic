
const testimonials = [
  {
    body: "AgroLogistic a transformé notre façon de vendre. Nous avons réduit nos pertes post-récolte de 30% grâce à la logistique intégrée.",
    author: {
      name: "Jean Dupont",
      handle: "AgriBio Ferme",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "La marketplace m'a permis de trouver de nouveaux fournisseurs en un clic. L'interface est intuitive et le support très réactif.",
    author: {
      name: "Marie Curie",
      handle: "Coopérative Sud",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "Les outils d'IA nous ont alertés sur une menace de mildiou 3 jours avant qu'elle ne soit visible. Une économie inestimable !",
    author: {
      name: "Paul Martin",
      handle: "Vignobles Martin",
      imageUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-green-600">Témoignages</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ils nous font confiance
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author.handle} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                <figure className="rounded-2xl bg-white p-8 text-sm leading-6 shadow-lg ring-1 ring-slate-900/5">
                  <blockquote className="text-slate-900 font-medium italic">
                    <p>“{testimonial.body}”</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <img className="h-10 w-10 rounded-full bg-slate-50" src={testimonial.author.imageUrl} alt="" />
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.author.name}</div>
                      <div className="text-slate-600 font-normal">@{testimonial.author.handle}</div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
