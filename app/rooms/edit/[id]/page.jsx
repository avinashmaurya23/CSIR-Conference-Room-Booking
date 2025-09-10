import Heading from "@/components/Heading";
import getSingleRoom from "@/app/actions/getSingleRoom";
import EditRoomForm from "@/components/EditRoomForm";

export default async function EditRoomPage({ params }) {
  const { id } = params;
  const room = await getSingleRoom(id);

  if (!room) return <Heading title="Room Not Found" />;

  return (
    <>
      <Heading title="Edit Room" />
      <EditRoomForm room={room} />
    </>
  );
}
