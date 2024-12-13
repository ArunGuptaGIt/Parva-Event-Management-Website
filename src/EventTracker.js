import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Addevent.css";
import "./EventTracker.css";

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

// Custom Toolbar Component
const CustomToolbar = ({ label, onNavigate }) => {
  return (
    <div className="custom-toolbar">
      <button onClick={() => onNavigate("PREV")}>{"<"}</button>
      <span className="toolbar-label">{label}</span>
      <button onClick={() => onNavigate("NEXT")}>{">"}</button>
    </div>
  );
};

export default function EventTracker() {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/parva_website/admins/approved_events/")
      .then((response) => {
        const fetchedEvents = response.data.map((event) => {
          const formattedStartTime = format(new Date(event.booked_date), "HH:mm");
          const formattedEndTime = format(new Date(event.ending_date), "HH:mm");

          return {
            title: `${event.event_name} - Venue: ${event.venue} - Starting: ${formattedStartTime} - Ending: ${formattedEndTime}`,
            start: new Date(event.booked_date),
            end: new Date(event.ending_date),
          };
        });
        setEvents(fetchedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    console.log("Selected slot:", { start, end });
  };

  return (
    <div>
      <div style={{ height: "50px", marginTop: "20px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          style={{ height: "550px", width: "400px" }}
          views={["month"]} // Only show the "Month" view
          components={{
            toolbar: CustomToolbar, // Use the custom toolbar
          }}
        />
      </div>

      {selectedSlot && (
        <div style={{ marginTop: "20px" }}>
          <h3>Selected Time Range</h3>
          <p>
            Start: {format(selectedSlot.start, "HH:mm")} <br />
            End: {format(selectedSlot.end, "HH:mm")}
          </p>
        </div>
      )}
    </div>
  );
}
