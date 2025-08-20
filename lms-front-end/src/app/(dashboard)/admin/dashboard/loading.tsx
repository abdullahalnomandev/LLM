// app/admin/loading.tsx

export default function AdminDashboardLoading() {
    return (
      <div>
        {/* Summary Cards Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 px-0">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white shadow rounded-lg p-6 flex items-center gap-4 flex-1"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-12 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Recent Courses Table Skeleton */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-7 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
          
          <div className="w-full text-left">
            <div className="border-b border-gray-200 pb-3 mb-3">
              <div className="grid grid-cols-12 gap-4">
                {[1, 2, 3, 4].map((col) => (
                  <div
                    key={col}
                    className="h-4 bg-gray-300 rounded col-span-3 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100"
                >
                  <div className="col-span-3">
                    <div className="w-20 h-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="col-span-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="col-span-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mt-2 animate-pulse"></div>
                  </div>
                  <div className="col-span-3">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }