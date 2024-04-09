import React from 'react';
import '../styles/ContactAddModal.css';
import { useState, useEffect} from 'react';


interface ContactAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}


const ContactAddModal: React.FC<ContactAddModalProps> = ({
  isOpen,
  onClose,
  onSave,
  // fullname,
  // setFullname,
  username,
  setUsername,
  // email,
  // setEmail,
  phone,
  setPhone,
}) => {
  const [saveAttempted, setSaveAttempted] = useState(false);

  const handleSave = () => {
    if (!username || !phone) {
      setSaveAttempted(true); 
    } else {
      onSave();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPhone('');
      setSaveAttempted(false);
    }
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-haha">
        <div className="modal-header">
          <h2>New Contact</h2>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="username" className="form-control" id="username" name="username" required
              onChange={(e) => setUsername(e.target.value)}
              value={username}/>
            {saveAttempted && !username && <div style={{color: 'red'}}>This field cannot be blank.</div>}
          </div>
          <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-control" id="phoneNumber" name="phoneNumber" required
                onChange={(e) => setPhone(e.target.value)}
                value={phone}/>
              {saveAttempted && !phone && <div style={{color: 'red'}}>This field cannot be blank.</div>}
            </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button onClick={handleSave} className="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  );
};

export default ContactAddModal;
