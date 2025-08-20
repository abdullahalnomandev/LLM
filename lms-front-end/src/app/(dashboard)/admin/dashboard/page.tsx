import Image from "next/image";
import { getCourses } from "@/services/courseService";
import { FaBookOpen, FaUsers, FaRegChartBar } from "react-icons/fa";

export default async function AdminDashboardPage() {
  const courses = await getCourses(); // fetch all courses

  return (
    <div>
      {/* Summary Cards */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 px-0">
        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4 flex-1">
          <FaBookOpen className="text-3xl text-blue-500" />
          <div>
            <p className="text-gray-500">Courses</p>
            <p className="text-xl font-semibold">{courses.length}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4 flex-1">
          <FaUsers className="text-3xl text-green-500" />
          <div>
            <p className="text-gray-500">Students</p>
            <p className="text-xl font-semibold">11</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4 flex-1">
          <FaRegChartBar className="text-3xl text-purple-500" />
          <div>
            <p className="text-gray-500">Reports</p>
            <p className="text-xl font-semibold">N/A</p>
          </div>
        </div>
      </div>

      {/* Recent Courses Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Courses</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4">Thumbnail</th>
              <th className="py-2 px-4">Course Name</th>
              <th className="py-2 px-4">Desciption </th>
              <th className="py-2 px-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course: any) => (
              <tr
                key={course._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-2 px-4">
                  {course.thumbnail ? (
                    <div className="w-20 h-12 relative">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="py-2 px-4">{course.title}</td>
                <td className="py-2 px-4">{course.description}</td>
                <td className="py-2 px-4 font-medium">
                  ${course.price?.toFixed(2) || "0.00"}
                </td>
         
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
