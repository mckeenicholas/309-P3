import React from "react";
import NavBar from "../components/NavBar";
import host from "../utils/links";
import { useNavigate } from "react-router-dom";
import AuthRedirect from "../utils/AuthRedirect";

const SignupPage = () => {
  const navigate = useNavigate();

  interface IFormData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password1: string;
    password2: string;
  }

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
    { label: "First Name", id: "first-name", type: "text" },
    { label: "Last Name", id: "last-name", type: "text" },
    { label: "Email", id: "email", type: "email" },
    { label: "Password", id: "password1", type: "password" },
    { label: "Confirm Password", id: "password2", type: "password" },
  ];

  const [formData, setFormData] = React.useState<IFormData>(initialFormData);
  const [hasError, setHasError] = React.useState<{
    status: boolean;
    message: string;
  }>({ status: false, message: "" });

  const submitLoginRequest = async () => {
    setHasError({ status: false, message: "" });

    // Check for empty fields
    if (formData.username === "" || formData.password1 === "") {
      setHasError({
        status: true,
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
      setHasError({ status: true, message: "Email is invalid" });
      setFormData({ ...formData, password1: "", password2: "" });
      return;
    }

    if (formData.password1.length < 8) {
      setHasError({
        status: true,
        message: "Password must be at least 8 characters",
      });
      setFormData({ ...formData, password1: "", password2: "" });
      return;
    }

    if (formData.password1 !== formData.password2) {
      setHasError({ status: true, message: "Passwords didn't match" });
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
        status: true,
        message: Object.values(error)
          .flatMap((value) => value)
          .join(" "),
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
      <NavBar />
      <div className="container my-5 d-flex justify-content-center">
        <div className="p-5 bg-body-tertiary rounded-4 d-md-flex flex-column">
          <h2 className="text-body-emphasis text-center">Sign Up for 1on1:</h2>
          <form className="my-4 d-flex flex-column">
            {renderInputs()}
            <div className="my-1"></div>
            {hasError.status && (
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
