
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

export function ContactSection() {
  return (
    <section className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#9afeb3] to-[#80caff] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
      
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Contactez-nous</h2>
        <p className="mt-2 text-lg leading-8 text-slate-600">
          Une question ? Une démo personnalisée ? Notre équipe vous répond sous 24h.
        </p>
      </div>
      
      <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-slate-900">Prénom</label>
            <div className="mt-2.5">
              <Input type="text" name="first-name" id="first-name" autoComplete="given-name" />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-slate-900">Nom</label>
            <div className="mt-2.5">
              <Input type="text" name="last-name" id="last-name" autoComplete="family-name" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="company" className="block text-sm font-semibold leading-6 text-slate-900">Entreprise / Exploitation</label>
            <div className="mt-2.5">
               <Input type="text" name="company" id="company" autoComplete="organization" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-slate-900">Email</label>
            <div className="mt-2.5">
              <Input type="email" name="email" id="email" autoComplete="email" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-slate-900">Message</label>
            <div className="mt-2.5">
              <Textarea name="message" id="message" rows={4} />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Envoyer le message
          </Button>
        </div>
      </form>
    </section>
  );
}
