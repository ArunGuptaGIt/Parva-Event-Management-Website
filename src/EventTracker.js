
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";  // Importing format function
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './Addevent.css';
import './EventTracker.css';

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

export default function EventTracker() {
  const [events, setEvents] = useState([]); // State for calendar events
  const [selectedSlot, setSelectedSlot] = useState(null); // State for selected slot

  // Fetch events from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/parva_website/admins/approved_events/") // Update this URL to match your API endpoint
      .then((response) => {
        const fetchedEvents = response.data.map((event) => {
          // Format time to show only HH:mm (hours and minutes)
          const formattedStartTime = format(new Date(event.booked_date), 'HH:mm');
          const formattedEndTime = format(new Date(event.ending_date), 'HH:mm');

          return {
            title: `${event.event_name}\n in ${event.venue}`,
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

  // Handle slot selection
  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    console.log("Selected slot:", { start, end }); // Debugging
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
        />
      </div>

      
    </div>
  );
}
