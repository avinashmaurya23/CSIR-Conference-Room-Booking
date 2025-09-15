"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import RoomListModal from "@/components/RoomListModal"; // Adjust path according to your folder structure
import ScheduledDatesSidebar from "@/components/ScheduledDatesSidebar"; // Create this component based on your scheduled dates HTML

export default function Calendar({ bookings, rooms }) {
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setShowRoomModal(true);
    console.log("Date clicked: ", info.dateStr);
  };

  const events = bookings.map((booking) => {
    return {
      id: booking.$id,
      title: booking.event_name,
      start: booking.check_in,
      end: booking.check_out,
      // backgroundColor: room?.color || "#000",
      // borderColor: room?.color || "#000",
      // extendedProps: { roomName: room?.name },
    };
  });

  return (
    <div className="flex">
      {/* Main calendar area */}
      <div className="flex-grow max-w-7xl p-6">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventMouseEnter={(info) => {
            info.el.title = `${info.event.title} (${info.event.extendedProps.roomName})`;
          }}
          height="auto"
        />

        {showRoomModal && (
          <RoomListModal
            rooms={rooms}
            onClick={() => setShowRoomModal(false)}
            selectedDate={selectedDate}
            bookings={bookings}
          />
        )}
      </div>

      {/* Right sidebar showing scheduled dates */}
      <aside className="w-52 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <ScheduledDatesSidebar
          bookings={bookings}
          selectedDate={selectedDate}
        />
      </aside>
    </div>
  );
}
