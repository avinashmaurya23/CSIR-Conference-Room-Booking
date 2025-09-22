"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiX, FiCheckCircle, FiLoader } from "react-icons/fi";
import getAllRooms from "@/app/actions/getAllRooms";
import { getBookedDates } from "@/app/actions/getBookedDates";
import BookingForm from "./BookingForm";

export default function BookRoomButton({ isOpen, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [allRooms, setAllRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [bookedDates, setBookedDates] = useState([]);

  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingDates, setIsLoadingDates] = useState(false);

  useEffect(() => {
    if (isOpen) {
      async function fetchRooms() {
        setIsLoadingRooms(true);
        const roomsData = await getAllRooms();
        if (Array.isArray(roomsData) && roomsData.length > 0) {
          setAllRooms(roomsData);
          setSelectedRoomId(roomsData[0].$id);
        }
        setIsLoadingRooms(false);
      }
      fetchRooms();
      setTimeout(() => setIsAnimating(true), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!selectedRoomId) return;

    async function fetchBookedDatesForRoom() {
      setIsLoadingDates(true);
      const dates = await getBookedDates(selectedRoomId);
      setBookedDates(dates);
      setIsLoadingDates(false);
    }
    fetchBookedDatesForRoom();
  }, [selectedRoomId]);

  const selectedRoom = useMemo(
    () => allRooms.find((room) => room.$id === selectedRoomId),
    [allRooms, selectedRoomId]
  );

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-5xl transform transition-all duration-300 ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Book a Room</h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label
              htmlFor="room_select_modal"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Room
            </label>
            <select
              id="room_select_modal"
              name="room_id"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              disabled={isLoadingRooms}
              className="w-full p-2 border bg-white border-gray-300 rounded-md"
            >
              {isLoadingRooms ? (
                <option>Loading rooms...</option>
              ) : (
                allRooms.map((room) => (
                  <option key={room.$id} value={room.$id}>
                    {room.name} (Capacity: {room.capacity})
                  </option>
                ))
              )}
            </select>
          </div>

          {selectedRoom && selectedRoom.amenities && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedRoom.amenities.split(",").map((amenity) => (
                  <span
                    key={amenity.trim()}
                    className="flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    <FiCheckCircle className="h-3 w-3 text-green-500" />
                    {amenity.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <hr className="my-4 border-gray-200" />

          {isLoadingDates ? (
            <div className="flex justify-center items-center h-64">
              <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
              <p className="ml-4 text-gray-600">Loading Room Schedule...</p>
            </div>
          ) : selectedRoom ? (
            <BookingForm room={selectedRoom} bookedDates={bookedDates} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
