import Modal from "@/components/Modal";
import RoomPage from "@/app/rooms/[id]/page"; // We can reuse the original component!

export default function RoomModal({ params }) {
  // This component will receive the same 'params' as the original RoomPage,
  // so we can pass them right along.

  return (
    <Modal>
      {/* We are calling the original RoomPage as a Server Component here.
        The '<RoomPage>' component will fetch its own data and render its content.
        The '@ts-expect-error Server Component' comment is needed because TypeScript 
        might not understand rendering an async component directly.
      */}
      {/* @ts-expect-error Server Component */}
      <RoomPage params={{ id: params.id }} />
    </Modal>
  );
}
