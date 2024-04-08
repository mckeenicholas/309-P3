import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex-wrapper" style={{ height: "100%" }}>
      <div className="container py-5">
        <div className="col-md-10 mx-auto text-center">
          <h2 className="fw-bold">Page not found</h2>
          <p className="mb-4">
            Sorry! But we can't seem to find the page you're looking for.
          </p>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
