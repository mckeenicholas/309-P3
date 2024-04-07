import React, { useState } from 'react';
import '../styles/ContactAddModal.css';
import { DayPicker } from 'react-day-picker';
import '../styles/rdp_styles.css';
import { format } from 'date-fns';
import TimeSlotSelector from './TimeSlotSelector'; // Adjust the import path as necessary

interface CalendarAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedTimeSlots: { highPriority: string[], lowPriority: string[] }) => void; // Adjust onSave to include time slot data
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


    React.useEffect(() => {
        if (isOpen) {
            setName(''); // Reset name to default empty string
            setSelectedDays([]); // Reset selectedDays to default empty array
            setSelectedHighPriority([]); // Reset selectedHighPriority to default empty array
            setSelectedLowPriority([]); // Reset selectedLowPriority to default empty array
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

    // Convert selectedDays Date objects to strings for TimeSlotSelector
    const formattedSelectedDays = selectedDays.map(day => format(day, 'yyyy-MM-dd'));

    return (
        <div className="modal-overlay">
            <div className="modal-fit">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>New Calendar</h2>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" id="fullName" name="fullName" required
                                onChange={(e) => setName(e.target.value)}
                                value={name} />
                            <div className="invalid-feedback">
                                Name is required.
                            </div>
                        </div>
                        <div className="date-time-selector-container" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            <div>
                                <h5>Select days you are free:</h5>
                                <DayPicker
                                    mode="multiple"
                                    selected={selectedDays}
                                    onSelect={(value) => { setSelectedDays(value as Date[]); }}
                                    footer={footer}
                                />
                            </div>
                            {selectedDays.length > 0 && (
                                <div>
                                    <TimeSlotSelector
                                        days={formattedSelectedDays}
                                        startTime="09:00"
                                        endTime="17:00"
                                        interval={30}
                                        selectedHighPriority={selectedHighPriority}
                                        selectedLowPriority={selectedLowPriority}
                                        onChangeHighPriority={(newSelectedSlots) => { setSelectedHighPriority(newSelectedSlots); }}
                                        onChangeLowPriority={(newSelectedSlots) => { setSelectedLowPriority(newSelectedSlots); }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={onClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button onClick={handleSave} type="button" className="btn btn-primary">Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarAddModal;
