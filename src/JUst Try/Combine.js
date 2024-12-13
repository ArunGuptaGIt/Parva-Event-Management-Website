import React, { useEffect, useState } from "react";
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

const fetchGoogleSheetData = async () => {
  const sheetId = "impressive-rig-444010-j2"; // Replace with your Google Sheet ID
  const range = "Sheet1!A2:D";
  const apiKey = "AIzaSyAhdpzoGFAVlU7NjbPOd8SUA5BSiRGHeVw";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.values; // Returns rows of data
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    return [];
  }
};

export default function Combine() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      const rows = await fetchGoogleSheetData();
      const formattedEvents = rows.map((row) => ({
        title: row[0], // Event title
        start: new Date(row[1]), // Start date
        end: new Date(row[2]), // End date
      }));
      setEvents(formattedEvents);
    };
    getEvents();
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Calendar */}
      <div style={{ flex: 2 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>

      {/* Events Table */}
      <div style={{ flex: 1 }}>
        <h3>Event List</h3>
        <table border="1">
          <thead>
            <tr>
              <th>Title</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index}>
                <td>{event.title}</td>
                <td>{format(event.start, "yyyy-MM-dd HH:mm")}</td>
                <td>{format(event.end, "yyyy-MM-dd HH:mm")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
