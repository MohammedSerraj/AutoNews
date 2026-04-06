import React from 'react';

const Skeleton = ({ className, height, width, circle }) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${circle ? 'rounded-full' : 'rounded'} ${className}`}
      style={{
        height: height || '1rem',
        width: width || '100%',
      }}
    />
  );
};

export const ArticleSkeleton = () => (
  <div className="flex flex-col space-y-4">
    <Skeleton height="200px" className="w-full" />
    <div className="space-y-2">
      <Skeleton height="1.5rem" width="90%" />
      <Skeleton height="1rem" width="40%" />
    </div>
  </div>
);

export const ArticleListSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ArticleSkeleton key={i} />
    ))}
  </div>
);

export const HorizontalArticleSkeleton = () => (
  <div className="flex items-start space-x-4 py-4 border-b border-gray-100">
    <Skeleton height="80px" width="80px" className="flex-shrink-0" />
    <div className="flex-grow space-y-2">
      <Skeleton height="1.25rem" width="80%" />
      <Skeleton height="0.875rem" width="100%" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton height="0.75rem" width="30%" />
        <Skeleton height="0.75rem" width="15%" />
      </div>
    </div>
  </div>
);

export default Skeleton;
