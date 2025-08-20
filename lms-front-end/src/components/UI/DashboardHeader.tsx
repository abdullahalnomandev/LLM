import Link from "next/link";
import React, { Component } from "react";
import { HiAcademicCap } from "react-icons/hi";

export default class DashboardHeader extends Component {
  render() {
    return (
      <header className="w-full bg-white shadow-sm py-2 px-2 z-100 fixed top-0 left-0">
        {/* Logo & Brand */}
        <Link
          href="/"
          className="flex items-center space-x-2 flex-shrink-0 p-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
            <HiAcademicCap className="text-white text-lg" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-bold text-base tracking-tight">
              EduMaster
            </span>
            <span className="text-gray-500 text-xs font-medium -mt-1">
              Learning Platform
            </span>
          </div>
        </Link>
      </header>
    );
  }
}
