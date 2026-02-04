export default function AdminLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-6 p-6 animate-pulse">
      <div className="grid grid-cols-4 gap-4 shrink-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-800/50 rounded-3xl" />
        ))}
      </div>
      <div className="flex-1 flex gap-6">
        <div className="w-80 bg-slate-800/30 rounded-[40px]" />
        <div className="flex-1 bg-slate-800/20 rounded-[40px]" />
        <div className="w-[420px] bg-slate-800/30 rounded-[40px]" />
      </div>
    </div>
  );
}
