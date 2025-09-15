import RoomCard from "@/components/RoomCard";
import Heading from "@/components/Heading";
import getAllRooms from "./actions/getAllRooms";
import getScheduledMeetings from "./actions/getScheduledMeetings";
import MeetingCard from "@/components/MeetingCard";

export default async function Home() {
  const rooms = await getAllRooms();
  const meetings = await getScheduledMeetings();
  return (
    <>
      <Heading title="Available Conference Rooms" />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 p-4 sm:px-0">
        <div className="w-full md:w-3/4 lg:w-4/5">
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <RoomCard room={room} key={room.$id} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-8">NO rooms available</p>
          )}
        </div>
        <div className="w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 h-fit">
            <h1 className="text-xl font-semibold text-black">
              Upcoming Meetings:
            </h1>
            {meetings.length > 0 ? (
              <div className="mt-4 mx-2 space-y-4">
                {meetings.map((meeting) => (
                  <MeetingCard meeting={meeting} key={meeting.$id} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-8">
                NO Meetings Scheduled
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
