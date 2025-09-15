"use client";
import AvailableRoomCard from "./AvailableRoomCard"; // Make sure filename matches exactly

// RoomListModal renders a selectable grid of rooms in a modal overlay
export default function RoomListModal({
  rooms,
  bookings,
  onClick,
  selectedDate,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm"
      onClick={onClick} // Close modal when clicking outside content
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 mx-4 flex flex-col relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Stop closing when clicking inside modal content
      >
        <button
          className="absolute top-3.5 right-6 text-gray-500 hover:text-gray-800 focus:outline-none"
          onClick={onClick}
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Select a Room {selectedDate}
        </h2>
        {rooms?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {rooms.map((room) => {
              const roomBookings = bookings.filter(
                (booking) =>
                  booking.room_id.$id === room.$id &&
                  booking.check_in.slice(0, 10) === selectedDate // for ISO string
              );

              return (
                <AvailableRoomCard
                  room={room}
                  key={room.$id}
                  selectedDate={selectedDate}
                  bookingsForDate={roomBookings}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-8 font-medium">
            No rooms available
          </p>
        )}
      </div>
    </div>
  );
}
