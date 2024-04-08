import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/dashboard.css";
const Sidebar: React.FC = () => {
    return (
        <div className="bg-white" id="sidebar-wrapper">
            <div className="sidebar-heading text-center py-4 primary-text fs-4 fw-bold text-uppercase border-bottom">
                <i className="fas fa-sharp fa-solid fa-lightbulb me-2" style={{ color: 'green' }}></i>1on1
            </div>
            <div className="list-group list-group-flush my-3">
                <Link to="/dashboard" className="list-group-item list-group-item-action bg-transparent fw-bold">
                    <i className="fas fa-tachometer-alt me-2"></i>My Calendars
                </Link>
                <Link to="/contact" className="list-group-item list-group-item-action bg-transparent second-text">
                    <i className="fas fa-project-diagram me-2"></i>Contacts
                </Link>
            </div>
            <div id="spacer"></div>
            <div className="sidebar-footer">
                <Link to="/settings" className="list-group-item list-group-item-action bg-transparent second-text">
                    <i className="fas fa-cog me-2"></i>Settings
                </Link>
                <Link to="/help" className="list-group-item list-group-item-action bg-transparent second-text">
                    <i className="fas fa-question-circle me-2"></i>Help
                </Link>
                <Link to="/about" className="list-group-item list-group-item-action bg-transparent second-text">
                    <i className="fas fa-info-circle me-2"></i>About
                </Link>
                <Link to="/logout" className="list-group-item list-group-item-action bg-transparent text-danger fw-bold">
                    <i className="fas fa-power-off me-2"></i>Logout
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
