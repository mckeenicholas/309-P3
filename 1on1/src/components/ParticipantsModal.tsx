import React, { useState } from 'react';
import '../styles/ParticipantsModal.css';

interface Participant {
  name: string;
  email: string;
  isAccepted: boolean;
}

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemind: (participant: Participant) => void;
  participants: Participant[];
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({ isOpen, onClose, onRemind, participants }) => {
  const [remindedParticipants, setRemindedParticipants] = useState<string[]>([]);

  const handleRemind = (participant: Participant) => {
    onRemind(participant);
    setRemindedParticipants((prev: string[]) => [...prev, participant.email]);
  };

  const handleClose = () => {
    setRemindedParticipants([]);
    onClose();
  }

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
