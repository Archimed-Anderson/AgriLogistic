"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "Comment AgriLogistic assure-t-il la sécurité des transactions ?",
    answer: "Nous utilisons la technologie Blockchain pour enregistrer chaque contrat et transaction. Cela garantit une immuabilité totale et une transparence complète pour toutes les parties impliquées."
  },
  {
    question: "Dois-je payer des frais d'entrée pour rejoindre la plateforme ?",
    answer: "L'inscription est gratuite pour les producteurs individuels. Nous prélevons une commission minime uniquement sur les transactions réussies pour assurer le fonctionnement du réseau."
  },
  {
    question: "Quels types de cultures sont supportés par l'IA ?",
    answer: "Notre moteur d'IA supporte actuellement plus de 50 types de cultures tropicales et continentales, avec des modèles spécifiques pour le café, le cacao, le maïs et les céréales."
  },
  {
    question: "Comment fonctionne le suivi logistique ?",
    answer: "Chaque transporteur utilise notre application mobile qui transmet des données GPS et de température en temps réel vers le tableau de bord de l'acheteur."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 bg-background">
      <div className="container px-6 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Questions Fréquentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`rounded-2xl border transition-all duration-300 ${openIndex === index ? "border-primary/20 bg-primary/5" : "border-primary/5 bg-background"}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-bold">{faq.question}</span>
                  {openIndex === index ? (
                    <Minus className="h-5 w-5 text-primary" />
                  ) : (
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="p-6 pt-0 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


