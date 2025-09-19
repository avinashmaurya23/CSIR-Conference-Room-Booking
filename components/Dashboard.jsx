// components/Dashboard.jsx

import React from "react";
import getAllRooms from "@/app/actions/getAllRooms";
import getScheduledMeetings from "@/app/actions/getScheduledMeetings";
import {
  FiHome,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiLogIn,
} from "react-icons/fi";
import getMyBookings from "@/app/actions/getMyBookings";
import { cookies } from "next/headers";
import { DateTime } from "luxon";

// A small, reusable component for each stat card
const StatCard = ({ title, value, icon, color }) => {
  return (
    // HOVER EFFECT ADDED: Added transition classes for a smooth "lift" effect.
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-4 ${color}`}>{icon}</div>
        <div>
          <h4 className="text-sm font-semibold text-gray-500">{title}</h4>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default async function Dashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("appwrite-session");
  const isAuthenticated = !!sessionCookie;

  let upcomingBookingsCount = 0;
  let pendingRequestsCount = 0;

  const todayString = DateTime.now().toFormat("yyyy-MM-dd");

  if (isAuthenticated) {
    const myBookings = await getMyBookings();
    if (Array.isArray(myBookings)) {
      upcomingBookingsCount = myBookings.filter(
        (booking) =>
          booking.booking_status === "Confirm" &&
          booking.check_in.slice(0, 10) >= todayString
      ).length;

      pendingRequestsCount = myBookings.filter(
        (booking) => booking.booking_status === "Pending"
      ).length;
    }
  }

  const rooms = await getAllRooms();
  const allMeetings = await getScheduledMeetings();

  const meetingsToday = allMeetings.filter(
    (meeting) => meeting.check_in.slice(0, 10) === todayString
  ).length;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Rooms"
          value={rooms.length}
          icon={<FiHome className="text-blue-600" size={24} />}
          color="bg-blue-100"
        />
        <StatCard
          title="Meetings Today"
          value={meetingsToday}
          icon={<FiCalendar className="text-purple-600" size={24} />}
          color="bg-purple-100"
        />

        {isAuthenticated ? (
          <>
            <StatCard
              title="Your Upcoming Bookings"
              value={upcomingBookingsCount}
              icon={<FiCheckCircle className="text-green-600" size={24} />}
              color="bg-green-100"
            />
            <StatCard
              title="Your Pending Requests"
              value={pendingRequestsCount}
              icon={<FiClock className="text-yellow-600" size={24} />}
              color="bg-yellow-100"
            />
          </>
        ) : (
          <div className="sm:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
            <FiLogIn size={28} className="text-gray-400 mb-2" />
            <p className="font-semibold text-gray-700">Log In</p>
            <p className="text-sm text-gray-500">to see your requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}
