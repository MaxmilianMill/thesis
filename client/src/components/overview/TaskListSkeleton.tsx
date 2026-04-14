import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SKELETON_ROW_COUNT = 5;

export function TaskListSkeleton() {
  return (
    <SkeletonTheme baseColor="hsl(207 100% 10%)" highlightColor="hsl(207 100% 16%)">
      <div className="flex flex-col gap-2">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
          <Skeleton key={i} height={44} borderRadius={8} />
        ))}
      </div>
    </SkeletonTheme>
  );
}
