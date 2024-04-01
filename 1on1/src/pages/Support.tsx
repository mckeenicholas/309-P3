import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Support = () => {
  return (
    <div className="flex-wrapper" style={{ height: "100%" }}>
      <NavBar />
      <div className="container py-5">
        <div className="row">
          <div className="col-md-10 mx-auto text-center">
            <h2 className="fw-bold">Contact Us</h2>
            <p className="mb-4">
              If you encounter any problems or just want to chat, don't hesitate
              to reach out to us:
            </p>
            <div>
              <p>
                <strong>Email:</strong>{" "}
                <Link to="mailto:support@oneonone.com">
                  support@oneonone.com
                </Link>
              </p>
              <p>
                <strong>Call Us:</strong>{" "}
                <Link to="tel:+16476722828">+1 647-672-2828</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
