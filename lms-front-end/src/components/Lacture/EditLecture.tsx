"use client";

import { updateLecture } from "@/services/lectureService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormHeader from "../UI/FormHeader";
import { ILecture } from "@/types/lecture";
import Breadcrumb from "../UI/Breadcrumb";

interface LectureFormData {
  title: string;
  video_url: string;
  pdf_nodes: File[];
}

const initialFormData: LectureFormData = {
  title: "",
  video_url: "",
  pdf_nodes: [],
};

export default function EditLecture({ lecture }: { lecture: ILecture }) {
  const { module_id, course_id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<LectureFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);

  // ✅ Populate form with lecture data on mount
  useEffect(() => {
    if (lecture) {
      setFormData({
        title: lecture.title || "",
        video_url: lecture.video_url || "",
        pdf_nodes: [], // keep empty, only add when user uploads new PDFs
      });
      setPdfUrls(lecture.pdf_nodes || []);
    }
  }, [lecture]);

  // ✅ Input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value, files } = e.target as HTMLInputElement;
    if (type === "file" && files) {
      setFormData((prev) => ({
        ...prev,
        pdf_nodes: [...prev.pdf_nodes, ...Array.from(files)],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const removePdf = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pdf_nodes: prev.pdf_nodes.filter((_, i) => i !== index),
    }));
  };

  // ✅ Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.video_url.trim())
      newErrors.video_url = "Video URL is required";

    if (formData.pdf_nodes.length > 0) {
      formData.pdf_nodes.forEach((file, idx) => {
        if (file.type !== "application/pdf") {
          newErrors.pdf_nodes = `File ${idx + 1} must be a PDF`;
        }
        if (file.size > 5 * 1024 * 1024) {
          newErrors.pdf_nodes = `File ${idx + 1} exceeds 5MB`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Cloudinary Upload
  const handleUploadCloudinary = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadFormData,
    });

    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
    const result = await response.json();

    if (result.success && result.urls?.length > 0) {
      return result.urls[0];
    } else {
      throw new Error(result.error || "Upload failed");
    }
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsUploading(true);
    try {
      // Upload new PDFs
      const uploadedUrls: string[] = [];
      for (const pdf of formData.pdf_nodes) {
        const url = await handleUploadCloudinary(pdf);
        uploadedUrls.push(url);
      }

      // Combine old + new PDF URLs
      const finalPdfUrls = [...pdfUrls, ...uploadedUrls];
      setPdfUrls(finalPdfUrls);

      // Update lecture
      const updatedLecture = await updateLecture(lecture._id, {
        module_id: Array.isArray(module_id) ? module_id[0] : module_id,
        title: formData.title,
        video_url: formData.video_url,
        pdf_nodes: finalPdfUrls,
      });

      if (updatedLecture) {
        toast.success("Lecture updated successfully!", {
          className: "p-2 w-[400px] bg-blue-500 text-white",
        });
        router.push(`/admin/course/${course_id}/module/edit/${module_id}`);
      }
    } catch (err: any) {
      setErrors({ submit: err.message || "Failed to update lecture" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl bg-white p-6 sm:p-8 rounded-xl">
      <Breadcrumb
        items={[
          { label: "Courses", href: "/admin/course" },
          { label: "Modules", href: `/admin/course/${course_id}` },
          {
            label: "Edit Module",
            href: `/admin/course/${course_id}/module/edit/${module_id}`,
          },
          { label: "Edit Lecture" },
        ]}
        showHome
      />
      <div className="bg-white rounded-xl mt-4 shadow-lg border border-gray-100 overflow-hidden">
        <FormHeader title="Edit Lecture" description="Update module details" />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isUploading}
              placeholder="Lecture title"
              className={`block w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Video URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              disabled={isUploading}
              placeholder="https://www.youtube.com/..."
              className={`block w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.video_url ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.video_url && (
              <p className="text-red-500 text-sm mt-1">{errors.video_url}</p>
            )}
          </div>

          {/* PDFs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload PDFs
            </label>
            <input
              type="file"
              name="pdf_nodes"
              accept="application/pdf"
              multiple
              onChange={handleChange}
              disabled={isUploading}
              className={`block w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.pdf_nodes ? "border-red-500" : "border-gray-300"
              }`}
            />

            {/* PDF Preview */}
            {formData.pdf_nodes.length > 0 && (
              <ul className="mt-2 border border-gray-200 rounded-md p-2 bg-gray-50">
                {formData.pdf_nodes.map((file, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center py-1 px-2 bg-white rounded mb-1"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removePdf(idx)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Existing PDFs */}
            {pdfUrls.length > 0 && (
              <ul className="mt-2 border border-gray-200 rounded-md p-2 bg-gray-50">
                {pdfUrls.map((url, idx) => (
                  <li key={idx} className="text-sm text-blue-600 truncate">
                    {url}
                  </li>
                ))}
              </ul>
            )}

            {errors.pdf_nodes && (
              <p className="text-red-500 text-sm mt-1">{errors.pdf_nodes}</p>
            )}
          </div>

          {/* Submit */}
          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}
          <button
            type="submit"
            disabled={isUploading}
            className={`block w-full text-white cursor-pointer text-sm font-medium py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? "Uploading..." : "Save Lecture"}
          </button>
        </form>
      </div>
    </div>
  );
}
