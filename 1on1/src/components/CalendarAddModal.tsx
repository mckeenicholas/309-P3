import React, { useState, useEffect } from 'react';
import '../styles/CalendarAddModal.css';
import { DayPicker } from 'react-day-picker';
import '../styles/rdp_styles.css';
import { format } from 'date-fns';
import TimeSlotSelector from './TimeSlotSelector'; // Adjust the import path as necessary

interface CalendarAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedTimeSlots: { highPriority: string[], lowPriority: string[] }) => void;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    selectedDays: Date[];
    setSelectedDays: React.Dispatch<React.SetStateAction<Date[]>>;
    selectedHighPriority: string[];
    setSelectedHighPriority: React.Dispatch<React.SetStateAction<string[]>>;
    selectedLowPriority: string[];
    setSelectedLowPriority: React.Dispatch<React.SetStateAction<string[]>>;
}

const CalendarAddModal: React.FC<CalendarAddModalProps> = ({
    isOpen,
    onClose,
    onSave,
    name,
    setName,
    selectedDays,
    setSelectedDays,
    selectedHighPriority,
    setSelectedHighPriority,
    selectedLowPriority,
    setSelectedLowPriority,
}) => {
    // New state to manage the step in the modal process
    const [step, setStep] = useState<number>(1);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setSelectedDays([]);
            setSelectedHighPriority([]);
            setSelectedLowPriority([]);
            setStep(1); // Reset to step 1 when modal is opened
        }
    }, [isOpen, setName, setSelectedDays, setSelectedHighPriority, setSelectedLowPriority]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            highPriority: selectedHighPriority,
            lowPriority: selectedLowPriority,
        });
    };

    const footer =
        selectedDays && selectedDays.length > 0 ? (
            <p>You selected {selectedDays.length} day(s).</p>
        ) : (
            <p>Please pick one or more days.</p>
        );

    const formattedSelectedDays = selectedDays.map(day => format(day, 'yyyy-MM-dd'));

    return (
        <div className="modal-overlay">
            <div className="modal-fit">
                <div className="modal-content">
                    {step === 1 && (
                        <div className="modal-header">
                            <h2>New Calendar</h2>
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
                                        id="fullName"
                                        name="fullName"
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                    />
                                    <div className="invalid-feedback">Name is required.</div>
                                </div>
                                <h5>Select days you are free:</h5>
                                <DayPicker
                                    mode="multiple"
                                    selected={selectedDays}
                                    onSelect={(value) => setSelectedDays(value as Date[])}
                                    footer={footer}
                                />
                            </>
                        )}
                        {step === 2 && (
                            <TimeSlotSelector
                                days={formattedSelectedDays}
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
                        {step === 1 && (
                            <>
                                <button onClick={onClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button onClick={() => setStep(2)} type="button" className="btn btn-primary" disabled={selectedDays.length === 0}>
                                    Next
                                </button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <button onClick={() => setStep(1)} type="button" className="btn btn-secondary">
                                    Back
                                </button>
                                <button onClick={handleSave} type="button" className="btn btn-primary">
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
