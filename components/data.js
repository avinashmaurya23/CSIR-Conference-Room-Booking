export const rooms = [
  { id: "room-a", name: "The Summit", capacity: 12, color: "#3b82f6" },
  { id: "room-b", name: "The Hub", capacity: 8, color: "#10b981" },
  { id: "room-c", name: "The Forum", capacity: 20, color: "#f97316" },
  { id: "room-d", name: "The Nook", capacity: 4, color: "#8b5cf6" },
];

export const bookings = [
  {
    id: "booking-1",
    roomId: "room-a",
    start: "2025-09-10T09:00:00",
    end: "2025-09-10T10:30:00",
    title: "Project Alpha Sync",
    user: "Avinash M.",
  },
  // more bookings
];

export function addBooking(newBooking) {
  bookings.push({
    ...newBooking,
    id: "booking-" + (bookings.length + 1),
  });
}

export function isConflict(start, end, roomId) {
  const newStart = new Date(start);
  const newEnd = new Date(end);

  return bookings.some((b) => {
    if (b.roomId !== roomId) return false;
    const existingStart = new Date(b.start);
    const existingEnd = new Date(b.end);
    return newStart < existingEnd && newEnd > existingStart;
  });
}
