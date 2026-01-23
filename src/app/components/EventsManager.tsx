import { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Search, 
  MoreVertical,
  Clock,
  ArrowLeft,
  X
} from "lucide-react";

export function EventsManager({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("list"); // list, calendar

  const events = [
    {
       id: 1,
       title: "Salon de l'Agriculture Durable",
       date: "15 Fév 2026",
       time: "09:00 - 18:00",
       location: "Paris Expo, France",
       attendees: 145,
       status: "upcoming"
    },
    {
       id: 2,
       title: "Webinaire : Gestion de l'Eau",
       date: "28 Fév 2026",
       time: "14:00 - 15:30",
       location: "En ligne",
       attendees: 320,
       status: "upcoming"
    },
    {
       id: 3,
       title: "Formation : Capteurs IoT",
       date: "10 Mar 2026",
       time: "10:00 - 17:00",
       location: "Lyon, France",
       attendees: 45,
       status: "draft"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in-down">
       
       {/* Header */}
       <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('/admin/blog')}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Gestion des Événements</h1>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Créer un événement
          </button>
       </div>

       {/* Main Content */}
       <div className="p-6 max-w-7xl mx-auto w-full">
          
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
             <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-fit">
                <button 
                  onClick={() => setActiveTab("list")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "list" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Liste
                </button>
                <button 
                  onClick={() => setActiveTab("calendar")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "calendar" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Calendrier
                </button>
             </div>
             
             <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher un événement..." 
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-64 focus:ring-emerald-500 focus:border-emerald-500"
                />
             </div>
          </div>

          {/* Events List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             
             {/* Table Header */}
             <div className="grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <div>Nom de l'événement</div>
                <div>Date & Heure</div>
                <div>Lieu</div>
                <div>Participants</div>
                <div className="text-right">Actions</div>
             </div>

             {/* Items */}
             {events.map((event) => (
                <div key={event.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 p-4 border-b border-slate-100 items-center hover:bg-slate-50 transition-colors">
                   <div>
                      <h3 className="font-bold text-slate-900">{event.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium mt-1 ${
                         event.status === "upcoming" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}>
                         {event.status === "upcoming" ? "À venir" : "Brouillon"}
                      </span>
                   </div>
                   <div className="text-sm text-slate-600 flex flex-col">
                      <span className="font-medium flex items-center gap-1"><Calendar className="h-3 w-3" /> {event.date}</span>
                      <span className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time}</span>
                   </div>
                   <div className="text-sm text-slate-600 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {event.location}
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                         {[1,2,3].map(i => (
                            <div key={i} className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white" />
                         ))}
                      </div>
                      <span className="text-xs text-slate-500">+{event.attendees}</span>
                   </div>
                   <div className="text-right">
                      <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                         <MoreVertical className="h-4 w-4" />
                      </button>
                   </div>
                </div>
             ))}
          </div>

          {/* Map Placeholder */}
          <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex items-center gap-4">
             <div className="p-3 bg-white rounded-full shadow-sm text-emerald-600">
                <MapPin className="h-6 w-6" />
             </div>
             <div>
                <h3 className="font-bold text-emerald-900">Carte Interactive</h3>
                <p className="text-emerald-700/80 text-sm">Activez la vue carte pour voir la répartition géographique de vos événements.</p>
             </div>
             <button className="ml-auto px-4 py-2 bg-white text-emerald-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-emerald-50 transition-colors">
                Activer
             </button>
          </div>

       </div>

       {/* Create Modal */}
       {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                   <h2 className="text-lg font-bold text-slate-900">Nouvel Événement</h2>
                   <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="h-5 w-5" />
                   </button>
                </div>
                <div className="p-6 space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                      <input type="text" className="w-full p-2 border border-slate-200 rounded-lg" placeholder="Ex: Salon de l'Agriculture" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                         <input type="date" className="w-full p-2 border border-slate-200 rounded-lg" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Heure</label>
                         <input type="time" className="w-full p-2 border border-slate-200 rounded-lg" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Lieu</label>
                      <div className="relative">
                         <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                         <input type="text" className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg" placeholder="Adresse complète" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea className="w-full p-2 border border-slate-200 rounded-lg h-24 resize-none" placeholder="Détails de l'événement..." />
                   </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                   <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
                      Annuler
                   </button>
                   <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                      Créer l'événement
                   </button>
                </div>
             </div>
          </div>
       )}

    </div>
  );
}
