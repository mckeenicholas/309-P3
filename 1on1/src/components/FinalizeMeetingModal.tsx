import React, { useState } from 'react';

interface NonBusyTime {
    id: string;
    user: string;
    calendar: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    preference_level: number;
}

interface FinalizeMeetingModalProps {
    meetingLength: number;
    highPriorityTimes: NonBusyTime[];
    lowPriorityTimes: NonBusyTime[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedTime: NonBusyTime) => void;
}

const findOverlap = (times: NonBusyTime[]): NonBusyTime[] => {
    const userToTimes = new Map<string, NonBusyTime[]>();
    times.forEach((time) => {
        const userTimes = userToTimes.get(time.user) || [];
        userTimes.push(time);
        userToTimes.set(time.user, userTimes);
    });
    let overlapTimes: NonBusyTime[] = [];
    let initial = true;
    userToTimes.forEach((userTimes) => {
        if (initial) {
            overlapTimes.push(...userTimes);
            initial = false;
        } else {
            overlapTimes.forEach((overlapTime, index) => {
                const matchingTime = userTimes.find((userTime) => {
                    return (
                        userTime.day_of_week === overlapTime.day_of_week &&
                        userTime.start_time === overlapTime.start_time
                    );
                });

                if (!matchingTime) {
                    overlapTimes.splice(index, 1);
                }
            });
        }
    });

    return overlapTimes;
}

const is30MinutesApart = (time1: string, time2: string): boolean => {
    const date1 = new Date(`1970-01-01T${time1}`);
    const date2 = new Date(`1970-01-01T${time2}`);
    const diff = Math.abs(date1.getTime() - date2.getTime());
    return diff === 30 * 60 * 1000;
}

const findConsecutiveTimeWindows = (times: NonBusyTime[], meetingLength: number): NonBusyTime[] => {
    const sortedTimes: NonBusyTime[] = times.slice().sort((a, b) => {
        if (a.day_of_week !== b.day_of_week) {
            return a.day_of_week - b.day_of_week;
        } else {
            return a.start_time.localeCompare(b.start_time);
        }
    });

    const meetingSlotLength = Math.floor(meetingLength / 30)
    let possibleMeetingTimes: NonBusyTime[] = [];
    for (let i = 0; i < sortedTimes.length - 1; i++) {
        let isLongEnough = true;
        for (let j = 0; j < meetingSlotLength - 1; j++) {
            if (i + j + 1 >= sortedTimes.length) {
                isLongEnough = false;
                break;
            }
            if (!is30MinutesApart(sortedTimes[i + j].start_time, sortedTimes[i + j + 1].start_time)) {
                isLongEnough = false;
                break;
            }
        }
        if (isLongEnough) {
            possibleMeetingTimes.push(sortedTimes[i]);
        }
    }

    return possibleMeetingTimes;
}


const FinalizeMeetingModal: React.FC<FinalizeMeetingModalProps> = ({
    meetingLength,
    highPriorityTimes,
    lowPriorityTimes,
    isOpen,
    onClose,
    onSave,
}) => {
    const [selectedTime, setSelectedTime] = useState<NonBusyTime | null>(null);

    if (!isOpen) return null;

    const calculatePossibleMeetingTimes = (): NonBusyTime[] => {
        const highPriorityOverlapTimes = findOverlap(highPriorityTimes);
        const highPriorityConsecutiveTimes = findConsecutiveTimeWindows(highPriorityOverlapTimes, meetingLength);
        if (highPriorityConsecutiveTimes.length > 0) {
            return highPriorityConsecutiveTimes;
        }

        const bothPriorityOverlapTimes = findOverlap([...highPriorityTimes, ...lowPriorityTimes]);
        const bothPriorityConsecutiveTimes = findConsecutiveTimeWindows(bothPriorityOverlapTimes, meetingLength);
        return bothPriorityConsecutiveTimes;
    };


    const possibleMeetingTimes = calculatePossibleMeetingTimes();

    const dayOfWeekToString = (dayOfWeek: number): string => {
        switch (dayOfWeek) {

            case 0:
                return "Monday";
            case 1:
                return "Tuesday";
            case 2:
                return "Wednesday";
            case 3:
                return "Thursday";
            case 4:
                return "Friday";
            case 5:
                return "Saturday";
            case 6:
                return "Sunday";
            default:
                return "";
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-fit">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Pick a meeting time</h2>
                    </div>
                    <div className="modal-body">
                        <div style={{ display: isOpen ? 'block' : 'none' }}>
                            <div>
                                {possibleMeetingTimes.length > 0 ? (
                                    possibleMeetingTimes.map((time) => (
                                        <div key={time.id} onClick={() => setSelectedTime(time)}>
                                            Day: {dayOfWeekToString(time.day_of_week)}, Start: {time.start_time}
                                        </div>
                                    ))
                                ) : (
                                    <p>No possible meeting times found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={onClose} type="button" className="btn btn-secondary">
                            Close
                        </button>
                        <button onClick={() => selectedTime && onSave(selectedTime)}
                            type="button" className="btn btn-primary" disabled={possibleMeetingTimes.length == 0}>
                            Finalize
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default FinalizeMeetingModal;
