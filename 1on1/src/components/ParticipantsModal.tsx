import React, { useState } from 'react';
import useRequest from '../utils/requestHandler';
import '../styles/ParticipantsModal.css';

interface Participant {
  name: string;
  email: string;
  isAccepted: boolean;
}

interface Contact {
  id: string;
  email: string;
  fullname: string;
  contactee: number;
}

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemind: (participant: Participant) => void;
  participants: Participant[];
  isOwner: boolean;
  userContacts: Contact[];
  currentCalendarId: string;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  isOpen,
  onClose,
  onRemind,
  participants,
  isOwner,
  userContacts,
  currentCalendarId
}) => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [remindedParticipants, setRemindedParticipants] = useState<string[]>([]);
  const sendRequest = useRequest(); // Replace with your actual API request function

  const handleRemind = (participant: Participant) => {
    onRemind(participant);
    setRemindedParticipants((prev) => [...prev, participant.email]);
  };

  const handleInvite = async () => {
    console.log(selectedContactId)
    if (selectedContactId && currentCalendarId) {
      // Find the contact object based on the selectedContactId
      const selectedContact = userContacts.find(contact => contact.id === selectedContactId);
      console.log(selectedContactId)
      if (!selectedContact) {
        console.error('Selected contact not found');
        return;
      }
      
      try {
        await sendRequest(`/calendars/invitations/`, {
          method: 'POST',
          body: JSON.stringify({
            calendar_id: currentCalendarId,
            receiver_id: selectedContact.contactee, // Use contactee number as receiver_id
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // Add logic to handle successful invitation
        setSelectedContactId(null); // Reset the selection
      } catch (error) {
        console.error('Failed to send invitation', error);
      }
    }
};

  const handleClose = () => {
    setSelectedContactId(null);
    setRemindedParticipants([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        // <div className="modal">
        <div className="modal-overlay">
          <div className="modal-haha">
            <div className="modal-header">
              <h5 className="modal-title">Meeting Participants</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              {participants.map((participant, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div className="fw-bold">{participant.name}</div>
                    <div className="text-muted">{participant.email}</div>
                  </div>
                  <div>
                    {participant.isAccepted ? (
                      <span style={{ color: 'green' }}>Accepted</span>
                    ) : remindedParticipants.includes(participant.email) ? (
                      <button className="btn btn-sm btn-outline-secondary" disabled>
                        Reminded
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemind(participant)}
                      >
                        Remind
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {isOwner && (
                <>
                  <div className="form-group">
                    <label htmlFor="contact-dropdown">Select Contact</label>
                    <select 
                      className="form-control" 
                      id="contact-dropdown"
                      value={selectedContactId || ''}
                      onChange={(e) => setSelectedContactId(e.target.value)}
                    >
                      <option value="">Select a contact</option>
                      {userContacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                          {contact.fullname || `${contact.contactee} (No name provided)`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleInvite}
                    disabled={!selectedContactId}
                  >
                    Invite User
                  </button>
                </>
              )}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
        // </div>
      )}
    </>
  );
}

export default ParticipantsModal;
