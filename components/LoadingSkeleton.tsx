import React from 'react';

export const SchoolCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
    </div>
    <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
      <div>
        <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="h-10 bg-gray-300 rounded w-28"></div>
    </div>
  </div>
);

export const SchoolListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <SchoolCardSkeleton key={i} />
    ))}
  </div>
);
