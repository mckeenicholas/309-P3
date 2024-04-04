import React from 'react';
import '../styles/ContactAddModal.css';

interface ContactAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  fullname: string;
  setFullname: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}


const ContactAddModal: React.FC<ContactAddModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fullname,
  setFullname,
  username,
  setUsername,
  email,
  setEmail,
  phone,
  setPhone,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <p>hi!</p>
      <div className="modal-haha">
        <div className="modal-header">
          <h2>New Contact</h2>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" id="fullName" name="fullName" required 
              onChange={(e) => setFullname(e.target.value)}
              value={fullname}/>
            <div className="invalid-feedback">
              Full Name is required.
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" id="email" name="email" required
              onChange={(e) => setEmail(e.target.value)}
              value={email}/>
            <div className="invalid-feedback">
              Email is required.
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="username" className="form-control" id="username" name="username" required
              onChange={(e) => setUsername(e.target.value)}
              value={username}/>
            <div className="invalid-feedback">
              Email is required.
            </div>
          </div>
          <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-control" id="phoneNumber" name="phoneNumber" required
                onChange={(e) => setPhone(e.target.value)}
                value={phone}/>
              <div className="invalid-feedback">
                Phone Number is required.
              </div>
            </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button onClick={onSave} className="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  );
};

export default ContactAddModal;
