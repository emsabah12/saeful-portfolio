"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  Settings,
  LogOut,
} from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Profile", icon: UserCircle, path: "/admin/profile" },
  { name: "Experience", icon: Briefcase, path: "/admin/experience" },
  { name: "Education", icon: GraduationCap, path: "/admin/education" },
  { name: "Projects", icon: FolderGit2, path: "/admin/projects" },
  { name: "Skills", icon: Wrench, path: "/admin/skills" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col hidden md:flex fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Portfolio CMS</h2>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-1 px-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
