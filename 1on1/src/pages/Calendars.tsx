import React, { useEffect, useState } from 'react';
import CalendarCard from "../components/CalendarCard";
import CalendarAddModal from '../components/CalendarAddModal';
import CalendarEditModal from '../components/CalendarEditModal';
import "../styles/Calendars.css";
import useRequest from '../utils/requestHandler';
import Sidebar from '../components/Sidebar';
import DashNavbar from '../components/DashNavbar';
import PendingInvites from '../components/PendingInvites';
import FinalizeMeetingModal from '../components/FinalizeMeetingModal';

// Define a TypeScript interface for the calendar items
interface CalendarItem {
  id: string;
  name: string;
  meeting_length: number;
  deadline: string;
  finalized_day_of_week?: number;
  finalized_time?: string; // Format: "HH:MM:SS"
}

interface PendingInvitation {
  id: string;
  calendar: {
    name: string;
    // Add other necessary fields
  };
  date: string; // Example field, adjust as necessary
  time: string; // Example field, adjust as necessary
}

interface NonBusyTime {
  id: string;
  user: string;
  calendar: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  preference_level: number;
}

const DashboardPage: React.FC = () => {
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);

  const apiFetch = useRequest();

  useEffect(() => {
    const fetchCalendars = async () => {
      const response = await apiFetch('calendars/', { method: "GET" });
      if (response) {
        setCalendars(response);
      }
    };

    const fetchPendingInvitations = async () => {
      const response = await apiFetch('/calendars/invitations/pending', { method: "GET" });
      if (response) {
        setPendingInvitations(response);
      }
    };

    fetchCalendars();
    fetchPendingInvitations();
  }, [apiFetch]); // Combining fetch calls in a single useEffect for efficiency

  const onAccept = async (invitationId: string) => {
    const response = await apiFetch(`/calendars/invitations/update/${invitationId}/`, {
      method: "PATCH",
      body: JSON.stringify({ status: 'accepted' }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response) {
      // Remove the invitation from the pending list
      setPendingInvitations(current => current.filter(invite => invite.id !== invitationId));
      // Fetch calendars to update the "My Calendars" section with the newly accepted calendar
      fetchCalendars();
    } else {
      console.error("Failed to accept the invitation");
    }
  };

  const onDecline = async (invitationId: string) => {
    const response = await apiFetch(`/calendars/invitations/update/${invitationId}/`, {
      method: "PATCH",
      body: JSON.stringify({ status: 'declined' }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response) {
      // Simply remove the invitation from the pending list
      setPendingInvitations(current => current.filter(invite => invite.id !== invitationId));
    } else {
      console.error("Failed to decline the invitation");
    }
  }
  // Create calendar modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = React.useState<string>("");
  const [selectedHighPriority, setSelectedHighPriority] = useState<string[]>([]);
  const [selectedLowPriority, setSelectedLowPriority] = useState<string[]>([]);
  const [meetingLength, setMeetingLength] = useState<number>(60); // Default meeting length [minutes]
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  // Edit calendar modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); // Determines if the modal is in create or edit mode
  const [editingCalendarId, setEditingCalendarId] = useState<string | null>(null); // Tracks the ID of the calendar being edited

  // Finalize meeting modal
  const [currentCalendarHighPriorityTimes, setCurrentCalendarHighPriorityTimes] = useState<NonBusyTime[]>([]);
  const [currentCalendarLowPriorityTimes, setCurrentCalendarLowPriorityTimes] = useState<NonBusyTime[]>([]);
  const [currentCalendar, setCurrentCalendar] = useState<CalendarItem>({} as CalendarItem);
  const [selectedFinalTime, setSelectedFinalTime] = useState<NonBusyTime | null>(null);

  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const openFinalizeModal = async (calendar: CalendarItem) => {
    setCurrentCalendar(calendar);

    let nonbusytimes = await fetchNonBusyTimes(calendar.id, false);
    setCurrentCalendarHighPriorityTimes(nonbusytimes.filter(time => time.preference_level === 0));
    setCurrentCalendarLowPriorityTimes(nonbusytimes.filter(time => time.preference_level === 1));
    setIsFinalizeModalOpen(true);

  };
  const closeFinalizeModal = () => setIsFinalizeModalOpen(false);
  const saveFinalizeModal = async () => {
    // Assuming the selected time is not null
    // Prepare the calendar data
    const calendarData = {
      name: currentCalendar.name,
      meeting_length: currentCalendar.meeting_length,
      deadline: currentCalendar.deadline,
      finalized_day_of_week: selectedFinalTime?.day_of_week,
      finalized_time: selectedFinalTime?.start_time,
    };

    let apiResponse;
    // If in edit mode and an editing calendar ID is set, update the existing calendar
    apiResponse = await apiFetch(`calendars/${currentCalendar.id}/`, {
      method: "PUT",
      body: JSON.stringify(calendarData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    closeFinalizeModal();

    // Refetch calendars to update UI
    await fetchCalendars();
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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

    // Prepare the calendar data
    const calendarData = {
      name: name,
      meeting_length: meetingLength,
      deadline: deadline?.toISOString(),
    };

    let apiResponse;
    if (editMode && editingCalendarId) {
      // If in edit mode and an editing calendar ID is set, update the existing calendar
      apiResponse = await apiFetch(`calendars/${editingCalendarId}/`, {
        method: "PUT",
        body: JSON.stringify(calendarData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Assuming success in updating the calendar, now delete existing non-busy times
      if (apiResponse && apiResponse.id) {
        const existingNonBusyTimes: NonBusyTime[] = await fetchNonBusyTimes(editingCalendarId, true);
        for (const nonBusyTime of existingNonBusyTimes) {
          await apiFetch(`calendars/${editingCalendarId}/nonbusytimes/${nonBusyTime.id}/`, {
            method: "DELETE",
          });
        }
      } else {
        console.error("Failed to update calendar");
        return;
      }
    } else {
      // If not in edit mode, create a new calendar
      apiResponse = await apiFetch('calendars/', {
        method: "POST",
        body: JSON.stringify(calendarData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!apiResponse || !apiResponse.id) {
        console.error("Failed to create calendar");
        return;
      }
    }

    // Parse and add non-busy times for both creating a new calendar and updating an existing one
    const highPriorityTimes = parseSelectedTime(selectedHighPriority, 0);
    const lowPriorityTimes = parseSelectedTime(selectedLowPriority, 1);

    // Combine both lists of times
    const nonBusyTimes = [...highPriorityTimes, ...lowPriorityTimes];

    // Add each non-busy time to the calendar
    for (const time of nonBusyTimes) {
      await apiFetch(`calendars/${apiResponse.id}/nonbusytimes/`, {
        method: "POST",
        body: JSON.stringify(time),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Refetch calendars to update UI
    await fetchCalendars();
  };

  async function fetchNonBusyTimes(calendarId: string, userSpecific?: boolean): Promise<NonBusyTime[]> {
    try {
      const userSpecificQueryParam = userSpecific ? '?user_specific=true' : '';
      const url = `/calendars/${calendarId}/nonbusytimes/${userSpecificQueryParam}`;

      const response = await apiFetch(url, {
        method: 'GET',
        // Assuming apiFetch handles Authorization header and Content-Type
      });

      // Assuming apiFetch either throws an error or returns the JSON-parsed body directly
      return response; // Assuming the response directly contains the array of NonBusyTime objects
    } catch (error) {
      console.error('Failed to fetch non-busy times', error);
      throw error; // Rethrow or handle as needed
    }
  }


  const openModal = async (calendarToEdit?: CalendarItem) => {
    if (calendarToEdit) {
      // Populate state with the data of the calendar being edited
      setName(calendarToEdit.name);
      setMeetingLength(calendarToEdit.meeting_length);
      setDeadline(new Date(calendarToEdit.deadline));
      setEditingCalendarId(calendarToEdit.id);
      setEditMode(true);

      // Fetch non-busy times for the calendar to be edited
      try {
        const nonBusyTimes = await fetchNonBusyTimes(calendarToEdit.id, true); // true to filter by current user
        const highPriorityTimes = nonBusyTimes.filter(time => time.preference_level === 0).map(time => formatTimeForState(time));
        const lowPriorityTimes = nonBusyTimes.filter(time => time.preference_level === 1).map(time => formatTimeForState(time));

        setSelectedHighPriority(highPriorityTimes);
        setSelectedLowPriority(lowPriorityTimes);
      } catch (error) {
        console.error('Error fetching non-busy times:', error);
      }

      setIsEditModalOpen(true);

    } else {
      resetCreateModalState();
    }
  };

  // Helper function to reset state for creating a new calendar
  const resetCreateModalState = () => {
    setName("");
    setSelectedHighPriority([]);
    setSelectedLowPriority([]);
    setMeetingLength(60); // Reset to default meeting length
    setDeadline(undefined);
    setEditingCalendarId(null);
    setEditMode(false);
    setIsCreateModalOpen(true);
  };

  // Helper function to format non-busy time data for state
  const formatTimeForState = (time: NonBusyTime): string => {
    // Extract the hours and minutes from the start_time
    // Assuming start_time is in "HH:mm:ss" format, but you should adjust this according to your actual data format
    const [hours, minutes] = time.start_time.split(':');
    // Format and return the time in "HH:mm" format along with the day of the week
    // Adjust this return statement if your state expects a different structure
    return `${time.day_of_week}-${hours}:${minutes}`;
  };

  const closeCreateModal = () => setIsCreateModalOpen(false);
  const createCalendar = async () => {
    await saveChanges();
    closeCreateModal();
    closeEditModal();
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const dayOfWeekToString = (dayOfWeek: number): string => {
    switch (dayOfWeek) {

      case 0:
        return "Monday";
      case 1:
        return "Tuesday";
      case 2:
        return "Wednesday";
      case 3:
        return "Thursday";
      case 4:
        return "Friday";
      case 5:
        return "Saturday";
      case 6:
        return "Sunday";
      default:
        return "";
    }
  }

  return (
    <div id="wrapper" className="d-flex">
      {isSidebarOpen && <Sidebar />}

      <div id="page-content-wrapper">
        {/* Navbar omitted for brevity */}
        <DashNavbar onToggleSidebar={toggleSidebar} />

        <div>
        {pendingInvitations.map(invite => (
          <PendingInvites
            key={invite.id}
            id={invite.id}
            cardTitle={invite.calendar.name}
            date={invite.date}
            time={invite.time}
            onAccept={() => onAccept(invite.id)}
            onDecline={() => onDecline(invite.id)}
          />
        ))}
      </div>

        <div className="container flex-wrap">
          <h3 className="text-left fw-bold mt-3">My Calendars</h3>
          <button type="button" className="btn btn-outline-success mt-3" onClick={() => openModal()}>
            Create Calendar
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
          <CalendarEditModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onSave={createCalendar}
            selectedHighPriority={selectedHighPriority}
            setSelectedHighPriority={setSelectedHighPriority}
            selectedLowPriority={selectedLowPriority}
            setSelectedLowPriority={setSelectedLowPriority}
          />
          <FinalizeMeetingModal
            isOpen={isFinalizeModalOpen}
            onClose={closeFinalizeModal}
            onSave={saveFinalizeModal}
            meetingLength={currentCalendar.meeting_length}
            highPriorityTimes={currentCalendarHighPriorityTimes}
            lowPriorityTimes={currentCalendarLowPriorityTimes}
            selectedFinalTime={selectedFinalTime}
            setSelectedFinalTime={setSelectedFinalTime}
          />
          <div className="upcoming-cont">
            {calendars.map((calendar: CalendarItem) => ( // Use the CalendarItem interface here
              <CalendarCard
                key={calendar.id}
                title={calendar.name}
                date={calendar.deadline}
                timeRange={calendar.meeting_length}
                responsePending={calendar.finalized_day_of_week === undefined || calendar.finalized_time === undefined}
                allResponded={calendar.finalized_day_of_week !== undefined && calendar.finalized_time !== undefined}
                onEditAvailability={() => openModal(calendar)}
                onFinalize={() => openFinalizeModal(calendar)}
                finalTime={calendar.finalized_time || ""}
                finalDay={dayOfWeekToString(calendar.finalized_day_of_week as number)} // Add type assertion here
              />
            ))}
          </div>
        </div>

      </div>


    </div>
  );
};

export default DashboardPage;
