import { useState } from "react";
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  Video,
  Calendar,
  Eye
} from "lucide-react";

export function ArticleEditor({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("draft"); // draft, published

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in-down">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('/admin/blog')}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
             <h1 className="text-lg font-bold text-slate-900">{title || "Sans titre"}</h1>
             <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wide">
                {status === "draft" ? "Brouillon" : "Publié"}
             </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium">
             <Eye className="h-4 w-4" /> Prévisualiser
           </button>
           <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium border border-slate-200">
             <Save className="h-4 w-4" /> Enregistrer
           </button>
           <button 
              onClick={() => setStatus("published")}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-bold shadow-sm"
            >
             Publier
           </button>
        </div>
      </div>

      <div className="flex flex-1 max-w-7xl mx-auto w-full p-6 gap-6">
        
        {/* Main Editor Area */}
        <div className="flex-1 space-y-6">
           {/* Title Input */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <input 
                type="text" 
                placeholder="Titre de l'article" 
                className="w-full text-4xl font-bold text-slate-900 placeholder:text-slate-300 border-none focus:ring-0 px-0"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
           </div>

           {/* WYSIWYG Editor */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
              {/* Toolbar */}
              <div className="border-b border-slate-100 p-3 flex items-center gap-1 flex-wrap bg-slate-50/50 rounded-t-xl">
                 <EditorButton icon={Bold} toolTip="Gras" />
                 <EditorButton icon={Italic} toolTip="Italique" />
                 <div className="w-px h-5 bg-slate-200 mx-2" />
                 <EditorButton icon={Type} toolTip="Titre" />
                 <EditorButton icon={List} toolTip="Liste" />
                 <div className="w-px h-5 bg-slate-200 mx-2" />
                 <EditorButton icon={AlignLeft} toolTip="Aligner à gauche" active />
                 <EditorButton icon={AlignCenter} toolTip="Aligner au centre" />
                 <div className="w-px h-5 bg-slate-200 mx-2" />
                 <EditorButton icon={LinkIcon} toolTip="Lien" />
                 <EditorButton icon={ImageIcon} toolTip="Image" />
                 <EditorButton icon={Video} toolTip="Vidéo" />
              </div>
              
              {/* Content Area */}
              <textarea 
                 className="flex-1 w-full p-6 resize-none border-none focus:ring-0 text-lg leading-relaxed text-slate-700"
                 placeholder="Commencez à rédiger votre article..."
              />
           </div>
        </div>

        {/* Sidebar Settings */}
        <div className="w-80 space-y-6">
           
           {/* Publication Settings */}
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Publication</h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <div className="relative">
                       <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                       <input type="date" className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Auteur</label>
                    <select className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                       <option>Thomas Tech</option>
                       <option>Sarah Green</option>
                       <option>AgroLogistic Team</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Category & Tags */}
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Classement</h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                    <select className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                       <option>Actualités</option>
                       <option>Expertises</option>
                       <option>Témoignages</option>
                       <option>RSE</option>
                       <option>Mises à jour Produit</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                    <input type="text" placeholder="Ajouter des tags..." className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                    <p className="text-xs text-slate-400 mt-1">Séparez par des virgules</p>
                 </div>
              </div>
           </div>

           {/* Featured Image */}
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Image à la une</h3>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                 <ImageIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                 <p className="text-sm text-slate-500">Glisser une image ou cliquer pour uploader</p>
              </div>
           </div>

           {/* SEO */}
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Référencement (SEO)</h3>
              <div className="space-y-3">
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Méta Titre</label>
                    <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder={title} />
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Méta Description</label>
                    <textarea className="w-full p-2 border border-slate-200 rounded-lg text-sm h-20 resize-none" placeholder="Description courte pour Google..." />
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

function EditorButton({ icon: Icon, toolTip, active = false }: { icon: any, toolTip: string, active?: boolean }) {
   return (
      <button 
         className={`p-2 rounded hover:bg-slate-200 transition-colors ${active ? "bg-slate-200 text-slate-900" : "text-slate-500"}`}
         title={toolTip}
      >
         <Icon className="h-4 w-4" />
      </button>
   )
}
