import React, { useEffect, useState } from 'react';
import CalendarCard from "../components/CalendarCard";
import CalendarAddModal from '../components/CalendarAddModal';
import "../styles/Calendars.css";
import useRequest from '../utils/requestHandler'
import Sidebar from '../components/Sidebar';
import DashNavbar from '../components/DashNavbar';
// Define a TypeScript interface for the calendar items
interface CalendarItem {
  id: string;
  name: string;
  meetingLength: string;
  deadline: string;
  finalizedDayOfWeek?: number;
  finalizedTime?: string; // Format: "HH:MM:SS"
  // Add new fields here if you're planning to use them on the frontend
}
const DashboardPage = () => {
  // Create calendars modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = React.useState<string>("");
  const [selectedHighPriority, setSelectedHighPriority] = useState<string[]>([]);
  const [selectedLowPriority, setSelectedLowPriority] = useState<string[]>([]);
  const [meetingLength, setMeetingLength] = useState<number>(60); // Default meeting length [minutes]
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const apiFetch = useRequest();
  const [calendars, setCalendars] = useState<CalendarItem[]>([]); // Use the CalendarItem interface here

  const fetchCalendars = async () => {
    const response = await apiFetch('calendars/', { method: "GET" }); // Use GET method
    if (response) {
      setCalendars(response); // Update state with fetched calendars
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, [apiFetch]); // Dependency array to avoid fetching more than once

  const parseSelectedTime = (selectedTime: string[], preferenceLevel: number) => {
    return selectedTime.map(time => {
      const [dayOfWeek, startTime] = time.split('-');
      let [hours, minutes] = startTime.split(':').map(Number);
      minutes += 30; // Add 30 minutes
      if (minutes >= 60) {
        hours += 1;
        minutes -= 60;
      }

      // Ensure hours and minutes are in "HH:MM" format
      const endTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      return {
        day_of_week: parseInt(dayOfWeek),
        start_time: startTime,
        end_time: endTime,
        preference_level: preferenceLevel
      };
    });
  };
  const saveChanges = async () => {
    // Close the create calendar modal
    closeCreateModal();

    // Create the new calendar
    const calendarData = {
      name: name,
      meeting_length: meetingLength,
      deadline: deadline?.toISOString(),
    };
    const newCalendarResponse = await apiFetch('calendars/', {
      method: "POST",
      body: JSON.stringify(calendarData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!newCalendarResponse.id) {
      console.error("Failed to create calendar");
      return;
    }

    // Parse and add high priority non-busy times
    const highPriorityTimes = parseSelectedTime(selectedHighPriority, 0);
    const lowPriorityTimes = parseSelectedTime(selectedLowPriority, 1);

    // Combine both lists
    const nonBusyTimes = [...highPriorityTimes, ...lowPriorityTimes];

    // Add each non-busy time to the calendar
    nonBusyTimes.forEach(async (time) => {
      await apiFetch(`calendars/${newCalendarResponse.id}/nonbusytimes/`, {
        method: "POST",
        body: JSON.stringify(time),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    // Refetch calendars to update UI
    await fetchCalendars();
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const createCalendar = async () => {
    await saveChanges();
    closeCreateModal();
  };

  return (
    <div id="wrapper" className="d-flex">
      {isSidebarOpen && <Sidebar />}

      <div id="page-content-wrapper">
        {/* Navbar omitted for brevity */}
        <DashNavbar onToggleSidebar={toggleSidebar} />
        <div className="container flex-wrap">
          <h3 className="text-left fw-bold mt-3">My Calendars</h3>
          <button type="button" className="btn btn-outline-success mt-3" onClick={openCreateModal}>Create Calendar
          </button>
          <CalendarAddModal
            isOpen={isCreateModalOpen}
            onClose={closeCreateModal}
            onSave={createCalendar}
            name={name}
            setName={setName}
            selectedHighPriority={selectedHighPriority}
            setSelectedHighPriority={setSelectedHighPriority}
            selectedLowPriority={selectedLowPriority}
            setSelectedLowPriority={setSelectedLowPriority}
            meetingLength={meetingLength}
            setMeetingLength={setMeetingLength}
            deadline={deadline}
            setDeadline={setDeadline}
          />
          <div className="upcoming-cont">
            {calendars.map((calendar: CalendarItem) => ( // Use the CalendarItem interface here
              <CalendarCard
                key={calendar.id}
                title={calendar.name}
                date={calendar.deadline}
                timeRange={calendar.meetingLength}
                responsePending={calendar.finalizedDayOfWeek === undefined || calendar.finalizedTime === undefined}
                onEditAvailability={openCreateModal}
              />
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default DashboardPage;
