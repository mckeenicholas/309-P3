import NavBar from "../components/NavBar";

const Features = () => {
  return (
    <div className="flex-wrapper" style={{ height: "100%" }}>
      <NavBar />
      <div className="container my-5">
        <div className="p-5 bg-body-tertiary rounded-4">
          <h1 className="text-body-emphasis fw-bold">1on1 Features</h1>
          <p className="col-md-8 fs-4">
            Simplify your meeting schedules with ease.
          </p>
          <ul className="list-unstyled">
            <li>👥 Create and manage your contact list.</li>
            <li>📅 Schedule meetings effortlessly.</li>
            <li>⏰ Set preferences for meeting times.</li>
            <li>📧 Automated email invitations and reminders.</li>
            <li>🔗 Unique links for easy scheduling.</li>
            <li>🔄 Update and move meetings as needed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Features;
