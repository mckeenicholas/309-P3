import React from "react";

interface PendingInvitesProps {
  id: string;
  cardTitle: string;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const PendingInvites: React.FC<PendingInvitesProps> = ({
  id,
  cardTitle,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="card border-dark" style={{ width: "18rem" }}>
      <img
        src="./calendar.png"
        className="card-img-top ms-2 mt-1 calendar-pic"
        alt="Calendar"
        style={{ width: "50px", height: "auto" }} // Match image styling from CalendarCard
      />
      <div className="card-body">
        <h5 className="card-title">{cardTitle}</h5>
      </div>
      <div className="card-body">
        <button onClick={() => onAccept(id)} className="btn btn-success">
          Yes
        </button>
        <button onClick={() => onDecline(id)} className="btn btn-danger">
          No
        </button>
      </div>
    </div>
  );
};

export default PendingInvites;
