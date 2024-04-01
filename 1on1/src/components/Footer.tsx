import { Outlet } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <Outlet />
      <footer className="bg-body-tertiary text-center text-lg-start fixed-bottom">
        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
        >
          Copyright 2024 by 1on1.
        </div>
      </footer>
    </>
  );
};

export default Footer;
