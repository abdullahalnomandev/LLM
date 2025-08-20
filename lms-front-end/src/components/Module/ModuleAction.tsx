import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ModuleActionProps {
  viewMode: "table" | "modules";
  setViewMode: (mode: "table" | "modules") => void;
  courseId: string;
}

export default function ModuleAction({
  viewMode,
  setViewMode,
  courseId,
}: ModuleActionProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
      <div className="flex items-center w-full sm:w-auto">
        <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
          <button
            onClick={() => setViewMode("modules")}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === "modules"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Module View
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === "table"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Table View
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
        <Link href={`/admin/course/${courseId}/module/new`}>
          <button className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base flex-1 sm:flex-initial justify-center">
            <Plus className="w-4 h-4" />
            <span>Add Module</span>
          </button>
        </Link>

      </div>
    </div>
  );
}
