import React, { useState, useEffect } from 'react';
import '../styles/CalendarAddModal.css';
import '../styles/rdp_styles.css';
import TimeSlotSelector from './TimeSlotSelector'; // Adjust the import path as necessary

interface CalendarEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedTimeSlots: { highPriority: string[], lowPriority: string[] }) => void;
    selectedHighPriority: string[];
    setSelectedHighPriority: React.Dispatch<React.SetStateAction<string[]>>;
    selectedLowPriority: string[];
    setSelectedLowPriority: React.Dispatch<React.SetStateAction<string[]>>;
}

const CalendarEditModal: React.FC<CalendarEditModalProps> = ({
    isOpen,
    onClose,
    onSave,
    selectedHighPriority,
    setSelectedHighPriority,
    selectedLowPriority,
    setSelectedLowPriority,
}) => {

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
                    <div className="modal-body">
                        <TimeSlotSelector
                            startTime="09:00"
                            endTime="17:00"
                            interval={30}
                            selectedHighPriority={selectedHighPriority}
                            selectedLowPriority={selectedLowPriority}
                            onChangeHighPriority={setSelectedHighPriority}
                            onChangeLowPriority={setSelectedLowPriority}
                        />
                    </div>
                    <div className="modal-footer">
                        <>
                            <button onClick={onClose} type="button" className="btn btn-secondary">
                                Close
                            </button>
                            <button onClick={handleSave} type="button" className="btn btn-primary">
                                Save
                            </button>
                        </>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CalendarEditModal;
