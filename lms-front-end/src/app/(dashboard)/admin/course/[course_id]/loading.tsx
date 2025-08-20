import { GripVertical } from "lucide-react";

export default function ModuleLectureManagementSkeleton() {
  return (
    <div className="space-y-6">
      {/* Module Skeletons */}
      {[...Array(2)].map((_, moduleIndex) => (
        <div
          key={moduleIndex}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Module Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <GripVertical className="h-5 w-5 text-gray-300" />
              <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Lectures */}
          <div className="divide-y divide-gray-100">
            {[...Array(3)].map((_, lectureIndex) => (
              <div
                key={lectureIndex}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-gray-300" />
                  <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
