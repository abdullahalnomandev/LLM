export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-6 w-1/3 rounded bg-gray-200"></div>

      {/* Paragraph skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-gray-200"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200"></div>
        <div className="h-4 w-2/3 rounded bg-gray-200"></div>
      </div>

      {/* List skeleton */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 w-full rounded bg-gray-200"></div>
        ))}
      </div>
    </div>
  );
}
