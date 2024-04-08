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
  title: string;
  date: string;
  timeRange: string;
  responsePending: boolean;
}

const DashboardPage = () => {
  // Create calendars modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = React.useState<string>("");
  const initialDays: Date[] = [new Date()];
  const [days, setDays] = React.useState<Date[]>(initialDays);
  const [selectedHighPriority, setSelectedHighPriority] = useState<string[]>([]);
  const [selectedLowPriority, setSelectedLowPriority] = useState<string[]>([]);

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

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const createCalendar = async () => {
    // Create a new calendar
    const newCalendarResponse = await apiFetch('calendars/', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name, // Assuming your CalendarWriteSerializer expects a name
        // Add any other fields required by your CalendarWriteSerializer here
      })
    });

    if (newCalendarResponse && newCalendarResponse.id) {
      // After creating a new calendar, add non-busy times to it
      const calendarId = newCalendarResponse.id;

      for (let day of days) {
        // Format or transform `day` as needed by your NonBusyTimeWriteSerializer
        // Example: converting Date to a string in 'YYYY-MM-DD' format
        let formattedDay = day.toISOString().split('T')[0];

        // Add non-busy time for each selected day
        await apiFetch(`calendars/${calendarId}/nonbusytimes/`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            date: formattedDay,
            // Include any other fields required by your NonBusyTimeWriteSerializer
            // For example, specifying the time range for the non-busy time
          })
        });
      }

      // Optionally, refresh calendars list to include the newly created calendar
      // and its non-busy times without reloading the page
      await fetchCalendars();
    }

    // Close the create calendar modal
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
            selectedDays={days}
            setSelectedDays={setDays} // Add the missing setSelected property
            selectedHighPriority={selectedHighPriority}
            setSelectedHighPriority={setSelectedHighPriority}
            selectedLowPriority={selectedLowPriority}
            setSelectedLowPriority={setSelectedLowPriority}
          />
          <div className="upcoming-cont">
            {calendars.map((calendar: CalendarItem) => ( // Use the CalendarItem interface here
              <CalendarCard
                key={calendar.id}
                title={calendar.title}
                date={calendar.date}
                timeRange={calendar.timeRange}
                responsePending={calendar.responsePending}
              />
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default DashboardPage;
