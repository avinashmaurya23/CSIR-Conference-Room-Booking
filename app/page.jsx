import RoomCard from "@/components/RoomCard";
import Heading from "@/components/Heading";
import getAllRooms from "./actions/getAllRooms";

export default async function Home() {
  const rooms = await getAllRooms();
  return (
    <>
      <Heading title="Available Conference Rooms" />
      {rooms.length > 0 ? (
        rooms.map((room) => <RoomCard room={room} key={room.$id} />)
      ) : (
        <p>NO rooms available</p>
      )}
    </>
  );
}
