import Sidebar from "@/components/Sidebar"; // Adjust path if needed
import Calendar from "@/components/Calendar";
import getAllBookings from "@/app/actions/getAllBookings";
import getAllRooms from "@/app/actions/getAllRooms";

export default async function CalendarPage() {
  const bookings = await getAllBookings();
  const rooms = await getAllRooms();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-grow  mx-auto p-6 space-y-6 ml-64">
        {/* ml-64 offsets for sidebar width */}
        <Calendar bookings={bookings} rooms={rooms} />
      </main>
    </div>
  );
}
