
export const CourseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse flex flex-col">
      {/* Thumbnail skeleton */}
      <div className="relative w-full h-48 bg-gray-200" />

      {/* Content skeleton */}
      <div className="p-6 flex flex-col flex-grow space-y-2">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
