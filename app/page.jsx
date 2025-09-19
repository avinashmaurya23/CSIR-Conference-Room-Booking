import RoomCard from "@/components/RoomCard";
import Heading from "@/components/Heading";
import getAllRooms from "./actions/getAllRooms";
import getScheduledMeetings from "./actions/getScheduledMeetings";
import MeetingCard from "@/components/MeetingCard";
import { FiCalendar, FiSlash } from "react-icons/fi";
import ScheduledMeeting from "@/components/ScheduledMeeting";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const rooms = await getAllRooms();
  const meetings = await getScheduledMeetings();

  return (
    // LAYOUT CHANGE: Switched to CSS Grid for a precise match to your original UI.
    // On large screens (lg), it creates two columns: one flexible (1fr) and one fixed sidebar (320px).
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 px-4 sm:px-6 lg:px-8 ">
      {/* --- Main Content (Left Column) --- */}
      {/* This is now the first grid column, which takes up all flexible space ('1fr'). */}
      <main>
        <Dashboard />

        <Heading title="Available Conference Rooms" />

        <div className="mt-6">
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <RoomCard room={room} key={room.$id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-xl">
              <FiSlash className="w-16 h-16 text-gray-300" />
              <p className="text-center text-gray-500 mt-4">
                No conference rooms are currently available.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* --- Sidebar (Right Column) --- */}
      {/* This is the second grid column, with a fixed width defined in the grid layout. */}
      <aside className="space-y-6">
        <ScheduledMeeting meetings={meetings} />
        {/* You can add the calendar card here in the future and 'space-y-6' will space it out automatically */}
      </aside>
    </div>
  );
}
