// src/config/sidebarItems.tsx
import { CiLogout } from "react-icons/ci";
import { FaBookOpen, FaRegHeart, FaUsers } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import {
  MdDashboard,
  MdOutlineAssignment,
} from "react-icons/md";
import { BsBarChartLine } from "react-icons/bs";
import { USER_ROLE } from "./role";
import { BiHomeAlt } from "react-icons/bi";

export type SidebarItem = {
  label: string;
  key: string;
  icon?: React.ReactNode;
  href?: string;
  isButton?: boolean;
  onClick?: () => void;
  className?: string;
  children?: SidebarItem[];
};

// 🔹 Helper: Logout Button
const createLogoutButton = (handleLogout: () => void, role: string): SidebarItem => ({
  label: "Logout",
  key: `/${role}/logout`,
  icon: <CiLogout />,
  isButton: true,
  onClick: handleLogout,
  className: "text-red-600 hover:text-red-700 hover:bg-red-50",
});


// 🔹 Admin Menu
const getAdminMenu = (): SidebarItem[] => [
  {
    label: "Home",
    key: "/",
    href: "/",
    icon: <BiHomeAlt />,
  },
  {
    label: "Analysis",
    key: "/admin/dashboard",
    href: "/admin/dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Manage Courses",
    key: "/admin/course",
    href: "/admin/course",
    icon: <FaBookOpen />,
  }
];

// 🔹 User Menu
const getUserMenu = (): SidebarItem[] => [
  {
    label: "Home",
    key: "/home",
    href: "/",
    icon: <MdDashboard />,
  },
  {
    label: "My Courses",
    key: "/user/my-course",
    href: "/user/my-course",
    icon: <FaBookOpen />,
  },
  {
    label: "Enrollments",
    key: "/user/enrollments",
    href: "/user/enrollments",
    icon: <FaUsers />,
  },
  {
    label: "Assignments",
    key: "/user/assignments",
    href: "/user/assignments",
    icon: <MdOutlineAssignment />,
  },
  {
    label: "Grades",
    key: "/user/grades",
    href: "/user/grades",
    icon: <BsBarChartLine />,
  },
  {
    label: "Favorites",
    key: "/user/favorites",
    href: "/user/favorites",
    icon: <FaRegHeart />,
  },
  {
    label: "Profile",
    key: "/user/profile",
    href: "/user/profile",
    icon: <ImProfile />,
  },
];

// 🔹 Main Export
export const getSidebarItems = (
  role: string,
  handleLogout: () => void
): SidebarItem[] => {
  if (role === USER_ROLE.ADMIN) {
    return [
      ...getAdminMenu(),
      // ...getCommonSettings("admin"),
      createLogoutButton(handleLogout, USER_ROLE.ADMIN),
    ];
  }

  return [
    ...getUserMenu(),
    // ...getCommonSettings(USER_ROLE.USER),
    createLogoutButton(handleLogout, USER_ROLE.USER),
  ];
};