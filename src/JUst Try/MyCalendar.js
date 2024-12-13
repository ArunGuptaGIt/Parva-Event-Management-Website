import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: "Meeting",
    start: new Date(2024, 11, 8, 10, 0), // December 8, 2024, 10 AM
    end: new Date(2024, 11, 8, 12, 0),
  },
  {
    title: "Lunch with Team",
    start: new Date(2024, 11, 15, 13, 0), // December 15, 2024, 1 PM
    end: new Date(2024, 11, 15, 14, 0),
  },
];

export default function MyCalendar() {
  return (
    <div style={{ height: "500px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}
