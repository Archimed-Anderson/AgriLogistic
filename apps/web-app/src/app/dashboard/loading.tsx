export default function DashboardLoading() {
  return (
    <div className="flex flex-col h-full gap-6 p-6 animate-pulse">
      <div className="h-12 w-64 bg-slate-800/50 rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-800/50 rounded-2xl" />
        ))}
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-800/30 rounded-2xl" />
        <div className="h-64 bg-slate-800/30 rounded-2xl" />
      </div>
    </div>
  );
}
