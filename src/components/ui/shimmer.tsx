import { cn } from '@/lib/utils';

const shimmerClass = 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent';

function Shimmer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl bg-muted', shimmerClass, className)}
      {...props}
    />
  );
}

/** Stat card shimmer */
function ShimmerStatCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-card p-6 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-4 w-4 rounded-md" />
      </div>
      <Shimmer className="h-8 w-20" />
    </div>
  );
}

/** List item / appointment card shimmer */
function ShimmerListItem({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 p-4 rounded-xl border border-border', className)}>
      <Shimmer className="h-12 w-12 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-3/5" />
        <Shimmer className="h-3 w-2/5" />
      </div>
      <Shimmer className="h-6 w-16 rounded-full" />
    </div>
  );
}

/** Profile / avatar shimmer */
function ShimmerProfile({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-card p-6', className)}>
      <div className="flex items-center gap-6 mb-6">
        <Shimmer className="h-20 w-20 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Shimmer className="h-5 w-40" />
          <Shimmer className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-10 w-full" />
        </div>
        <Shimmer className="h-10 w-full" />
        <Shimmer className="h-10 w-full" />
        <Shimmer className="h-10 w-full" />
      </div>
    </div>
  );
}

/** Card grid item shimmer */
function ShimmerCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-card p-5 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Shimmer className="h-12 w-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <Shimmer className="h-5 w-16 rounded-full" />
        <Shimmer className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

/** Table row shimmer */
function ShimmerTableRow({ cols = 4, className }: { cols?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 py-3 px-4 border-b border-border', className)}>
      {Array.from({ length: cols }).map((_, i) => (
        <Shimmer key={i} className={cn('h-4 flex-1', i === 0 && 'max-w-[200px]')} />
      ))}
    </div>
  );
}

/** Doctor search result card shimmer */
function ShimmerDoctorCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-card p-5 space-y-3', className)}>
      <div className="flex gap-3">
        <Shimmer className="h-14 w-14 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-3 w-1/2" />
          <Shimmer className="h-3 w-1/3" />
        </div>
      </div>
      <div className="flex gap-1.5">
        <Shimmer className="h-4 w-12 rounded-full" />
        <Shimmer className="h-4 w-14 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-4 w-16" />
      </div>
      <Shimmer className="h-9 w-full rounded-md" />
    </div>
  );
}

/** Chat sidebar shimmer */
function ShimmerChatItem({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 p-3 border-b border-border', className)}>
      <Shimmer className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-3.5 w-24" />
        <Shimmer className="h-3 w-32" />
      </div>
    </div>
  );
}

/** Review shimmer */
function ShimmerReview({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border p-4 space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Shimmer className="h-4 w-24" />
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-3.5 w-3.5 rounded-sm" />
          ))}
        </div>
        <Shimmer className="h-3 w-16 ml-auto" />
      </div>
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-4/5" />
    </div>
  );
}

/** Notification shimmer */
function ShimmerNotification({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-card p-4 border-l-4 border-l-muted space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Shimmer className="h-5 w-20 rounded-full" />
        <Shimmer className="h-8 w-8 rounded-md" />
      </div>
      <Shimmer className="h-4 w-3/5" />
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-16 ml-auto" />
    </div>
  );
}

export {
  Shimmer,
  ShimmerStatCard,
  ShimmerListItem,
  ShimmerProfile,
  ShimmerCard,
  ShimmerTableRow,
  ShimmerDoctorCard,
  ShimmerChatItem,
  ShimmerReview,
  ShimmerNotification,
};
