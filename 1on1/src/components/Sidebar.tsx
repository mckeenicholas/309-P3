import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { useAuth } from "../utils/AuthService";

const Sidebar: React.FC = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // A function to determine if the path matches the current location
  const isActive = (path: string) => location.pathname === path;

  const logoutWrapper = async () => {
    const sucess = await logOut();
    console.log(sucess);
    if (sucess! === true) {
      navigate("/dashboard");
    } else {
      alert(sucess);
    }
  };
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-light"
      style={{ width: "280px", height: "100vh" }}
    >
      <div className="sidebar-heading text-center py-4 primary-text fs-4 fw-bold text-uppercase border-bottom">
        <i
          className="fas fa-sharp fa-solid fa-lightbulb me-2"
          style={{ color: "green" }}
        ></i>
        1on1
      </div>
      <div className="list-group list-group-flush my-3">
        <Link
          to="/dashboard"
          className={`list-group-item list-group-item-action bg-transparent  ${isActive("/dashboard") ? "fw-bold" : ""}`}
        >
          <i className="fas fa-tachometer-alt me-2"></i>My Calendars
        </Link>
        <Link
          to="/contacts"
          className={`list-group-item list-group-item-action bg-transparent mt-4 ${isActive("/contacts") ? "fw-bold" : ""}`}
        >
          <i className="fas fa-project-diagram me-2"></i>Contacts
        </Link>
      </div>
      <div id="spacer"></div>
      <ul className="nav nav-pills flex-column mt-auto">
        <li>
          <Link to="/settings" className="nav-link text-dark">
            <i className="fas fa-cog me-2"></i>Settings
          </Link>
        </li>
        <li>
          <Link to="/help" className="nav-link text-dark">
            <i className="fas fa-question-circle me-2"></i>Help
          </Link>
        </li>
        <li>
          <Link to="/about" className="nav-link text-dark">
            <i className="fas fa-info-circle me-2"></i>About
          </Link>
        </li>
        <li>
          <Link to="#" onClick={logoutWrapper} className="nav-link text-danger">
            <i className="fas fa-power-off me-2"></i>Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
