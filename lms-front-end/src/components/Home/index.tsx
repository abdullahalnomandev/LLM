"use client"; // Make this a client component

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiPlay,
  HiArrowRight,
  HiAcademicCap,
  HiLightBulb,
  HiTrendingUp,
} from "react-icons/hi";

import { getUserInfo } from "@/services/auth.Service";
import { getCourses } from "@/services/courseService";
import { IUserInfo } from "@/types/userInfo";

export default function Home() {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserInfo = () => {
      const info = getUserInfo();
      setUserInfo(info as IUserInfo);
    };

    const fetchCourses = async () => {
      const allCourses = await getCourses();
      setCourses(allCourses);
    };

    fetchUserInfo();
    fetchCourses();
  }, []);

  const features = [
    {
      icon: HiAcademicCap,
      title: "Expert Instructors",
      description:
        "Learn from industry professionals with years of real-world experience",
    },
    {
      icon: HiLightBulb,
      title: "Interactive Learning",
      description: "Hands-on projects and exercises to reinforce your learning",
    },
    {
      icon: HiTrendingUp,
      title: "Career Growth",
      description: "Skills that matter in today's competitive job market",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Students Enrolled" },
    { number: "200+", label: "Expert Instructors" },
    { number: "1,000+", label: "Courses Available" },
    { number: "95%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div
          className="relative mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28"
          style={{ maxWidth: "1280px" }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Master New Skills
                  <span className="block text-yellow-400">
                    Advance Your Career
                  </span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Join thousands of learners worldwide. Access high-quality
                  courses taught by industry experts and transform your future
                  today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <button className="px-8 py-4 cursor-pointer bg-yellow-400 text-blue-900 rounded-xl font-semibold text-lg hover:bg-yellow-300 transition-colors duration-200 flex items-center justify-center space-x-2">
                    <HiPlay className="w-5 h-5" />
                    <span>Start Learning</span>
                  </button>
                </Link>
                <Link href="/courses">
                  <button className="px-8 py-4 cursor-pointer border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all duration-200">
                    Browse Courses
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-blue-700">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                      {stat.number}
                    </div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Students learning"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <HiAcademicCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">5,000+</div>
                      <div className="text-sm text-gray-600">
                        Certificates Earned
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: "1280px" }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EduMaster?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide the tools, resources, and community you need to succeed
              in your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-gray-50">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: "1280px" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Popular Courses
              </h2>
              <p className="text-xl text-gray-600">
                Discover our most loved courses by students worldwide
              </p>
            </div>
            <Link href="/courses">
              <button className="mt-4 cursor-pointer sm:mt-0 flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold">
                <span>View All Courses</span>
                <HiArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(courses ?? []).map(
              ({
                _id,
                thumbnail,
                title,
                description,
                module,
                lecture,
                price,
              }) => (
                <div
                  key={_id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={thumbnail}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {description}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>{module} Modules</span>
                      <span>{lecture} Lectures</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-blue-600">
                        ${price}
                      </span>
                      <Link
                        href={
                          userInfo?.role === "user"
                            ? `/course/${_id}`
                            : `/admin/course/${_id}`
                        }
                      >
                        <button className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                          Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ maxWidth: "1280px" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who have transformed their
            careers with our courses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <button className="px-8 cursor-pointer py-4 bg-yellow-400 text-blue-900 rounded-xl font-semibold text-lg hover:bg-yellow-300 transition-colors duration-200">
                Get Started Today
              </button>
            </Link>
            <Link href="/courses">
              <button className="px-8 py-4 border-2 cursor-pointer border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all duration-200">
                Browse All Courses
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
