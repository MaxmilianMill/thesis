import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function SummarySkeleton() {
  return (
    <SkeletonTheme baseColor="hsl(207 100% 10%)" highlightColor="hsl(207 100% 16%)">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-5 px-4 py-8">
        {/* MotivationalQuote */}
        <Skeleton height={80} borderRadius={12} />

        {/* KPI cards row */}
        <div className="flex gap-3">
          <Skeleton height={80} borderRadius={12} containerClassName="flex-1" />
          <Skeleton height={80} borderRadius={12} containerClassName="flex-1" />
          <Skeleton height={80} borderRadius={12} containerClassName="flex-1" />
        </div>

        {/* Tabs bar */}
        <Skeleton height={40} borderRadius={8} />

        {/* Tab content rows */}
        <div className="flex flex-col gap-3">
          <Skeleton height={24} borderRadius={6} width="60%" />
          <Skeleton height={64} borderRadius={8} />
          <Skeleton height={24} borderRadius={6} width="45%" />
          <Skeleton height={64} borderRadius={8} />
          <Skeleton height={24} borderRadius={6} width="55%" />
          <Skeleton height={64} borderRadius={8} />
        </div>
      </div>
    </SkeletonTheme>
  );
}
