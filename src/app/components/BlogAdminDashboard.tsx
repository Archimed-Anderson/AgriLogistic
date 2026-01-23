import { useState } from "react";
import { Plus, FileText, Calendar, BarChart3, MessageSquare } from "lucide-react";

export function BlogAdminDashboard() {
  const [stats] = useState([
    { label: "Vues Totales", value: "12.5k", change: "+14%", icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Articles Publiés", value: "24", change: "+2", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Événements à venir", value: "3", change: "0", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Commentaires", value: "85", change: "+12", icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-50" },
  ]);

  return (
    <div className="space-y-6 animate-fade-in-down">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administration Blog & Événements</h1>
          <p className="text-slate-500">Gérez vos articles, événements et modérez les interactions.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.hash = "#/admin/blog/editor"} 
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Nouvel Article
          </button>
          <button 
            onClick={() => window.location.hash = "#/admin/blog/events"}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Nouvel Événement
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{stat.change}</span>
              <span className="text-slate-400 ml-2">depuis le mois dernier</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Content List Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Articles Récents</h2>
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <FileText className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p>Aucun article récent.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h2 className="text-lg font-bold text-slate-900 mb-4">Prochains Événements</h2>
           <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p>Aucun événement planifié.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
