"use client";

import { createModule } from "@/services/moduleService";
import { useState } from "react";
import { toast } from "react-toastify";
import FormHeader from "../UI/FormHeader";
import { useRouter } from "next/navigation";
import Breadcrumb from "../UI/Breadcrumb";

interface Course {
  _id: string;
  title: string;
}

interface Props {
  courseData: Course;
  courses: Course[];
}

const formFields = [
  {
    name: "title",
    label: "Module Title",
    type: "text",
    placeholder: "Enter module title",
    required: true,
  },
];

export default function CreateModule({ courseData }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    course: courseData?._id || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Module Title is required";
    if (!formData.course) newErrors.course = "Course is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const create = await createModule(formData);
      toast.success("Module created successfully");
      if (create) {
        router.push(
          `/admin/course/${courseData?._id}/module/edit/${create?._id}`
        );
      }
      setFormData({ title: "", course: courseData?._id || "" });
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to create module" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl bg-white p-6 sm:p-8  ">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/admin/course" },
          { label: "Modules", href: `/admin/course/${courseData._id}` },
          { label: "Create Module" },
        ]}
        showHome={true}
      />
      <div className="bg-white rounded-xl mt-4 shadow-lg border border-gray-100 overflow-hidden">
        <FormHeader
          title="Create New Module"
          description="Create a new module for your course. Fill in the module details below."
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          }
        />
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={
                  field.name === "title" ? formData.title : formData.course
                }
                onChange={handleChange}
                disabled={isSubmitting}
                className={`block w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* Course Dropdown */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Course <span className="text-red-500">*</span>
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              disabled={isSubmitting || courses.length === 0}
              className={`block w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.course ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Select a Course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
            {errors.course && (
              <p className="text-red-500 text-sm mt-1">{errors.course}</p>
            )}
          </div> */}

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`block w-full text-white text-sm font-medium py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {isSubmitting ? "Creating Module..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
