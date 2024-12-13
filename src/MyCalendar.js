import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // Import default styling

export default function MyCalendar({ onDateSelect }) {
  const [date, setDate] = useState(new Date());

  const onDateChange = (selectedDate) => {
    setDate(selectedDate);
    if (onDateSelect) {
      onDateSelect(selectedDate); // Notify parent component about the selected date
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Calendar className="calendarbox" onChange={onDateChange} value={date} />
      <div className="selecteddate" style={{ marginTop: '20px' }}>
        <strong>Selected Date:</strong> {date.toDateString()}
      </div>
    </div>
  );
}