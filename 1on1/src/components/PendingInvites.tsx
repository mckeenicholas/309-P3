import React from 'react';
import "./side.css";

interface PendingInvitesProps {
    cardTitle: string;
    date: string;
    time: string;
}

const PendingInvites: React.FC<PendingInvitesProps> = ({ cardTitle, date, time }) => {
    return (
        <div className="card border-dark" style={{ width: '18rem' }}>
            <img src="./calendar.png" className="card-img-top ms-2 mt-1 calendar-pic" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{cardTitle}</h5>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">{date}</li>
                <li className="list-group-item">{time}</li>
            </ul>
            <div className="card-body">
                <button className="btn btn-success">Yes</button>
                <button className="btn btn-danger">No</button>
                <a href="#" className="card-link px-3" data-bs-toggle="modal" data-bs-target="#viewCalendar">See Calendar</a>
            </div>
        </div>
    );
};

export default PendingInvites;