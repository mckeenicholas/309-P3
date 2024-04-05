import React from 'react';
import '../styles/ContactAddModal.css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface CalendarAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    selected: Date[];
    setSelected: React.Dispatch<React.SetStateAction<Date[]>>;
}


const CalendarAddModal: React.FC<CalendarAddModalProps> = ({
    isOpen,
    onClose,
    onSave,
    name,
    setName,
    selected,
    setSelected,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-haha">
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
                        <h5>Select days you are free:</h5>
                        <DayPicker
                            mode="multiple"
                            selected={selected}
                            onSelect={(days = []) => setSelected(days)}
                        />
                    </div>
                    <div className="modal-footer">
                        <button onClick={onClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button onClick={onSave} type="button" className="btn btn-primary">Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarAddModal;