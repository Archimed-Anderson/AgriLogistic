import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import FooterSection from "../sections/FooterSection";

interface ProjectDetailProps {
  title: string;
  category: string;
  date: string;
  client: string;
  image: string;
  content: React.ReactNode;
  onNavigate?: (route: string) => void;
}

export function ProjectDetailPage({ title, category, date, client, image, content, onNavigate }: ProjectDetailProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar Placeholder / Back Button */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 h-16 flex items-center justify-between">
           <Button 
             variant="ghost" 
             className="text-slate-600 hover:text-green-600 pl-0 hover:bg-transparent"
             onClick={() => onNavigate?.('/')}
           >
             <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
           </Button>
           <div className="font-bold text-xl tracking-tight text-slate-900">AgroLogistic<span className="text-green-600">.</span></div>
           <div className="w-20"></div> {/* Spacer for center alignment */}
        </div>
      </div>

      <main className="pb-24">
        {/* Hero Image */}
        <div className="relative h-[60vh] w-full overflow-hidden">
           <img src={image} alt={title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
           <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
              <div className="mx-auto max-w-7xl">
                 <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase tracking-wider rounded-sm mb-4">
                    {category}
                 </span>
                 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
                    {title}
                 </h1>
                 <div className="flex flex-wrap gap-6 text-slate-300 text-sm font-medium">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-green-400" /> {date}
                    </div>
                    <div className="flex items-center gap-2">
                       <User className="w-4 h-4 text-green-400" /> Client: {client}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12 grid lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-8">
              <div className="prose prose-lg prose-slate hover:prose-a:text-green-600 max-w-none">
                 {content}
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24">
                 <h3 className="font-bold text-lg mb-4 text-slate-900">Project Details</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-50 pb-3">
                       <span className="text-slate-500 flex items-center gap-2"><Tag className="w-4 h-4" /> Category</span>
                       <span className="font-medium text-slate-900">{category}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-3">
                       <span className="text-slate-500 flex items-center gap-2"><User className="w-4 h-4" /> Client</span>
                       <span className="font-medium text-slate-900">{client}</span>
                    </div>
                    <div className="flex justify-between pb-3">
                       <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</span>
                       <span className="font-medium text-slate-900">{date}</span>
                    </div>
                 </div>
                 
                 <Button className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white">
                    <Share2 className="mr-2 h-4 w-4" /> Share Project
                 </Button>
              </div>
           </div>
        </div>
      </main>

      <FooterSection onNavigate={onNavigate} />
    </div>
  );
}
