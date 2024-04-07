import React, { useEffect, useState } from 'react';
import CalendarCard from "../components/CalendarCard";
import CalendarAddModal from '../components/CalendarAddModal';
import "../styles/Calendars.css";
import useRequest from '../utils/requestHandler'
import Sidebar from '../components/Sidebar';

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

  const apiFetch = useRequest();
  const [calendars, setCalendars] = useState<CalendarItem[]>([]); // Use the CalendarItem interface here

  useEffect(() => {
    const fetchCalendars = async () => {
      const response = await apiFetch('calendars/', { method: "GET" }); // Use GET method
      if (response) {
        setCalendars(response); // Update state with fetched calendars
      }
    };

    fetchCalendars();
  }, [apiFetch]); // Dependency array to avoid fetching more than once

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const saveChanges = async () => {
    // Implement this function to save the new calendar
    closeCreateModal();
  };

  return (
    <div id="wrapper" className="d-flex">
      <Sidebar />

      <div id="page-content-wrapper">
        {/* Navbar omitted for brevity */}

        <div className="container flex-wrap">
          <h3 className="text-left fw-bold mt-3">My Calendars</h3>
          <button type="button" className="btn btn-outline-success mt-3" onClick={openCreateModal}>Create Calendar
          </button>
          <CalendarAddModal
            isOpen={isCreateModalOpen}
            onClose={closeCreateModal}
            onSave={saveChanges}
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
