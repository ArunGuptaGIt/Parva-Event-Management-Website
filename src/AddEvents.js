import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

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
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(""); // State to store the error message
  const [newEvent, setNewEvent] = useState({
    organizers_name: "",
    booked_date: "",
    ending_date: "",
    venue: "",
    email: "",
    no_of_people: "",
    phone_number: "",
  });

  // Fetch approved events
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/parva_website/admins/approved_events/")
      .then((response) => {
        const approvedEvents = response.data.map((event) => ({
          ...event,
          booked_date: new Date(event.booked_date),
          ending_date: new Date(event.ending_date),
          title: event.organizers_name,
          venue: event.venue,
        }));
        setEvents(approvedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Handle add event
  const handleAddEvent = () => {
    const eventData = {
      organizers_name: newEvent.organizers_name,
      booked_date: newEvent.booked_date,
      ending_date: newEvent.ending_date,
      venue: newEvent.venue,
      email: newEvent.email,
      no_of_people: parseInt(newEvent.no_of_people, 10),
      phone_number: newEvent.phone_number,
    };

    axios
      .post("http://127.0.0.1:8000/parva_website/admins/add_event/", eventData)
      .then((response) => {
        setEvents([
          ...events,
          {
            ...eventData,
            booked_date: new Date(newEvent.booked_date),
            ending_date: new Date(newEvent.ending_date),
            title: newEvent.organizers_name,
            venue: newEvent.venue,
          },
        ]);
        setError(""); // Clear error on success
        setModalIsOpen(false);
        setNewEvent({
          organizers_name: "",
          booked_date: "",
          ending_date: "",
          venue: "",
          email: "",
          no_of_people: "",
          phone_number: "",
        });
      })
      .catch((error) => {
        // Handle validation errors
        if (error.response && error.response.data) {
          const errorMessage = Object.values(error.response.data)
            .flat()
            .join(". ");
          setError(errorMessage);
        } else {
          setError("An unexpected error occurred.");
        }
      });
  };

  return (
    <div>
      <h1>Event Tracker</h1>
      <button onClick={() => setModalIsOpen(true)}>Add New Event</button>
      <div style={{ height: "500px", marginTop: "20px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="booked_date"
          endAccessor="ending_date"
          style={{ height: "1000px" }}
        />
      </div>

      <Modal
        className="ModelPage"
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <h2>Add Event</h2>
        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>} {/* Display error */}
        <form>
          <label>
            Organizers Name:
            <input
              type="text"
              name="organizers_name"
              value={newEvent.organizers_name}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Booked Date and Time:
            <input
              type="datetime-local"
              name="booked_date"
              value={newEvent.booked_date}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Ending Date and Time:
            <input
              type="datetime-local"
              name="ending_date"
              value={newEvent.ending_date}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Venue:
            <input
              type="text"
              name="venue"
              value={newEvent.venue}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={newEvent.email}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Number of people:
            <input
              type="number"
              name="no_of_people"
              value={newEvent.no_of_people}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Phone number:
            <input
              type="text"
              name="phone_number"
              value={newEvent.phone_number}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <button type="button" onClick={handleAddEvent}>
            Add Event
          </button>
          <button type="button" onClick={() => setModalIsOpen(false)}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
}