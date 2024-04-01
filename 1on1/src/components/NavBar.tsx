import React from "react";
import { Link, useLocation } from "react-router-dom";
import Collapse from "react-bootstrap/Collapse";

const NavBar = ({
  menuItems = [
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Support", path: "/support" },
  ],
  showLogin = true,
}: {
  menuItems?: { name: string; path: string }[];
  showLogin?: boolean;
}) => {
  const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link
          to="/"
          className="text-decoration-none ms-0"
          style={{ color: "black" }}
        >
          <div className="sidebar-heading text-center py-2 primary-text fs-4 ms-3 me-3 fw-bold text-uppercase">
            <i
              className="fas fa-sharp fa-solid fa-lightbulb me-2"
              style={{ color: "var(--primary-green)" }}
            ></i>
            1on1
          </div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Collapse in={showMenu}>
          <div className="navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {menuItems.map((item) => (
                <li className="nav-item" key={item.name}>
                  <Link
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path && "fw-bold"}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            {showLogin && (
              <form className="d-flex ms-auto">
                <Link to="/login">
                  <button className="btn btn-outline-success" type="button">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="btn btn-success ms-2" type="button">
                    Sign Up
                  </button>
                </Link>
              </form>
            )}
          </div>
        </Collapse>
      </div>
    </nav>
  );
};

export default NavBar;
