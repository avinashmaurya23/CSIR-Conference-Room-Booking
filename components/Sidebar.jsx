"use client";

import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("/calendar");

  const handleClick = (href) => {
    setActive(href);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Admin Panel</h1>

      <Link
        href="/calendar"
        onClick={() => handleClick("/calendar")}
        className={`block px-4 py-3 mb-4 rounded font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition ${
          active === "/calendar" ? "bg-blue-600 text-white" : ""
        }`}
      >
        Calendar
      </Link>

      <Link
        href="/bookings"
        onClick={() => handleClick("/bookings")}
        className={`block px-4 py-3 mb-4 rounded font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition ${
          active === "/bookings" ? "bg-blue-600 text-white" : ""
        }`}
      >
        Bookings Overview
      </Link>

      <Link
        href="/rooms"
        onClick={() => handleClick("/rooms")}
        className={`block px-4 py-3 mb-4 rounded font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition ${
          active === "/rooms" ? "bg-blue-600 text-white" : ""
        }`}
      >
        Rooms Management
      </Link>

      <Link
        href="/users"
        onClick={() => handleClick("/users")}
        className={`block px-4 py-3 rounded font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition ${
          active === "/users" ? "bg-blue-600 text-white" : ""
        }`}
      >
        Users
      </Link>
    </aside>
  );
}
