"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiMenu,
  HiX,
  HiAcademicCap,
  HiChevronDown,
  HiLogout,
  HiUser,
  HiCog,
} from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";
import { getUserInfo } from "@/services/auth.Service";
import { IUserInfo } from "@/types/userInfo";
import { logOutUser } from "@/util/log-out-user";
import { userInfo } from "node:os";
import { SiAcademia } from "react-icons/si";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userInfo = getUserInfo() as IUserInfo;

  const user = {
    role: userInfo?.role, // admin | teacher | student
  };

  const mainNav = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    ...(user.role === "admin"
      ? [{ name: "Dashboard", href: "/admin/dashboard" }]
      : []),
  ];

  const adminMenuItems = [
    { name: "Manage Courses", href: "/admin/course", icon: HiAcademicCap },
    { name: "Dashboard", href: "/admin/dashboard", icon: HiCog },
  ];
  const userMenuItems = [
    { name: "My Courses", href: "/courses", icon: HiAcademicCap },
  ];

  const handleLogout = () => {
    logOutUser(router);
  };

  const pathname = usePathname();
  if (pathname.includes("admin") || pathname.includes("user")) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: "1280px" }}
        >
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 flex-shrink-0"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <HiAcademicCap className="text-white text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-bold text-lg tracking-tight">
                  EduMaster
                </span>
                <span className="text-gray-500 text-xs font-medium -mt-1">
                  Learning Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {mainNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 group"
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                </Link>
              ))}
            </div>

            {/* User Menu - Desktop */}
            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center">
              {userInfo ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-transparent hover:border-gray-200 cursor-pointer"
                  >
                    <HiUser className="w-8 h-8 text-gray-600" />
                    <p className="text-sm font-semibold text-gray-900 capitalize">
                      {user.role}
                    </p>
                    <HiChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in slide-in-from-top-2 duration-200">
                      <div className="py-2">
                        {(userInfo.role === "user"
                          ? userMenuItems
                          : adminMenuItems
                        ).map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <IconComponent className="w-5 h-5 text-gray-400" />
                              <span>{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center cursor-pointer space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                        >
                          <HiLogout className="w-5 h-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="mx-auto px-4 py-4" style={{ maxWidth: "1280px" }}>
            {/* Main Navigation */}
            <div className="space-y-1 mb-6">
              {mainNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Info & Menu */}
            {userInfo ? (
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-2 px-4 py-3 mb-4 bg-gray-50 rounded-lg">
                  <HiUser className="w-8 h-8 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {user.role}
                  </p>
                </div>

                <div className="space-y-1">
                  {(user.role === "admin" ? adminMenuItems : userMenuItems).map(
                    (item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          <IconComponent className="w-5 h-5 text-gray-400" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    }
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full text-left"
                  >
                    <HiLogout className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 bg-blue-600 text-center text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => setIsOpen(false)} 
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 bg-blue-600 text-center text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
