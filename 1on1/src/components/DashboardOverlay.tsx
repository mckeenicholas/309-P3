import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import React from "react";
import { Collapse } from "react-bootstrap";

export const DashboardOverlay = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  console.log(isSidebarOpen);

  return (
    <div id="wrapper" className="d-flex">
      <div>
        <Collapse in={isSidebarOpen} dimension="width">
          <div>
            <Sidebar />
          </div>
        </Collapse>
      </div>
      <div id="page-content-wrapper">
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom ">
          <button className="btn" id="menu-toggle" onClick={toggleSidebar}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <h2 className="navbar-brand mb-0 h1">User Dashboard</h2>
        </nav>
        <Outlet />
      </div>
    </div>
  );
};
