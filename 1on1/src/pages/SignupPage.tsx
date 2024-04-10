import React from "react";
import NavBar from "../components/NavBar";
import host from "../utils/links";
import { Link, useNavigate } from "react-router-dom";
import AuthRedirect from "../utils/AuthRedirect";
import { IFormData, userMessage } from "../utils/types";
import { formatErrors } from "../utils/formatErrors";

const SignupPage = () => {
  const navigate = useNavigate();

  const initialFormData = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password1: "",
    password2: "",
  };

  const formFields = [
    { label: "Username", id: "username", type: "text" },
    { label: "First Name", id: "first_name", type: "text" },
    { label: "Last Name", id: "last_name", type: "text" },
    { label: "Email", id: "email", type: "email" },
    { label: "Password", id: "password1", type: "password" },
    { label: "Confirm Password", id: "password2", type: "password" },
  ];

  const [formData, setFormData] = React.useState<IFormData>(initialFormData);
  const [hasError, setHasError] = React.useState<userMessage>({
    status: null,
    message: "",
  });

  const submitLoginRequest = async () => {
    setHasError({ status: null, message: "" });

    // Check for empty fields
    if (formData.username === "" || formData.password1 === "") {
      setHasError({
        status: "error",
        message: "One or more required field(s) above is blank",
      });
      return;
    }

    if (
      !(
        formData.email === "" ||
        /^([\w-\.!+%]+@([A-Za-z0-9-]+\.)+[\w-]{2,4})?$/.test(formData.email)
      )
    ) {
      setHasError({ status: "error", message: "Email is invalid" });
      setFormData({ ...formData, password1: "", password2: "" });
      return;
    }

    if (formData.password1.length < 8) {
      setHasError({
        status: "error",
        message: "Password must be at least 8 characters",
      });
      setFormData({ ...formData, password1: "", password2: "" });
      return;
    }

    if (formData.password1 !== formData.password2) {
      setHasError({ status: "error", message: "Passwords didn't match" });
      setFormData({ ...formData, password1: "", password2: "" });
      return;
    }

    const response = await fetch(`${host}/accounts/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password1,
        first_name: formData.first_name,
        last_name: formData.last_name,
      }),
    });

    if (!response.ok) {
      const error = (await response.json()).error;

      setHasError({
        status: "error",
        message: formatErrors(error),
      });
      setFormData({ ...formData, password1: "", password2: "" });
    } else {
      navigate("/login");
    }
  };

  const handleChange = (field: keyof IFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderInputs = () => {
    return formFields.map((field) => (
      <div className="my-1" key={field.id}>
        <label htmlFor={field.id} className="text-muted">
          {field.label}
        </label>
        <input
          className="form-control"
          type={field.type}
          id={field.id}
          onChange={(e) =>
            handleChange(field.id as keyof IFormData, e.target.value)
          }
          value={formData[field.id as keyof IFormData]}
          required={
            field.id === "username" ||
            field.id === "new-password" ||
            field.id === "confirm-password"
          }
        />
      </div>
    ));
  };

  return (
    <div className="flex-wrapper" style={{ height: "100%" }}>
      <AuthRedirect redirectPath="/dashboard" />
      <NavBar showLogin={false} />
      <div className="container my-5 d-flex justify-content-center">
        <div className="p-5 bg-body-tertiary rounded-4 d-md-flex flex-column">
          <h2 className="text-body-emphasis text-center">Sign Up for 1on1:</h2>
          <p className="mt-4 mb-0 text-center">
            Already a member?{" "}
            <Link className="text-link" to="/login">
              Sign in!
            </Link>
          </p>
          <form className="my-4 d-flex flex-column">
            {renderInputs()}
            <div className="my-1"></div>
            {hasError.status === "error" && (
              <p className="text-danger">{hasError.message}</p>
            )}
            <button
              type="button"
              className="btn btn-success"
              onClick={submitLoginRequest}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
