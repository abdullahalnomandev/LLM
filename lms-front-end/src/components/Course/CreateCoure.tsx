"use client";

import { createCourse } from "@/services/courseService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import FormHeader from "../UI/FormHeader";

// 🔹 JSON Array for Form Fields
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
  {
    name: "thumbnail",
    label: "Thumbnail",
    type: "file",
    required: true,
  },
];

export default function CreateCourse() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>(
    formFields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, files, value } = e.target as HTMLInputElement;

    if (type === "file" && files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error for the field on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    formFields.forEach((field) => {
      const value = formData[field.name];

      if (field.required) {
        if (field.type === "file") {
          if (!value) newErrors[field.name] = `${field.label} is required`;
        } else if (!value || value.toString().trim() === "") {
          newErrors[field.name] = `${field.label} is required`;
        }
      }

      if (field.name === "price" && value) {
        if (isNaN(Number(value)) || Number(value) < 0) {
          newErrors[field.name] = "Price must be a valid non-negative number";
        }
      }

      if (field.name === "thumbnail" && value) {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(value.type)) {
          newErrors[field.name] =
            "Thumbnail must be a JPG, PNG image or PDF file";
        }

        // Check file size (max 5MB)
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
      // Client-side upload
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.urls && result.urls.length > 0) {
        return result.urls[0]; // Return the first uploaded URL
      } else {
        throw new Error(result.error || "Upload failed");
      }
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
      let thumbnailUrl = "";

      // If there's a thumbnail file, upload it to Cloudinary first
      if (formData.thumbnail && formData.thumbnail instanceof File) {
        const uploadResult = await handleUploadCloudinary(formData.thumbnail);
        if (!uploadResult) throw new Error("Failed to upload thumbnail");
        thumbnailUrl = uploadResult;
        if (!thumbnailUrl) {
          throw new Error("Failed to upload thumbnail");
        }
      }

      // Prepare the final form data for course creation
      const courseData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        thumbnail: thumbnailUrl, // Use the Cloudinary URL
      };

      const data = await createCourse(courseData);

      if (data._id) {
        router.push(`/admin/course/${data?._id}/module/new`);
        toast.success("Course created successfully", {
          closeButton: false,
          className: "p-2 w-[400px]  bg-blue-500 text-white",
          ariaLabel: "Course deleted",
        });
      }
      setFormData(
        formFields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
      );
    } catch (error: any) {
      console.error("Error creating course:", error);
      setErrors({ submit: error.message || "Failed to create course" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl ">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <FormHeader
          title="Publish New Course"
          description="Update module details"
        />

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
                  value={formData[field.name]}
                  onChange={handleChange}
                  rows={field.rows || 3}
                  disabled={isUploading}
                  className={`block w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none ${
                    errors[field.name] ? "border-red-500" : "border-gray-300"
                  } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              ) : field.type === "file" ? (
                <input
                  type="file"
                  name={field.name}
                  accept="image/*"
                  onChange={handleChange}
                  disabled={isUploading}
                  className={`block w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 ${
                    errors[field.name] ? "border-red-500" : "border-gray-300"
                  } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={isUploading}
                  className={`block w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
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

          {/* Display general submit error */}
          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isUploading}
            className={`block w-full text-white text-sm font-medium py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {isUploading ? "Creating Course..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
