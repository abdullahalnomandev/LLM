'use client'; // add this at the top

import Image from 'next/image';
import Link from 'next/link';
import { getUserInfo } from '@/services/auth.Service';
import { IUserInfo } from '@/types/userInfo';
import { useEffect, useState } from 'react';

type CourseType = {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  module: number;
  lecture: number;
  price: number;
};

interface AllCourseCardProps {
  courses: CourseType[];
}

export default function AllCourseCard({ courses }: AllCourseCardProps) {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info as IUserInfo);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-4">All Courses</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {(courses ?? []).map(
          ({ _id, thumbnail, title, description, module, lecture, price }) => (
            <div
              key={_id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Thumbnail */}
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={thumbnail}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>{module} Modules</span>
                  <span>{lecture} Lectures</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-blue-600">${price}</span>
                  <Link
                    href={
                      userInfo?.role === 'user'
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
  );
}
