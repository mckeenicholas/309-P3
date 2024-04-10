import * as ics from "ics";
import { Meeting } from "./types";

const getMeetingDates = (meeting: Meeting) => {
  const currentDate = new Date();
  const deadline = new Date(meeting.deadline);
  // Make sure deadline is included
  deadline.setDate(deadline.getDate() + 1);
  const finalizedDayOfWeek = meeting.finalized_day_of_week;
  const finalizedTimeParts = meeting.finalized_time.split(":").map(Number);
  const [hours, minutes, seconds] = finalizedTimeParts;

  // Calculate the milliseconds until the next finalized day of the week
  let msUntilNextDay = (finalizedDayOfWeek + 8 - currentDate.getDay()) % 7;
  if (msUntilNextDay === 0 && currentDate.getHours() > hours) {
    msUntilNextDay = 7; // If it's already passed for the current week, schedule for next week
  }

  const meetingDates = [];

  // Generate meeting dates until the deadline
  while (currentDate <= deadline) {
    currentDate.setDate(currentDate.getDate() + msUntilNextDay);
    const meetingDate = new Date(currentDate);
    meetingDate.setHours(hours, minutes, seconds, 0);
    if (meetingDate <= deadline) {
      meetingDates.push(meetingDate);
    }
    msUntilNextDay = 7; // Reset to weekly interval
  }

  return meetingDates;
};

const generateCalendar = (name: string, calendars: Meeting[]) => {
  let events:
    | ics.EventAttributes[]
    | {
        title: string;
        start: [number, number, number, number, number];
        end: [number, number, number, number, number];
      }[] = [];

  calendars.map((item) => {
    if (item.finalized_day_of_week !== null) {
      const dates = getMeetingDates(item);
      dates.map((date) => {
        const startDateArray: ics.DateArray = [
          date.getFullYear(),
          date.getMonth() + 1, // Months are 1-based in ics format
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
        ];

        const endDateArray: ics.DateArray = [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
        ];

        const icalEvent = {
          title: item.name,
          start: startDateArray,
          end: endDateArray,
        };

        events.push(icalEvent);
      });
    }
  });

  const { error, value } = ics.createEvents(events);

  if (error) {
    console.log(error);
    return;
  }

  if (!value) {
    return;
  }

  const blob = new Blob([value], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
};

export default generateCalendar;
