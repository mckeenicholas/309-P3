import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import moment from 'moment';
import '../styles/TimeSlotSelector.css';

interface TimeSlotSelectorProps {
    days: string[];
    startTime: string;
    endTime: string;
    interval: number;
    onChangeHighPriority: (selectedHighPriority: string[]) => void;
    onChangeLowPriority: (selectedLowPriority: string[]) => void;
    selectedHighPriority: string[];
    selectedLowPriority: string[];
}

interface TimeSlot {
    time: string;
    dateTime: string;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
    days,
    startTime,
    endTime,
    interval,
    onChangeHighPriority,
    onChangeLowPriority,
    selectedHighPriority,
    selectedLowPriority,
}) => {

    const timeSlotButtonStyle: CSSProperties = {
        display: 'block',
        margin: '0 0',
        width: '80px',
        height: '30px',
        textAlign: 'center',
    };

    const [prioritySelection, setPrioritySelection] = useState<'high' | 'low'>('high');
    const [selectedSlots, setSelectedSlots] = useState<{
        highPriority: string[];
        lowPriority: string[];
    }>({
        highPriority: selectedHighPriority,
        lowPriority: selectedLowPriority,
    });

    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        onChangeHighPriority(selectedSlots.highPriority);
        onChangeLowPriority(selectedSlots.lowPriority);
    }, [selectedSlots, onChangeHighPriority, onChangeLowPriority]);

    const generateTimeSlots = (day: string): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        let currentTime = moment(startTime, 'HH:mm');
        const end = moment(endTime, 'HH:mm');

        while (currentTime.isBefore(end)) {
            slots.push({
                time: currentTime.format('HH:mm'),
                dateTime: moment(day).format('YYYY-MM-DD') + 'T' + currentTime.format('HH:mm'),
            });
            currentTime.add(interval, 'minutes');
        }

        return slots;
    };

    const handleMouseDown = (e: React.MouseEvent, dateTime: string) => {
        e.preventDefault(); // Prevent text selection
        setIsDragging(true);
        toggleSlotSelection(dateTime);
    };

    const handleMouseEnter = (dateTime: string) => {
        if (isDragging) {
            toggleSlotSelection(dateTime);
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
        }
    };

    const toggleSlotSelection = (dateTime: string): void => {
        let newSelectedSlots = { ...selectedSlots };
        const isHighPriority = prioritySelection === 'high';
        const currentPriorityList = newSelectedSlots[isHighPriority ? 'highPriority' : 'lowPriority'];
        const otherPriorityList = newSelectedSlots[isHighPriority ? 'lowPriority' : 'highPriority'];

        const currentIndex = currentPriorityList.indexOf(dateTime);
        const otherIndex = otherPriorityList.indexOf(dateTime);

        if (currentIndex > -1) {
            newSelectedSlots[isHighPriority ? 'highPriority' : 'lowPriority'] = currentPriorityList.filter(item => item !== dateTime);
        } else if (otherIndex > -1) {
            newSelectedSlots[isHighPriority ? 'highPriority' : 'lowPriority'] = [...currentPriorityList, dateTime];
            newSelectedSlots[isHighPriority ? 'lowPriority' : 'highPriority'] = otherPriorityList.filter(item => item !== dateTime);
        } else {
            newSelectedSlots[isHighPriority ? 'highPriority' : 'lowPriority'] = [...currentPriorityList, dateTime];
        }

        setSelectedSlots(newSelectedSlots);
    };

    return (
        <div>
            <select value={prioritySelection} onChange={(e) => setPrioritySelection(e.target.value as 'high' | 'low')}>
                <option value="high">High Priority</option>
                <option value="low">Low Priority</option>
            </select>
            <div className='day-container' onMouseUp={handleMouseUp}>
                {days.sort().map(day => (
                    <div key={day} style={{ width: '80px', textAlign: 'center' }}>
                        <h5>{moment(day).format('MMM. DD')}</h5>
                        <div>
                            {generateTimeSlots(day).map(slot => {
                                return (
                                    <button
                                        key={slot.dateTime}
                                        style={{
                                            ...timeSlotButtonStyle,
                                            backgroundColor: selectedSlots.highPriority.includes(slot.dateTime) ? '#029a02' :
                                                selectedSlots.lowPriority.includes(slot.dateTime) ? '#e5e82a' : ''
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, slot.dateTime)}
                                        onContextMenu={(e) => e.preventDefault()}
                                        onMouseEnter={() => handleMouseEnter(slot.dateTime)}
                                    >
                                        {slot.time}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimeSlotSelector;
