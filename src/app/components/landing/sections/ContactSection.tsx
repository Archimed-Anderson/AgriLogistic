import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Mail, LifeBuoy, Handshake, ArrowRight } from "lucide-react";

interface ContactSectionProps {
  onNavigate?: (route: string) => void;
}

const contactOptions = [
  {
    id: "general",
    title: "General Inquiries",
    description: "Questions about features, pricing, or demos.",
    icon: Mail,
    image: "/assets/images/landing/contact-general.png",
    route: "/contact/general",
    color: "bg-blue-50 text-blue-600"
  },
  {
    id: "support",
    title: "Technical Support",
    description: "Help with your account or technical issues.",
    icon: LifeBuoy,
    image: "/assets/images/landing/contact-support.png",
    route: "/contact/support",
    color: "bg-green-50 text-green-600"
  },
  {
    id: "partners",
    title: "Partnerships",
    description: "Explore collaboration opportunities with us.",
    icon: Handshake,
    image: "/assets/images/landing/contact-partners.png",
    route: "/contact/partnerships",
    color: "bg-purple-50 text-purple-600"
  }
];

export default function ContactSection({ onNavigate }: ContactSectionProps) {
  const [activeContact, setActiveContact] = useState(contactOptions[0]);

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-slate-50 rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
           <div className="grid lg:grid-cols-5 h-full">
              
              {/* Left Image Side - Takes 2 cols */}
              <div className="lg:col-span-2 relative h-64 lg:h-auto min-h-[400px] group overflow-hidden">
                 <div className="absolute inset-0 bg-slate-900/10 z-10 transition-colors"></div>
                 <img 
                   src={activeContact.image} 
                   alt={activeContact.title} 
                   className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                   key={activeContact.image}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-20"></div>
                 <div className="absolute bottom-8 left-8 right-8 text-white z-30">
                    <h3 className="text-2xl font-bold mb-2">{activeContact.title}</h3>
                    <p className="text-white/90 text-sm">{activeContact.description}</p>
                 </div>
              </div>

              {/* Right Form Side - Takes 3 cols */}
              <div className="lg:col-span-3 p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
                 <div className="mb-8">
                    <span className="text-green-600 font-semibold tracking-wide uppercase text-sm">
                      Contact Us
                    </span>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                      Get In Touch
                    </h2>
                    <p className="mt-4 text-slate-600">
                      Choose a department below or fill out the form to reach our general inbox.
                    </p>
                 </div>

                 {/* Interactive Department Selector */}
                 <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    {contactOptions.map((option) => (
                       <div 
                         key={option.id}
                         className={`p-4 rounded-xl border cursor-pointer transition-all ${activeContact.id === option.id ? 'border-green-500 bg-green-50/50 ring-1 ring-green-500' : 'border-slate-200 hover:border-green-200 hover:bg-white'}`}
                         onClick={() => setActiveContact(option)}
                         onDoubleClick={() => onNavigate && onNavigate(option.route)}
                       >
                          <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center mb-3`}>
                             <option.icon className="w-5 h-5" />
                          </div>
                          <p className="font-semibold text-sm text-slate-900 flex items-center gap-1">
                             {option.title.split(' ')[0]} 
                             <ArrowRight className={`w-3 h-3 ${activeContact.id === option.id ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                          </p>
                       </div>
                    ))}
                 </div>

                 <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Full Name</label>
                          <Input placeholder="John Doe" className="bg-white border-slate-200 h-11" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Email Address</label>
                          <Input type="email" placeholder="john@company.com" className="bg-white border-slate-200 h-11" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Subject</label>
                       <Input placeholder={`Reg: ${activeContact.title}`} className="bg-white border-slate-200 h-11" readOnly />
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Message</label>
                       <Textarea placeholder="Tell us about your project..." className="bg-white border-slate-200 min-h-[120px]" />
                    </div>

                    <Button className="w-full bg-green-700 hover:bg-green-800 text-white h-12 text-base rounded-lg">
                       Send Message to {activeContact.title}
                    </Button>
                 </form>
              </div>

           </div>
        </div>
      </div>
    </section>
  );
}
