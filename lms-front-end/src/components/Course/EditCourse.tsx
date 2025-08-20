"use client";

import { Course } from "@/types/course";
import { useState } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { updateCourse } from "@/services/courseService";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Breadcrumb from "../UI/Breadcrumb";
import FormHeader from "../UI/FormHeader";

const formFields = [
  {
    name: "title",
    label: "Course Title",
    type: "text",
    placeholder: "Enter course title",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter course description",
    rows: 4,
    required: true,
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    placeholder: "Enter course price",
    required: true,
  },
  { name: "thumbnail", label: "Thumbnail", type: "file", required: false },
];

export default function EditCourse({ course }: { course: Course }) {
  const router = useRouter();

  const [formData, setFormData] = useState<Record<string, any>>({
    title: course?.title || "",
    description: course?.description || "",
    price: course?.price || "",
    thumbnail: course?.thumbnail || "", // existing thumbnail URL
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    course?.thumbnail || null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, files, value } = e.target as HTMLInputElement;

    if (type === "file" && files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      // Create preview for the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const removeImage = () => {
    setFormData({ ...formData, thumbnail: "" });
    setPreviewImage(null);

    // Reset file input
    const fileInput = document.querySelector(
      'input[name="thumbnail"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    formFields.forEach((field) => {
      const value = formData[field.name];

      if (
        field.required &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }

      if (field.name === "price" && value) {
        if (isNaN(Number(value)) || Number(value) < 0) {
          newErrors[field.name] = "Price must be a valid non-negative number";
        }
      }

      if (field.name === "thumbnail" && value && value instanceof File) {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        if (!allowedTypes.includes(value.type)) {
          newErrors[field.name] =
            "Thumbnail must be a valid image file (JPEG, PNG, WebP)";
        }

        const maxSize = 5 * 1024 * 1024;
        if (value.size > maxSize) {
          newErrors[field.name] = "File size must be less than 5MB";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUploadCloudinary = async (file: File): Promise<string | null> => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      if (!response.ok)
        throw new Error(`Upload failed: ${response.statusText}`);

      const result = await response.json();
      return result.success && result.urls && result.urls.length > 0
        ? result.urls[0]
        : null;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsUploading(true);

    try {
      let thumbnailUrl = formData.thumbnail;

      // If user selected a new file, upload it
      if (formData.thumbnail instanceof File) {
        const uploadResult = await handleUploadCloudinary(formData.thumbnail);
        if (!uploadResult) throw new Error("Failed to upload thumbnail");
        thumbnailUrl = uploadResult;
      }

      const courseData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        thumbnail: thumbnailUrl,
      };

      const updatedCourse = await updateCourse(course._id, courseData);
      if (updatedCourse) {
        toast("Successfully updated!", {
          closeButton: false,
          className: "p-0 w-[400px] border border-blue-600/40",
          ariaLabel: "Course updated",
        });
        router.push("/admin/course");
      }
    } catch (error: any) {
      console.error("Error updating course:", error);
      setErrors({ submit: error.message || "Failed to update course" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-md">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/admin/course" },
          { label: "Edit Course" },
        ]}
        showHome={true}
      />

      <ToastContainer
        position="top-right"
        autoClose={300}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="bg-white rounded-xl mt-4  border border-gray-100 overflow-hidden">
        <FormHeader title="Edit Course " description="Update course details" />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  rows={field.rows || 3}
                  disabled={isUploading}
                  className={`block w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
                    errors[field.name] ? "border-red-500" : "border-gray-300"
                  } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              ) : field.type === "file" ? (
                <div className="space-y-3">
                  {/* Current/Preview Image */}
                  {previewImage && (
                    <div className="relative inline-block">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={previewImage}
                          alt="Course thumbnail preview"
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        disabled={isUploading}
                      >
                        <IoClose className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* File Input */}
                  <input
                    type="file"
                    name={field.name}
                    accept="image/*"
                    onChange={handleChange}
                    disabled={isUploading}
                    className={`block w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 ${
                      errors[field.name] ? "border-red-500" : "border-gray-300"
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  />

                  <p className="text-xs text-gray-500">
                    {previewImage
                      ? "Choose a new image to replace the current one"
                      : "Choose an image file (JPEG, PNG, WebP, max 5MB)"}
                  </p>
                </div>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  disabled={isUploading}
                  className={`block w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors[field.name] ? "border-red-500" : "border-gray-300"
                  } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              )}

              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className={`block w-full text-white text-sm font-medium py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {isUploading ? "Updating Course..." : "Update Course"}
          </button>
        </form>
      </div>
    </div>
  );
}
