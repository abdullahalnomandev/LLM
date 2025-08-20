"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CiMenuBurger } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { getSidebarItems } from "@/constants/sidebarItems";
import { USER_ROLE } from "@/constants/role";
import { logOutUser } from "@/util/log-out-user";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logOutUser(router)
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const menuItems = getSidebarItems(USER_ROLE.ADMIN, handleLogout);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-[100] md:hidden bg-white p-2 cursor-pointer rounded shadow-md"
      >
        {isOpen ? <IoClose size={20} /> : <CiMenuBurger size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
      fixed top-17 left-0 h-full w-64 bg-white 
      drop-shadow-lg shadow-black/30
      transform transition-transform duration-300
      z-[95] md:z-30
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
    `}
      >
        {/* Menu */}
        <nav className="p-4 pt-1">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.key;

              if (item.isButton) {
                return (
                  <li key={item.key}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 text-left text-red-600 hover:bg-red-50 rounded"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.key}>
                  <Link
                    href={item.key}
                    onClick={closeSidebar}
                    className={`
                  flex items-center gap-3 p-3 rounded transition-colors
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
}
