export default function LoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-5">
      {/* Form title skeleton */}
      <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse mb-4"></div>

      {/* Title input skeleton */}
      <div className="space-y-1">
        <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div> {/* Label */}
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div> {/* Input */}
      </div>

      {/* Course dropdown skeleton */}
      <div className="space-y-1">
        <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div> {/* Label */}
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div> {/* Select */}
      </div>

      {/* Submit button skeleton */}
      <div className="h-10 w-32 bg-gray-300 rounded-lg animate-pulse mt-2"></div>
    </div>
  );
}
