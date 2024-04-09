import React, { useState, useEffect, CSSProperties } from 'react';
import moment from 'moment';
import '../styles/TimeSlotSelector.css';

interface TimeSlotSelectorProps {
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
    dayOfWeek: number; // Day of the week as an integer, where Monday is 0
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
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
        margin: '0 auto',
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

    const generateTimeSlots = (dayOfWeek: number): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        let currentTime = moment(startTime, 'HH:mm');
        const end = moment(endTime, 'HH:mm');

        while (currentTime.isBefore(end)) {
            slots.push({
                time: currentTime.format('HH:mm'),
                dayOfWeek: dayOfWeek,
            });
            currentTime.add(interval, 'minutes');
        }

        return slots;
    };

    const handleMouseDown = (e: React.MouseEvent, time: string, dayOfWeek: number) => {
        e.preventDefault(); // Prevent text selection
        setIsDragging(true);
        toggleSlotSelection(`${dayOfWeek}-${time}`);
    };

    const handleMouseEnter = (time: string, dayOfWeek: number) => {
        if (isDragging) {
            toggleSlotSelection(`${dayOfWeek}-${time}`);
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
        }
    };

    const toggleSlotSelection = (slotIdentifier: string): void => {
        let newSelectedSlots = { ...selectedSlots };
        const isHighPriority = prioritySelection === 'high';
        const currentPriorityList = newSelectedSlots[isHighPriority ? 'highPriority' : 'lowPriority'];
        const otherPriorityList = newSelectedSlots[isHighPriority ? 'lowPriority' : 'highPriority'];

        const currentIndex = currentPriorityList.indexOf(slotIdentifier);
        const otherIndex = otherPriorityList.indexOf(slotIdentifier);

        if (currentIndex > -1) {
            newSelectedSlots[isHighPriority ? 'highPriority' : 'lowPriority'] = currentPriorityList.filter(item => item !== slotIdentifier);
        } else if (otherIndex > -1) {
            newSelectedSlots[isHighPriority ? 'highPriority' : 'lowPriority'] = [...currentPriorityList, slotIdentifier];
            newSelectedSlots[isHighPriority ? 'lowPriority' : 'highPriority'] = otherPriorityList.filter(item => item !== slotIdentifier);
        } else {
            newSelectedSlots[isHighPriority ? 'highPriority' : 'lowPriority'] = [...currentPriorityList, slotIdentifier];
        }

        setSelectedSlots(newSelectedSlots);
    };

    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // Monday to Sunday

    return (
        <div>
            <select value={prioritySelection} onChange={(e) => setPrioritySelection(e.target.value as 'high' | 'low')}>
                <option value="high">High Priority</option>
                <option value="low">Low Priority</option>
            </select>
            <div className='day-container' onMouseUp={handleMouseUp}>
                {daysOfWeek.map(dayOfWeek => (
                    <div key={dayOfWeek} style={{ width: '80px', textAlign: 'center' }}>
                        <h5>{moment().day(dayOfWeek + 1).format('ddd')}</h5>
                        <div>
                            {generateTimeSlots(dayOfWeek).map(slot => {
                                const slotIdentifier = `${dayOfWeek}-${slot.time}`;
                                return (
                                    <button
                                        key={slotIdentifier}
                                        style={{
                                            ...timeSlotButtonStyle,
                                            backgroundColor: selectedSlots.highPriority.includes(slotIdentifier) ? '#029a02' :
                                                selectedSlots.lowPriority.includes(slotIdentifier) ? '#e5e82a' : ''
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, slot.time, dayOfWeek)}
                                        onContextMenu={(e) => e.preventDefault()}
                                        onMouseEnter={() => handleMouseEnter(slot.time, dayOfWeek)}
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
