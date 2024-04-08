import React from 'react'; // Ensure React is in scope when using JSX
import '../styles/dashboard.css';

interface DashNavbarProps {
    onToggleSidebar: () => void;
  }

const DashNavbar: React.FC<DashNavbarProps> = ({ onToggleSidebar }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <button className="btn" id="menu-toggle" onClick={onToggleSidebar}>
                <span className="navbar-toggler-icon"></span>
            </button>
            <h2 className="navbar-brand mb-0 h1">User Dashboard</h2>
        </nav>
    )
};

export default DashNavbar;