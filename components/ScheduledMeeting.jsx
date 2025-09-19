"use client";
import { useState, useMemo, useEffect } from "react"; // Imported useEffect
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import MeetingCard from "./MeetingCard";
import { FiCalendar } from "react-icons/fi";

const createLocalDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const toYYYYMMDD = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ScheduledMeeting = ({ meetings }) => {
  const [selected, setSelected] = useState(new Date());

  // State to control the visibility for animation
  const [isListVisible, setIsListVisible] = useState(true);

  const meetingDateObjects = useMemo(
    () =>
      meetings.flatMap((m) => {
        const dates = [];
        const start = createLocalDate(m.check_in.slice(0, 10));
        const end = createLocalDate(m.check_out.slice(0, 10));
        let current = new Date(start);
        while (current <= end) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        return dates;
      }),
    [meetings]
  );

  const filteredMeetings = useMemo(() => {
    if (!selected) return [];
    const selectedStr = toYYYYMMDD(selected);
    return meetings.filter((meeting) => {
      const startStr = meeting.check_in.slice(0, 10);
      const endStr = meeting.check_out.slice(0, 10);
      return selectedStr >= startStr && selectedStr <= endStr;
    });
  }, [meetings, selected]);

  // This useEffect triggers the animation whenever the selected date changes.
  useEffect(() => {
    setIsListVisible(false); // First, hide the list
    const timer = setTimeout(() => {
      setIsListVisible(true); // Then, make it visible to trigger the fade-in
    }, 100); // A short delay
    return () => clearTimeout(timer);
  }, [selected]); // Dependency is the selected date

  const formattedDate = selected
    ? selected.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit p-4">
        <h2 className="text-lg font-bold text-gray-900 text-center border-b border-gray-100 pb-3 mb-4">
          Meetings {selected && `on ${formattedDate}`}
        </h2>
        {filteredMeetings.length > 0 ? (
          <div className="space-y-4 overflow-y-auto pr-2">
            {filteredMeetings.map((meeting, index) => (
              // Each card is wrapped in a div for the animation
              <div
                key={meeting.$id}
                className={`transition-all duration-300 ease-in-out ${
                  isListVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                }`}
                style={{ transitionDelay: `${index * 75}ms` }} // This creates the staggered effect
              >
                <MeetingCard meeting={meeting} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FiCalendar className="w-12 h-12 mx-auto text-gray-300" />
            <p className="mt-3 text-sm">No meetings scheduled for this date.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          modifiers={{ hasMeeting: meetingDateObjects }}
          modifiersStyles={{
            hasMeeting: {
              backgroundColor: "#E0E7FF",
              color: "#3730A3",
              fontWeight: "bold",
            },
          }}
          className="p-4"
        />
      </div>
    </>
  );
};

export default ScheduledMeeting;
