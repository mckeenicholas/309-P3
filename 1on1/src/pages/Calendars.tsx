//import React from 'react';
import CalendarCard from "../components/CalendarCard";
import './Calendars.css'

const DashboardPage = () => {
    return (
        <div id="wrapper" className="d-flex">
            {/* Sidebar (omitted for brevity) */}

            {/* Page Content */}
            <div id="page-content-wrapper">
                <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                    {/* Toggler & Brand (omitted for brevity) */}
                </nav>

                <div className="container flex-wrap">
                    <h3 className="text-left fw-bold mt-3">My Calendars</h3>
                    <div className="upcoming-cont">
                        {/* Render the CalendarCard component three times */}
                        <CalendarCard title="My Calendar" date="Friday, January 30th" timeRange="6:00 - 7:00 PM" responsePending={true} />
                        <CalendarCard title="Team Meeting" date="Monday, February 5th" timeRange="2:00 - 3:00 PM" responsePending={false} />
                        <CalendarCard title="Project Deadline" date="Wednesday, February 10th" timeRange="All Day" responsePending={false} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
