import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Pricing = () => {
  return (
    <div className="flex-wrapper" style={{ height: "100%" }}>
      <NavBar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center mb-4">
            <p className="fs-5">
              At 1on1, we currently only offer a free tier to all our users. We
              believe in providing value and helping you manage your meetings
              efficiently without no cost!
            </p>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Free Plan</div>
              <div className="card-body">
                <h5 className="card-title">$0/month</h5>
                <p className="card-text">
                  Start scheduling with our comprehensive free plan:
                </p>
                <ul>
                  <li>Unlimited 1:1 meetings</li>
                  <li>Basic scheduling features</li>
                  <li>Email support</li>
                </ul>
                <Link to="/signup" className="btn btn-outline-success">
                  Sign Up for Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
