import  { useEffect, useState } from 'react';
import CalendarCard from "../components/CalendarCard";
import "../styles/Calendars.css";
import useRequest from '../utils/requestHandler'

// Define a TypeScript interface for the calendar items
interface CalendarItem {
  id: string;
  title: string;
  date: string;
  timeRange: string;
  responsePending: boolean;
}

const DashboardPage = () => {
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

  return (
    <div id="wrapper" className="d-flex">
      {/* Sidebar & Page Content omitted for brevity */}

      <div id="page-content-wrapper">
        {/* Navbar omitted for brevity */}

        <div className="container flex-wrap">
          <h3 className="text-left fw-bold mt-3">My Calendars</h3>
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
