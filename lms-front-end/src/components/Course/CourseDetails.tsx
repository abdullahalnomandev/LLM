/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Course } from "@/types/course";
import { IModule } from "@/types/module";
import {
  FaStar,
  FaUsers,
  FaAward,
  FaCheckCircle,
  FaStarHalfAlt,
} from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import { CgCalendar } from "react-icons/cg";
import { Book, FileText, GripVertical, VideoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Collapse from "../UI/Collapse";

interface CourseDetailsProps {
  courseDetails: Course;
  modules: IModule[];
}

const staticReviews = [
  {
    id: 1,
    name: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Excellent course! The explanations are clear and the projects are practical. Highly recommended for anyone looking to advance their skills.",
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    rating: 5,
    date: "1 month ago",
    comment:
      "This course exceeded my expectations. The instructor explains complex concepts in an easy-to-understand way.",
  },
];

const courseFeatures = [
  "Lifetime access to course materials",
  "30-day money-back guarantee",
  "Certificate of completion",
  "Access to private student community",
];

export default function CourseDetails({
  courseDetails,
  modules,
}: CourseDetailsProps) {
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(null);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      const halfFilled = i === Math.floor(rating) && rating % 1 !== 0;
      if (halfFilled) {
        return <FaStarHalfAlt key={i} className="w-4 h-4 text-yellow-400" />;
      }
      return (
        <FaStar
          key={i}
          className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
        />
      );
    });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              {courseDetails.title}
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              {courseDetails.description}
            </p>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 font-bold text-lg">4.8</span>
                <div className="flex space-x-1">{renderStars(4.8)}</div>
                <span className="text-blue-200">(2,547 ratings)</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUsers className="w-5 h-5 text-blue-300" />
                <span className="text-blue-100">8,932 students</span>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="relative mb-6 rounded-xl overflow-hidden">
                <img
                  src={courseDetails.thumbnail}
                  alt={courseDetails.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>

              <Link href={`/lecture/${courseDetails?._id}`}>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 mb-6 cursor-pointer">
                  Enroll Now
                </button>
              </Link>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaAward className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Modules</span>
                  </span>
                  <span className="font-semibold text-gray-900">
                    {courseDetails.module}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaRegCirclePlay className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Lectures</span>
                  </span>
                  <span className="font-semibold text-gray-900">
                    {courseDetails.lecture}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CgCalendar className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Created Date:</span>
                  </span>
                  <span className="font-semibold text-gray-900">
                    {new Date(courseDetails?.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Course Modules Collapse */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-600">
              Course content
            </h2>
            <div className="divide-y divide-gray-200 rounded-xl bg-white shadow-sm border border-gray-100">
              {modules.map((module, moduleIndex) => (
                <div key={module._id} className="group">
                  <Collapse
                    title={
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500">
                            {moduleIndex + 1}
                          </span>
                          <h3 className="font-semibold text-gray-900">
                            {module.title}
                          </h3>
                        </div>
                      </div>
                    }
                  >
                    <div className="bg-gray-50">
                      {module?.lectures?.map((lecture, lectureIndex) => (
                        <div
                          key={lecture._id}
                          className="flex items-center gap-4 px-6 py-3  hover:bg-gray-50 transition-colors"
                        >
                          {/* Index */}
                          <span className="text-sm text-gray-400 w-12 text-right">
                            {moduleIndex + 1}.{lectureIndex + 1}
                          </span>

                          {/* Icon + Title */}
                          <div className="flex items-center gap-2 flex-1">
                            <VideoIcon className="w-4 h-4 text-blue-600" />
                            <h4 className="text-sm font-medium text-gray-900">
                              {lecture.title}
                            </h4>
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
                  <p className="text-gray-500">No modules created yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-3xl font-bold mb-8 text-blue-600">
              Student feedback
            </h2>
            <div className="space-y-8">
              {staticReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-6 last:border-b-0"
                >
                  <div className="flex items-start space-x-4">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      width={56}
                      height={56}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {review.name}
                        </h4>
                        <div className="flex space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Features */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-bold mb-6 text-blue-600">
              This course includes:
            </h3>
            <div className="space-y-4">
              {courseFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <FaCheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-bold mb-6 text-blue-600">
              Instructor
            </h3>
            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Instructor"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900">John Doe</h4>
                <p className="text-sm text-gray-500">
                  Senior Web Developer, 10+ years experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
