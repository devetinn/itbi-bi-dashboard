export function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-[#E8E6DF] rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64 bg-[#E8E6DF] rounded-2xl" />
        <div className="h-64 bg-[#E8E6DF] rounded-2xl" />
      </div>
      <div className="h-52 bg-[#E8E6DF] rounded-2xl" />
      <p className="text-center text-xs text-[#8A8A8A] animate-pulse">Processando registros...</p>
    </div>
  )
}
