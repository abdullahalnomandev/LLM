export default function LectureFormSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Title Field */}
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>

          {/* Video URL Field */}
          <div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>

          {/* PDF Upload Field */}
          <div>
            <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
            <div className="mt-3 space-y-2">
              <div className="h-8 w-full bg-gray-200 rounded"></div>
              <div className="h-8 w-5/6 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="h-10 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
