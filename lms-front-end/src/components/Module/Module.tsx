"use client";
import {
  Edit3,
  Trash2,
  FileText,
  Video,
  GripVertical,
  Book,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ModuleAction from "./ModuleAction";
import { IModule } from "@/types/module";
import LectureTable from "./LectureTable";
import Collapse from "../UI/Collapse";
import Breadcrumb from "../UI/Breadcrumb";

type ViewMode = "modules" | "table";

export default function ModuleLectureManagement({
  courseId,
  allModules: modules,
}: {
  courseId: string;
  allModules: IModule[];
}) {
  // const [modules, setModules] = useState<IModule[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("modules");
  // Get lecture icon
  const getLectureIcon = () => <Video className="w-4 h-4 text-blue-500" />;

useEffect(() => {
  // Smooth scroll to top when component mounts
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}, []) 
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/admin/course" },
          { label: "Modules"},
        ]}
        showHome={true}
      />
      <div className="max-w-7xl mx-auto mt-4">
        {/* View Toggle and Action Buttons */}
        <ModuleAction
          viewMode={viewMode}
          setViewMode={setViewMode}
          courseId={courseId}
        />

        {viewMode === "modules" ? (
          // Table View
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Course Content
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {modules.length} modules •{" "}
                {modules.reduce(
                  (total, module) => total + (module.lectures?.length || 0),
                  0
                )}{" "}
                lectures
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {modules.map((module, moduleIndex) => (
                <div key={module._id} className="group">
                  <Collapse
                    title={
                      <div className="flex items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600">
                            <GripVertical className="w-4 h-4 cursor-grab" />
                            <span className="text-sm font-medium">
                              {moduleIndex + 1}
                            </span>
                          </div>

                          <h3 className="font-semibold text-gray-900">
                            {module.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/course/${courseId}/module/edit/${module._id}`}
                          >
                            <button className="p-2 cursor-pointer text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    }
                  >
                    <div className="bg-gray-50 ">
                      {module?.lectures?.map((lecture, lectureIndex) => (
                        <div
                          key={lecture._id}
                          className="flex border border-b border-gray-200 items-center gap-4 px-6 py-3 
                          hover:bg-gray-100 transition-colors group/lecture "
                        >
                          <div className="flex items-center gap-2 text-gray-400 ml-6">
                            <GripVertical className="w-3 h-3 cursor-grab opacity-0 group-hover/lecture:opacity-100" />
                            <span className="text-sm">
                              {moduleIndex + 1}.{lectureIndex + 1}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-1">
                            {getLectureIcon()}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {lecture.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="capitalize">Video</span>
                                <span>•</span>
                                <a
                                  href={lecture.video_url}
                                  target="_blank"
                                  className="underline text-gray-500-600"
                                >
                                  Watch Video
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover/lecture:opacity-100 transition-opacity">
                            <Link
                              href={`/admin/course/${courseId}/module/${module?._id}/lecture/edit/${lecture._id}`}
                            >
                              <button className="p-2 cursor-pointer text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </Link>
                            <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {module.lectures?.length === 0 && (
                        <div className="px-6 py-8 text-center">
                          <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">
                            No lectures in this module yet
                          </p>
                        </div>
                      )}
                    </div>
                  </Collapse>
                </div>
              ))}

              {modules.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No modules created yet</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Module View
          <LectureTable />
        )}
      </div>
    </div>
  );
}
