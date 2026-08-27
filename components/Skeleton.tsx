export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded-lg ${className}`} />;
}

export function KPICardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-8 w-28" />
          <Skeleton className="mt-3 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="border-b border-slate-800 px-5 py-4">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y divide-slate-800">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="grid grid-cols-5 gap-4 px-5 py-4">
            {Array.from({ length: 5 }).map((__, col) => (
              <Skeleton key={col} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
