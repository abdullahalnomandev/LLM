"use client";

import { updateModule } from "@/services/moduleService";
import { IModule } from "@/types/module";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  BookOpen,
  Save,
  Plus,
  Award,
  Video,
  Edit3,
  Trash2,
  FileText,
} from "lucide-react";
import FormHeader from "../UI/FormHeader";
import Link from "next/link";
import { ILecture } from "@/types/lecture";
import Breadcrumb from "../UI/Breadcrumb";

const formFields = [
  {
    name: "title",
    label: "Module Title",
    type: "text",
    placeholder: "e.g., Introduction to Data Science",
    required: true,
    icon: BookOpen,
    description: "Enter a clear and descriptive title for the module",
  },
  {
    name: "module_number",
    label: "Module Number",
    type: "number",
    placeholder: "e.g., 1",
    required: true,
    icon: Award,
    description: "Sequential number for module ordering",
  },
];

interface EditModuleProps {
  moduleData: IModule;
  lectures: ILecture[];
}

export default function EditModule({
  moduleData,
  lectures = [],
}: EditModuleProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    formFields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]:
          field.name === "title"
            ? moduleData?.title || ""
            : field.name === "module_number"
            ? moduleData?.module_number || ""
            : "",
      }),
      {}
    )
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (moduleData) {
      setFormData({
        title: moduleData.title || "",
        module_number: moduleData.module_number || "",
      });
    }
  }, [moduleData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = "Module title is required";
    if (!formData.module_number)
      newErrors.module_number = "Module number is required";
    if (formData.module_number && formData.module_number < 1) {
      newErrors.module_number = "Module number must be positive";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await updateModule(moduleData._id, {
        title: formData.title.trim(),
        module_number: Number(formData.module_number),
      });

      if (response) {
        router.push(`/admin/course/${moduleData.course}`);
        toast.success("Module updated successfully", {
          closeButton: false,
          className:
            "p-4 w-[420px] bg-emerald-500 text-white font-medium rounded-lg shadow-lg",
        });
      }
    } catch (error: any) {
      setErrors({ submit: error.message || "Failed to update module" });
      toast.error("Failed to update module", {
        closeButton: false,
        className:
          "p-4 w-[420px] bg-red-500 text-white font-medium rounded-lg shadow-lg",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <Breadcrumb
        items={[
          { label: "Courses", href: "/admin/course"},
          { label: "Modules", href: `/admin/course/${moduleData.course}` },
          { label: "Edit Module" },
        ]}
        showHome={true}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Edit Module Form */}
        <div className="lg:w-3/4 w-full">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <FormHeader
              icon={<BookOpen />}
              title="Edit Module Configuration"
              description="Update module details"
            />

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {formFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.name} className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Icon className="h-4 w-4 mr-2 text-indigo-600" />
                      {field.label}
                      {field.required && (
                        <span
                          className="text-red-500 ml-1"
                          title="Required field"
                        >
                          *
                        </span>
                      )}
                    </label>

                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        errors[field.name]
                          ? "border-red-300 bg-red-50 focus:ring-red-200"
                          : "border-gray-300 bg-gray-50 hover:bg-white focus:bg-white"
                      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    />

                    {field.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {field.description}
                      </p>
                    )}

                    {errors[field.name] && (
                      <p className="text-red-600 text-sm font-medium flex items-center mt-1">
                        <span className="h-1 w-1 bg-red-600 rounded-full mr-2"></span>
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                );
              })}

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm font-medium">
                    {errors.submit}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed text-gray-700"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating Module...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Module
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Lecture List */}
        <div className="flex flex-col lg:w-2/3 w-full">
          {lectures?.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <FileText className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 mb-4">
                No lectures in this module yet
              </p>
              <Link
                href={`/admin/course/${moduleData?.course}/module/${moduleData._id}/lecture/create`}
              >
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-200 shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Lecture
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Lectures</h2>

              <Link
                href={`/admin/course/${moduleData?.course}/module/${moduleData._id}/lecture/create`}
              >
                <button className="inline-flex items-center px-2 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-200">
                  <Plus className="h-3 w-3 mr-1" />
                  Add New Lecture
                </button>
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {lectures.map((lecture: ILecture, lectureIndex) => (
              <div
                key={lecture._id}
                className="flex items-center border border-b border-gray-200 gap-4 px-6 py-3 hover:bg-gray-100 transition-colors group/lecture"
              >
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-sm">{lectureIndex + 1}</span>
                </div>

                <div className="flex items-center gap-3 flex-1">
                  <Video className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-gray-900">
                      {lecture.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover/lecture:opacity-100 transition-opacity">
                  <Link
                    href={`/admin/course/${moduleData?.course}/module/${moduleData?._id}/lecture/edit/${lecture?._id}`}
                  >
                    <button className="flex items-center justify-center p-2 cursor-pointer text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </Link>

                  <button className="flex items-center justify-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
