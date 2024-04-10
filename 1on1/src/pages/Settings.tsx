import React from "react";
import useRequest from "../utils/requestHandler";
import Sidebar from "../components/Sidebar";
import DashNavbar from "../components/DashNavbar";
import { IFormData, userMessage } from "../utils/types";
import host from "../utils/links";
import { useAuth } from "../utils/AuthService";
import { Badge, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Settings = () => {
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

  const [userData, setUserData] = React.useState<IFormData>(initialFormData);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [showMessage, setShowMessage] = React.useState<userMessage>({
    status: null,
    message: "",
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [showModal, setShowModal] = React.useState(false);

  const sendRequest = useRequest();
  const { token, refresh } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const response = await sendRequest("/accounts/profile/", {
        method: "GET",
      });

      const cleanedResponse = { ...initialFormData };

      for (const key in response) {
        if (response.hasOwnProperty(key)) {
          cleanedResponse[key as keyof IFormData] = response[key] || "";
        }
      }

      setUserData(cleanedResponse);
      setIsLoading(false);
    };

    fetchUserData();
  }, [sendRequest]);

  const handleChange = (field: keyof IFormData, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  const clearPasswords = () => {
    setUserData({ ...userData, password1: "", password2: "" });
  };

  const saveUserData = async () => {
    console.log("test");

    setShowMessage({ status: null, message: "" });

    if (
      !(
        userData.email === "" ||
        /^([\w-\.!+%]+@([A-Za-z0-9-]+\.)+[\w-]{2,4})?$/.test(userData.email)
      )
    ) {
      setShowMessage({ status: "error", message: "Email is invalid" });
      clearPasswords();
      return;
    }

    if (!(userData.password1 === "" && userData.password2 === "")) {
      if (userData.password1.length < 8) {
        setShowMessage({
          status: "error",
          message: "Password must be at least 8 characters",
        });
        clearPasswords();
        return;
      }

      if (userData.password1 !== userData.password2) {
        setShowMessage({ status: "error", message: "Passwords didn't match" });
        clearPasswords();
        return;
      }
    }

    const cleanedUserData = {};
    if (userData.username !== "") {
      Object.assign(cleanedUserData, { username: userData.username });
    }
    if (userData.first_name !== "") {
      Object.assign(cleanedUserData, { first_name: userData.first_name });
    }
    if (userData.last_name !== "") {
      Object.assign(cleanedUserData, { last_name: userData.last_name });
    }
    if (userData.email !== "") {
      Object.assign(cleanedUserData, { email: userData.email });
    }
    if (userData.password1 !== "") {
      Object.assign(cleanedUserData, { password: userData.password1 });
    }

    console.log(cleanedUserData);

    const response = await fetch(`${host}/accounts/profile/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cleanedUserData),
    });

    console.log(response);

    if (!response.ok) {
      const error = await response.json();

      setShowMessage({
        status: "error",
        message: Object.values(error)
          .flatMap((value) => value)
          .join(" "),
      });
    } else {
      setShowMessage({
        status: "success",
        message: "Changes saved successfully",
      });
    }
  };

  const deleteAccount = async () => {
    const response = await sendRequest("/accounts/profile/delete/", {
      method: "POST",
      body: JSON.stringify({ refresh: refresh }),
    });
    if (response!) {
      navigate("/");
    } else {
      alert("An error occoured, please contact support.");
    }
  };

  const renderInputs = () => {
    return formFields.map((field) => (
      <div className="my-1" key={field.id}>
        <label htmlFor={field.id} className="text-muted">
          {field.label}
        </label>
        <input
          className="form-control"
          style={{ maxWidth: "400px" }}
          type={field.type}
          id={field.id}
          onChange={(e) =>
            handleChange(field.id as keyof IFormData, e.target.value)
          }
          value={userData[field.id as keyof IFormData]}
        />
      </div>
    ));
  };

  return (
    <div id="wrapper" className="d-flex">
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This cannot be undone!</Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={deleteAccount}
          >
            Delete my account
          </button>
        </Modal.Footer>
      </Modal>
      <div id="page-content-wrapper">
        <div className="container pt-4">
          <div className="col-md-12">
            <h2 className="fw-bold">My Account</h2>
            {isLoading ? (
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <form className="my-4 d-flex flex-column mb-1">
                {renderInputs()}
                <div className="my-2" />
                {showMessage.status === "error" && (
                  <p className="text-danger">{showMessage.message}</p>
                )}
                {showMessage.status === "success" && (
                  <p className="text-success">{showMessage.message}</p>
                )}
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={saveUserData}
                  style={{ maxWidth: "150px" }}
                >
                  Save Changes
                </button>
              </form>
            )}
            <hr />
            <h5 className="fw-bold">Account Removal</h5>
            <p className="mt-2 mb-2 text-danger">
              <Badge bg="danger" className="me-2">
                Warning
              </Badge>
              Deleting your account is permanent and cannot be undone!
            </p>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleShow}
            >
              Delete my account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
