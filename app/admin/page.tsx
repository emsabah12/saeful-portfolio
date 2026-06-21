"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

export default function AdminDashboard() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard</h1>
        {/* <button
          onClick={handleLogout}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition text-sm font-medium"
        >
          Logout
        </button> */}
      </div>

      <p className="text-gray-600">
        Selamat datang Administrator:{" "}
        <span className="font-semibold text-black">{user?.email}</span>
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Ini adalah area terproteksi. Modul CRUD akan dibangun di sini pada
        Milestone selanjutnya.
      </p>
    </div>
  );
}
