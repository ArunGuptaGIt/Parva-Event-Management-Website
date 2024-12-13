import React, { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import "./organizer.css";
import axios from "axios";
import MyCalendar from "./MyCalendar";
import EventTracker from './EventTracker';
import { Link } from "react-router-dom";

export default function Organizer({ searchQuery = "", setSearchQuery }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [event, setEvent] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false); 

  // Fetching event data from the API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/parva_website/admins/approved_events/")
      .then((response) => {
        console.log("Fetched events:", response.data); // Debugging API response
        setEvent(response.data);
        setFilteredItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, []);

  // Filtering events based on search and selected date
  useEffect(() => {
    const filtered = event
      .filter((evt) => {
        const matchesSearch =
          searchQuery === "" ||
          new RegExp(`\\b${searchQuery.toLowerCase()}\\b`, "i").test(String(evt.event_name)?.toLowerCase()) || // Event Name
          new RegExp(`\\b${searchQuery.toLowerCase()}\\b`, "i").test(String(evt.no_of_people)?.toLowerCase()) || // No of People
          new RegExp(`\\b${searchQuery.toLowerCase()}\\b`, "i").test(String(evt.organizers_name)?.toLowerCase()) || // Organizers Name
          new RegExp(`\\b${searchQuery.toLowerCase()}\\b`, "i").test(String(evt.phone_number)?.toLowerCase()) || // Phone Number
          new RegExp(`\\b${searchQuery.toLowerCase()}\\b`, "i").test(String(evt.email)?.toLowerCase()) ||// Email
          new RegExp(`\\b${searchQuery.toLowerCase()}\\b`, "i").test(String(evt.venue)?.toLowerCase());
        const matchesDate =
          !selectedDate ||
          (evt.booked_date &&
            new Date(evt.booked_date).toDateString() === new Date(selectedDate).toDateString());
  
        return matchesSearch && matchesDate;
      })
      .sort((a, b) => new Date(a.booked_date) - new Date(b.booked_date)); // Sort by booked_date in ascending order
  
    setFilteredItems(filtered);
  }, [event, searchQuery, selectedDate]);
  
  

  
  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Formatting date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="nothing"></div>
      <div className="image">
        <img src="Banner.png" alt="Banner" width="100%" />
      </div>

      <div className="search-bars secondsearch">
        <input
          type="text"
          className="search"
          placeholder="Search Venue / Events / Size"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <i className="magnifier material-symbols-outlined">search</i>
      </div>

      <div className="layout">
        <div className="calendar">
         <div className="naming"> Filter Events By Date </div>


          <MyCalendar onDateSelect={setSelectedDate} />
          <br />
          <div className="showDetailEvents">
            <button className="detailevent" onClick={() => setShowModal(true)}>View EventSheet</button>
          </div>
          {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            <EventTracker/>
          </div>
        </div>
      )}
      <button className="addEventer"><Link to="/addEvent">Add Events</Link></button>
        </div>

        <div className="eventgrid">
          <center><div className="naming">Upcoming Events</div></center>
          <div className="mainboxlayer">

            {paginatedItems.map((events) => (
              
              <div className="box" key={events.id}>
                {console.log(events.event_name)}
                <div className="imagepart">
                <img
                    src={`http://127.0.0.1:8000${events.venuePhoto}`}
                    className="venue-photo"
                    height="100%"
                    width="100%"
                  />
                </div>
                <div className="written">
                  <div className="onepart">
                <div className="EventHeading" style={{ color: "#A49C00" }}>
                   
                    {events.event_name}
                </div>
                <div className="orglayout">
                <i class="material-symbols-outlined">pin_drop</i> {events.venue}
                  </div>
                  <div className="orglayout">
                    <i className="material-symbols-outlined">person</i> {events.organizers_name}
                  </div>
                  <div className="orglayout">
                    <i className="material-symbols-outlined">groups</i> {events.no_of_people}
                  </div>
                  <div className="orglayout">
                    <i className="material-symbols-outlined">call</i> {events.phone_number}
                  </div>
                  <div className="orglayout">
                    <i className="material-symbols-outlined">mail</i> {events.email}
                  </div>
                  </div>
                  <div className="events">
                    <div className="orglayout">
                      Event Starts: {formatDate(events.booked_date)}
                    </div>
                    <div className="orglayout">
                      Event Ends: {formatDate(events.ending_date)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {paginatedItems.length === 0 && (
              <div className="no-results">No results found</div>
            )}
          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={page === currentPage}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
