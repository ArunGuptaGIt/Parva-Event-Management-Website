import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Addevent.css";
import "./AddeventBox.css";
import "./AddeventVenueinfo.css";
import AdminNav from "./AdminPages/AdminNav";
import EventTracker from "./EventTracker";

function Addevent() {
  const [venues, setVenues] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedvenuePhoto, setSelectedvenuePhoto] = useState(null);
  const [error, setError] = useState("");
  const [newEvent, setNewEvent] = useState({
    event_name: "",
    organizers_name: "",
    booked_date: "",
    venuePhoto: "", // This will hold the venue photo URL
    ending_date: "",
    venue: "",
    email: "",
    no_of_people: "",
    phone_number: "",
  });
  

  // Fetch venues from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/parva_website/admins/add_venue/")
      .then((response) => {
        setVenues(response.data);
      })
      .catch((error) => {
        console.error("Error fetching venues:", error);
      });
  }, []);

  const handleBookNow = (venue, venuePhoto) => {
    setShowEventForm(true);
    setSelectedVenue(venue);
    setSelectedvenuePhoto(venuePhoto);
    // Use the venue's photo URL when booking the event
    setNewEvent({ ...newEvent, venue: venue.name, venuePhoto: venuePhoto });
    setShowInfo(false); // Hide the venue details when booking
  };

  const handleInfoNow = (venue, venuePhoto) => {
    setShowInfo(true);
    setSelectedVenue(venue);
    setSelectedvenuePhoto(venuePhoto);
    setShowEventForm(false); // Ensure the event form is hidden
  };

  const handleCloseInfo = () => setShowInfo(false);
  const handleCloseForm = () => setShowEventForm(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = () => {
    const eventData = {
      ...newEvent,
      no_of_people: parseInt(newEvent.no_of_people, 10),
    };

    // Send the event data, including the venuePhoto associated with the selected venue
    axios
      .post("http://127.0.0.1:8000/parva_website/admins/add_event/", eventData)
      .then(() => {
        setError("");
        setShowEventForm(false);
        setNewEvent({
          event_name: "",
          organizers_name: "",
          booked_date: "",
          venuePhoto: "", // Clear the venue photo
          ending_date: "",
          venue: "",
          email: "",
          no_of_people: "",
          phone_number: "",
        });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const errorMessage = Object.values(error.response.data)
            .flat()
            .join(". ");
          setError(errorMessage);  // This will set the error message from backend
        } else {
          setError("An unexpected error occurred.");
        }
      });
  };

  return (
    <div>
      <AdminNav />
      <div className="nothing"></div>
      <div className="mainlayout">
        {/* Left Side Content */}
        <div className="leftyside">
          <h1>Select Venue</h1>
          <div className="venueselections">
            {venues.map((venue) => (
              <div className="venuebox" key={venue.id}>
                <div className="image">
                  <img
                    src={`http://127.0.0.1:8000${venue.venuePhoto}`}
                    className="venue-photo"
                    height="100%"
                    width="100%"
                  />
                </div>
                <div className="detail">
                  <div className="venuename cent">{venue.name}</div>
                  <div className="location cent">
                    <i className="material-symbols-outlined">pin_drop</i>
                    {venue.location}
                  </div>
                  <div className="noofpeople cent">
                    <i className="material-symbols-outlined">groups</i>
                    {venue.capacity}
                  </div>
                  <div className="buttons">
                    <button
                      className="update"
                      onClick={() => handleInfoNow(venue, venue.venuePhoto)}
                    >
                      View Info
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Venue Details Section */}
          {showInfo && selectedVenue && (
            <div className="modelup">
              <div className="venueinfodetail">
                <button className="close-button" onClick={handleCloseInfo}>
                  X
                </button>
                <h1>Venue Details</h1>
                <div className="titles">{selectedVenue.name}</div>
                <div className="location cmm">
                  <i className="material-symbols-outlined">location_on</i>
                  {selectedVenue.location}
                </div>
                <div className="about">
                  About
                  <p>{selectedVenue.description}</p>
                </div>
                <div className="accom cmm">
                  <i className="material-symbols-outlined">groups</i>
                  {selectedVenue.capacity}
                </div>
                <button
                  className="newbook"
                  onClick={() => handleBookNow(selectedVenue, selectedvenuePhoto)}
                >
                  Book Now
                </button>
              </div>
            </div>
          )}

          {/* Add Your Event Form Section */}
          {showEventForm && (
            <div className="border">
              <button className="close-button" onClick={handleCloseForm}>
                X
              </button>
              <h1 className="title">Add Your Event</h1>
              {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
              <form>
                <label className="same">
                  Event Name
                  <input
                    className="getdetail"
                    type="text"
                    name="event_name"
                    value={newEvent.event_name}
                    onChange={handleInputChange}
                  />
                </label>
                <br />
                <label className="same">
                  Organizer Name
                  <input
                    className="getdetail"
                    type="text"
                    name="organizers_name"
                    value={newEvent.organizers_name}
                    onChange={handleInputChange}
                  />
                </label>
                <div className="dateselection">
                  <div className="datelabel">
                    Starting Date and Time
                    <input
                      className="getdetail dater"
                      type="datetime-local"
                      name="booked_date"
                      value={newEvent.booked_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="datelabel">
                    Ending Date and Time
                    <input
                      className="getdetail dater"
                      type="datetime-local"
                      name="ending_date"
                      value={newEvent.ending_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <br />
                <label className="same">
                  No of People
                  <input
                    className="getdetail"
                    type="number"
                    name="no_of_people"
                    value={newEvent.no_of_people}
                    onChange={handleInputChange}
                  />
                </label>
                <br />
                <label className="same">
                  Email Address
                  <input
                    className="getdetail"
                    type="email"
                    name="email"
                    value={newEvent.email}
                    onChange={handleInputChange}
                  />
                </label>
                <br />
                <label className="same">
                  Contact Number
                  <input
                    className="getdetail"
                    type="number"
                    name="phone_number"
                    value={newEvent.phone_number}
                    onChange={handleInputChange}
                  />
                </label>
                <br />
                <button
                  className="eventerbutton"
                  type="button"
                  onClick={handleAddEvent}
                >
                  Add Event
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side Content */}
        <div className="rightyside">
          <div className="eventtrack">
            <h1 className="ttle">Events Booked</h1>
            <EventTracker />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Addevent;
