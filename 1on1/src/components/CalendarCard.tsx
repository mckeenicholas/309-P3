import React from "react";
import calendarPic from "/calendar.png"; // Adjust the path as necessary

interface CalendarCardProps {
  title: string;
  date: string;
  timeRange: number;
  //responsePending: boolean;
  allResponded: boolean; // New prop to indicate if all participants have responded
  finalTime: string; // New prop to indicate the finalized time
  finalDay: string; // New prop to indicate the finalized day
  onEditAvailability: () => void;
  onFinalize: () => void;
  onViewParticipants: () => void;
  isOwner: boolean; // New prop to indicate if the user is the owner of the calendar
}

const CalendarCard: React.FC<CalendarCardProps> = ({
  title,
  date,
  timeRange,
  //responsePending,
  allResponded,
  finalTime,
  finalDay,
  onEditAvailability,
  onFinalize,
  onViewParticipants,
  isOwner,
}) => {
  return (
    <div className="card border-dark" style={{ width: "18rem" }}>
      <img
        src={calendarPic}
        className="card-img-top ms-2 mt-1 calendar-pic"
        alt="Calendar"
        style={{ width: "50px", height: "auto" }} // Adjust the width as needed
      />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Deadline: {formatDate(date)}</li>
        <li className="list-group-item">Meeting duration: {timeRange} minutes</li>
      </ul>
      <div className="card-body">
        <a
          href="#"
          className="card-link px-3"
          data-bs-toggle="modal"
          data-bs-target={allResponded ? "#seeResults" : "#seeResultsGreen"}
          onClick={onViewParticipants}
        >
          See Participants
        </a>
      </div>
      <div className="card-body">
        <a
          href="#"
          className="card-link px-3"
          data-bs-toggle="modal"
          data-bs-target="#viewCalendarAdmin"
          onClick={onEditAvailability}
        >
          Edit my availability
        </a>
      </div>
      <div className="card-footer">
        {finalTime === "" && isOwner ? (
          <button className="btn btn-primary" onClick={onFinalize} disabled={!allResponded}>
            Finalize
          </button>
        ) : (
          <div>
            <p>Meeting set: {finalDay} {finalTime}</p>
          </div>
        )}
      </div>
    </div>
  );

  function formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString(undefined, options);
    return formattedDate;
  }
};

export default CalendarCard;
