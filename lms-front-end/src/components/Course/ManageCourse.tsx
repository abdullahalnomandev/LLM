"use client";
import { deleteCourse } from "@/services/courseService";
import { Course } from "@/types/course";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiGrid,
  FiList,
  FiPlus,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import Breadcrumb from "../UI/Breadcrumb";

interface ManageCourseProps {
  courses: Course[];
}

type ViewMode = "grid" | "list";

export default function ManageCourse({ courses }: ManageCourseProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseList, setCourseList] = useState<Course[]>(courses);

  const handleCardClick = (id: string) => {
    router.push(`/admin/course/${id}`); // Navigate to Module & Lecture Management
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    router.push(`/admin/course/edit/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Add delete confirmation logic here
    const deleteOne = await deleteCourse(id);
    if (deleteOne) {
      setCourseList((prev) => prev.filter((course) => course._id !== id));
      toast.success("Course deleted successfully", {
        closeButton: false,
        className: "p-2 w-[400px]  bg-blue-500 text-white",
        ariaLabel: "Course deleted",
      });
    }
  };

  const filteredCourses =
    courseList?.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen  p-6">
      <ToastContainer
        position="top-right"
        autoClose={300} // set duration or false for manual close
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: "Manage Course" },
          ]}
          showHome={true}
        />

        {/* Top Bar */}
        <div className="mb-6 flex flex-col mt-7 lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Add Course Button */}
          <Link
            href="/admin/course/new"
            className="inline-flex items-center justify-center md:justify-start gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition w-full md:w-auto"
          >
            <FiPlus className="w-4 h-4" />
            New Course
          </Link>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-end gap-2 mb-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-md border transition ${
              viewMode === "grid"
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-gray-200 text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 rounded-md border transition ${
              viewMode === "list"
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-gray-200 text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Courses Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(course._id)}
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* Price */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-gray-900 font-semibold flex items-center gap-1 shadow">
                  ${course.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-grary-600 text-sm line-clamp-2">
                  {course.description}
                </p>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>{course.module} Modules</span>
                  <span>{course.lecture} Lectures</span>
                </div>
                <div className="flex gap-3 mt-4 px-1">
                  <button
                    onClick={(e) => handleEdit(e, course._id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 cursor-pointer bg-white text-blue-600 font-medium rounded-md border-2 border-blue-200 hover:bg-blue-50 active:bg-blue-100 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <FiEdit3 />
                    <span className="font-semibold">Edit</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, course._id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 font-medium rounded-md border-2 border-red-200 hover:bg-red-50 active:bg-red-100 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all cursor-pointer duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span className="font-semibold">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Course
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Price
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Modules
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Lectures
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr
                  key={course._id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td
                    className="py-4 px-6"
                    onClick={() => handleCardClick(course._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          width={64}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {course.title}
                        </h4>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{course.price}</td>
                  <td className="py-4 px-6">{course.module}</td>
                  <td className="py-4 px-6">{course.lecture}</td>
                  <td className="py-4 px-6 flex gap-2">
                    <button
                      onClick={(e) => handleEdit(e, course._id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, course._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCardClick(course._id)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm mt-6">
          <p className="text-gray-600">No courses found for your search.</p>
        </div>
      )}
    </div>
  );
}
