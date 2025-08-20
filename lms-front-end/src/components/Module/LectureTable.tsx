"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  GripVertical,
  Search,
  Video,
  X,
} from "lucide-react";
import { getLectures } from "@/services/lectureService";
import { getCourses } from "@/services/courseService";
import { Course } from "@/types/course";
import { IModule } from "@/types/module";
import { ILecture } from "@/types/lecture";
import {  getModules } from "@/services/moduleService";

interface Filters {
  courseId: string;
  moduleId: string;
  searchTerm: string;
}

const INITIAL_FILTERS: Filters = {
  courseId: "all",
  moduleId: "all",
  searchTerm: "",
};

export default function LectureTable() {
  const [lectures, setLectures] = useState<ILecture[]>([]);
  const [modules, setModules] = useState<IModule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [loading, setLoading] = useState({
    lectures: true,
    courses: true,
    modules: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    filters.searchTerm
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearchTerm(filters.searchTerm),
      300
    );
    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  // Fetch lectures
// Fetch lectures
const fetchLectures = useCallback(async () => {
  try {
    setLoading((prev) => ({ ...prev, lectures: true }));
    setError(null);

    // Find course title by ID
    const selectedCourse =
      filters.courseId === "all"
        ? null
        : courses.find((c) => c._id === filters.courseId);

    // Find module title by ID
    const selectedModule =
      filters.moduleId === "all"
        ? null
        : modules.find((m) => m._id === filters.moduleId);

    const params = {
      "module_id.course.title": selectedCourse ? selectedCourse.title : "",
      "module_id.title": selectedModule ? selectedModule.title : "",
      searchTerm: debouncedSearchTerm,
    };

    const data = await getLectures(params);
    setLectures(data?.data || []);
  } catch (err) {
    setError("Failed to load lectures. Please try again.");
  } finally {
    setLoading((prev) => ({ ...prev, lectures: false }));
  }
}, [filters.courseId, filters.moduleId, debouncedSearchTerm, courses, modules]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading((prev) => ({ ...prev, courses: true }));
        const courseData = (await getCourses()) as Course[];
        setCourses(courseData || []);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading((prev) => ({ ...prev, courses: false }));
      }
    };
    fetchCourses();
  }, []);

  // Fetch modules when course changes
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading((prev) => ({ ...prev, modules: true }));

        let moduleData: IModule[] = [];
        if (filters.courseId === "all") {
          // Fetch all modules
          moduleData = await getModules(filters.courseId);
        } else {
          // Fetch modules for selected course
          moduleData = await getModules(filters.courseId);
        }
        setModules(moduleData || []);

        // Reset module if current module not in new list
        if (
          filters.moduleId !== "all" &&
          !moduleData.some((m) => m._id === filters.moduleId)
        ) {
          setFilters((prev) => ({ ...prev, moduleId: "all" }));
        }
      } catch (err) {
      } finally {
        setLoading((prev) => ({ ...prev, modules: false }));
      }
    };
    fetchModules();
  }, [filters.courseId,filters.moduleId]);

  // Available modules
  const availableModules = useMemo(() => {
    return filters.courseId === "all"
      ? modules
      : modules.filter(
          (m) => (m?.course_id || m.course?._id) === filters.courseId
        );
  }, [modules, filters.courseId]);

  // Handlers
  const handleCourseChange = useCallback((courseId: string) => {
    setFilters((prev) => ({ ...prev, courseId, moduleId: "all" }));
  }, []);

  const handleModuleChange = useCallback((moduleId: string) => {
    setFilters((prev) => ({ ...prev, moduleId }));
  }, []);

  const handleSearchChange = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      filters.courseId !== "all" ||
      filters.moduleId !== "all" ||
      filters.searchTerm.trim() !== "",
    [filters]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Filters */}
      <div className="bg-gray-50 border-b border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Course */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Course
            </label>
            <select
              value={filters.courseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          {/* Module */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Module
            </label>
            <select
              value={filters.moduleId}
              onChange={(e) => handleModuleChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm"
            >
              <option value="all">All Modules</option>
              { courses.length > 0 && modules.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 outline-none py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Search lectures..."
              />
              {filters.searchTerm && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`w-full px-4 py-2.5 text-sm font-medium cursor-pointer rounded-lg border transition-all ${
                hasActiveFilters
                  ? "text-gray-700 border-gray-300 bg-white hover:bg-gray-50"
                  : "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
              }`}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Lectures */}
      <div className="divide-y divide-gray-100">
        {lectures.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No lectures found</div>
        ) : (
          lectures.map((lecture, index) => (
            <div
              key={lecture._id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-3 text-gray-400 flex-shrink-0">
                <GripVertical className="w-4 h-4 cursor-grab" />
                <span className="text-sm font-semibold min-w-[2.5rem] text-center px-2 py-1 bg-gray-100 rounded-md">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                    {lecture.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {lecture.module_id?.title && (
                      <span>{lecture.module_id.title}</span>
                    )}
                    {lecture.module_id?.course?.title && (
                      <span>{lecture.module_id.course.title}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                {lecture.video_url ? (
                  <a
                    href={lecture.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100"
                  >
                    <Video className="w-4 h-4" /> Watch
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg border border-gray-200">
                    <Video className="w-4 h-4" /> No Video
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
