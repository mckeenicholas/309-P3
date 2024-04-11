import React, { useState, useEffect } from "react";
import "../styles/CalendarAddModal.css";
import "../styles/rdp_styles.css";
import { format } from "date-fns";
import TimeSlotSelector from "./TimeSlotSelector"; // Adjust the import path as necessary

interface CalendarAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedTimeSlots: {
    highPriority: string[];
    lowPriority: string[];
  }) => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  selectedHighPriority: string[];
  setSelectedHighPriority: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLowPriority: string[];
  setSelectedLowPriority: React.Dispatch<React.SetStateAction<string[]>>;
  meetingLength: number;
  setMeetingLength: React.Dispatch<React.SetStateAction<number>>;
  deadline?: Date;
  setDeadline: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const CalendarAddModal: React.FC<CalendarAddModalProps> = ({
  isOpen,
  onClose,
  onSave,
  name,
  setName,
  selectedHighPriority,
  setSelectedHighPriority,
  selectedLowPriority,
  setSelectedLowPriority,
  meetingLength,
  setMeetingLength,
  deadline,
  setDeadline,
}) => {
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setMeetingLength(60); // Reset meeting length
      setDeadline(undefined); // Reset deadline
      setSelectedHighPriority([]);
      setSelectedLowPriority([]);
      setStep(1); // Reset to step 1 when modal is opened
    }
  }, [
    isOpen,
    setName,
    setMeetingLength,
    setDeadline,
    setSelectedHighPriority,
    setSelectedLowPriority,
  ]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      highPriority: selectedHighPriority,
      lowPriority: selectedLowPriority,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-fit">
        <div className="modal-content">
          {step === 1 && (
            <div className="modal-header">
              <h2>New Calendar Setup</h2>
            </div>
          )}
          <div className="modal-body">
            {step === 1 && (
              <>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="calendarName"
                    name="calendarName"
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Meeting Length</label>
                  <select
                    className="form-select"
                    id="meetingLength"
                    name="meetingLength"
                    required
                    onChange={(e) => setMeetingLength(parseInt(e.target.value))}
                    value={meetingLength}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="30">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    id="deadline"
                    name="deadline"
                    onChange={(e) => setDeadline(new Date(e.target.value))}
                    value={deadline ? format(deadline, "yyyy-MM-dd") : ""}
                  />
                </div>
              </>
            )}
            {step === 2 && (
              <TimeSlotSelector
                startTime="09:00"
                endTime="17:00"
                interval={30}
                selectedHighPriority={selectedHighPriority}
                selectedLowPriority={selectedLowPriority}
                onChangeHighPriority={setSelectedHighPriority}
                onChangeLowPriority={setSelectedLowPriority}
              />
            )}
          </div>
          <div className="modal-footer">
            {step == 1 && (
              <>
                <button
                  onClick={onClose}
                  type="button"
                  className="btn btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={() => setStep(2)}
                  type="button"
                  className="btn btn-primary"
                  disabled={!name || !deadline}
                >
                  Next
                </button>
              </>
            )}
            {step == 2 && (
              <>
                <button
                  onClick={() => setStep(step - 1)}
                  type="button"
                  className="btn btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  type="button"
                  className="btn btn-primary"
                >
                  Create
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarAddModal;
