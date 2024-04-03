import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../utils/AuthService";
import React from "react";

const LogInPage = () => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [hasError, setHasError] = React.useState<boolean>(false);

  const { logIn } = useAuth();
  const navigate = useNavigate();

  const logInRequest = async () => {
    if (await logIn(username, password)) {
      navigate("/dashboard");
    } else {
      setHasError(true);
      setPassword("");
    }
  };

  return (
    <div className="flex-wrapper" style={{ height: "100%" }}>
      <NavBar showLogin={false} />
      <div className="container my-5 d-flex justify-content-center">
        <div className="p-5 bg-body-tertiary rounded-4 d-md-flex flex-column">
          <h2 className="text-body-emphasis text-center">Log in to 1on1:</h2>
          <p className="mt-4 mb-0 text-center">
            Not a member already?{" "}
            <Link className="text-link" to="/signup">
              Sign up!
            </Link>
          </p>
          <form className="my-4 d-flex flex-column mb-1">
            <label htmlFor="userid" className="text-muted">
              Username
            </label>
            <input
              className="form-control mb-3"
              type="text"
              name="Username"
              id="userid"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password" className="text-muted">
              Password
            </label>
            <input
              className="form-control mb-3"
              type="password"
              name="Username"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {hasError && (
              <p className="text-danger">Username or password is incorrect</p>
            )}
            <a className="text-link" href="#">
              <p className="small">Forgot password?</p>
            </a>
            <button
              type="button"
              className="btn btn-success"
              onClick={logInRequest}
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
