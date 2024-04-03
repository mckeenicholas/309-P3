import React from "react";
import calendarPic from "/calendar.png"; // Adjust the path as necessary

interface CalendarCardProps {
  title: string;
  date: string;
  timeRange: string;
  responsePending: boolean;
}

const CalendarCard: React.FC<CalendarCardProps> = ({
  title,
  date,
  timeRange,
  responsePending,
}) => {
  return (
    <div className="card border-dark" style={{ width: "18rem" }}>
      <img
        src={calendarPic}
        className="card-img-top ms-2 mt-1 calendar-pic"
        alt="Calendar"
      />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">{date}</li>
        <li className="list-group-item">{timeRange}</li>
      </ul>
      <div className="card-body">
        <a
          href="#"
          className="card-link px-3"
          data-bs-toggle="modal"
          data-bs-target={responsePending ? "#seeResults" : "#seeResultsGreen"}
        >
          {responsePending
            ? "1 person has not responded"
            : "Everybody is ready to meet!"}
        </a>
      </div>
      <div className="card-body">
        <a
          href="#"
          className="card-link px-3"
          data-bs-toggle="modal"
          data-bs-target="#viewCalendarAdmin"
        >
          See Calendar
        </a>
      </div>
    </div>
  );
};

export default CalendarCard;
