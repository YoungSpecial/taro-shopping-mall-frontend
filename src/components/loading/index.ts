// 加载状态和骨架屏组件导出

// 产品卡片骨架屏
export { default as ProductCardSkeleton } from './ProductCardSkeleton';
export { WeappProductCardSkeleton, H5ProductCardSkeleton, ProductGridSkeleton, ProductListSkeleton } from './ProductCardSkeleton';

// 加载指示器
export { default as LoadingSpinner } from './LoadingSpinner';
export { WeappLoadingSpinner, H5LoadingSpinner, ProgressBar, SkeletonText, SkeletonRect, SkeletonCircle } from './LoadingSpinner';

// 加载状态管理器
export { default as LoadingManager } from './LoadingManager';
export { useLoading, withLoading, LoadingWrapper, WeappLoadingManager, H5LoadingManager } from './LoadingManager';

// 类型导出
export type { ProductCardSkeletonProps } from './ProductCardSkeleton';
export type { LoadingSpinnerProps } from './LoadingSpinner';
export type { LoadingState, LoadingContextType, LoadingManagerProps } from './LoadingManager';