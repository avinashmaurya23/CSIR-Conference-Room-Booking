"use client";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

export default function Modal({ children }) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
        >
          <IoClose size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
