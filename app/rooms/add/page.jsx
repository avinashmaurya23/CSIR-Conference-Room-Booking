"use client";
import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Heading from "@/components/Heading";
import createRoom from "@/app/actions/createRoom";

const AddRoom = () => {
  // TYPO FIXED HERE: useActionstate -> useActionState
  const [state, formAction] = useActionState(createRoom, {});
  const router = useRouter();

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
    if (state.success) {
      toast.success("Room created successfully!");
      router.push("/");
    }
  }, [state, router]);

  return (
    <>
      <Heading title="Add New Room" />
      <div className="bg-white shadow-md border border-gray-200 rounded-lg p-8 w-full max-w-7xl mx-auto mt-6">
        <form action={formAction}>
          {/* -- Main Details Section -- */}
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
              placeholder="e.g., Large Conference Room"
              required
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
              placeholder="Enter a detailed description for the room"
              required
            ></textarea>
          </div>

          {/* -- Grid Section for Room Specs (Now 2 columns) -- */}
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
                placeholder="e.g., 500"
                required
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
                placeholder="e.g., 12"
                required
              />
            </div>
          </div>

          {/* -- Location and Amenities Section -- */}
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
                placeholder="e.g., Building A, Floor 2, Room 204"
                required
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
                placeholder="e.g., Monday - Friday, 9am - 5pm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="amenities"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amenities
              </label>
              <input
                type="text"
                id="amenities"
                name="amenities"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
                placeholder="e.g., projector, whiteboard, wifi"
                required
              />
            </div>
          </div>

          {/* -- Image Upload Section -- */}
          <div className="mb-8">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full md:w-auto flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Room
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRoom;
