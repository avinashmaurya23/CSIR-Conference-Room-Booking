"use client";
import { useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import updateRoom from "@/app/actions/updateRoom";
import Image from "next/image";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full md:w-auto flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
    >
      {pending ? "Updating..." : "Update Room"}
    </button>
  );
}

export default function EditRoomForm({ room }) {
  const [state, formAction] = useActionState(updateRoom, {});
  const router = useRouter();

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success("Room updated successfully!");
      router.push("/rooms/my");
    }
  }, [state, router]);

  const bucketID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  const imageUrl = room.image
    ? `https://nyc.cloud.appwrite.io/v1/storage/buckets/${bucketID}/files/${room.image}/view?project=${projectID}`
    : "/images/no-image.jpg";

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-8 w-full max-w-7xl mx-auto mt-6">
      <form action={formAction}>
        <input type="hidden" name="id" value={room.$id} />

        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Room Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={room.name}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={room.description}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="sqft"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Square Feet
            </label>
            <input
              type="number"
              id="sqft"
              name="sqft"
              defaultValue={room.sqft}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              defaultValue={room.capacity}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue={room.location}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="availability"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Availability
            </label>
            <input
              type="text"
              id="availability"
              name="availability"
              defaultValue={room.availability}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="amenities"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amenities (comma-separated)
          </label>
          <input
            type="text"
            id="amenities"
            name="amenities"
            defaultValue={room.amenities}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        <div className="mb-8">
          <p className="block text-sm font-medium text-gray-700 mb-4">
            Room Image
          </p>
          <div className="flex flex-col sm:flex-row sm:space-x-6 items-start">
            <div className="w-full sm:w-40 h-40 mb-4 sm:mb-0 flex-shrink-0 border border-gray-200 rounded-lg p-2">
              <Image
                src={imageUrl}
                width={400}
                height={400}
                alt={room.name || "Current room image"}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex-grow w-full">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload New Image (Optional)
              </label>
              <input
                type="file"
                id="image"
                name="image"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
