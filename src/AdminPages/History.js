import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNav from "./AdminNav";
import './History.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function History() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
   useEffect(() => {
          const storedUser = localStorage.getItem('user');
          const adminStatus = storedUser ? JSON.parse(storedUser).admin_or_not : null;
          console.log('Admin Status:', adminStatus); // Debugging
  
          if (!adminStatus) {
              navigate('/403');
          } else {
              setIsAdmin(true);
          }
      }, [navigate]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/parva_website/admins/get_history/")
      .then((response) => {
        console.log(response.data);
        setEvents(response.data);
        setFilteredItems(response.data); // Assuming all items are filtered initially
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
      });
  }, []);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div>
      <AdminNav />
      <div>
      <div className="main-body">
        <div className="common firsts">
           <Link to ="/firstpage"> <li>Requests</li> </Link>
        </div>
        <div className="common second">
          <Link to="/history"><li>History</li> </Link>
        </div>
        <div className="common thirds">
          <Link to="/ourVenue"><li>Our Venue</li> </Link>
        </div>
       
      </div>
    </div>

      <div className="forborder"></div>
      <div className="listtypes">
        {paginatedItems.map((event) => (
          <div 
            className="list" 
            key={event.id} >
              <div className="imagepart">
                <img
                    src={`http://127.0.0.1:8000${event.venuePhoto}`}
                    className="venue-photo"
                    height="100%"
                    width="100%"
                  />
                </div>
            <div className="mainbodys">
               
              <div className="EventHeading" style={{ color: "#A49C00" }}>
                {event.name}
              </div>
              <div className="tx">
              <div className='tx'><i class="material-symbols-outlined">person</i> {event.organizers_name}</div>
              </div>
              <div className="tx">
              <div className='tx'><i class="material-symbols-outlined">groups</i> {event.no_of_people}</div>
              </div>
              <div className="tx">
                <i className="material-symbols-outlined">call</i>
                {event.phone_number}
              </div>
              <div className="tx">
                <i className="material-symbols-outlined">mail</i>
                {event.email}
              </div>
            </div>
            <div className="events">
              <div className="tx">Event Starts: {formatDate(event.booked_date)}</div>
              <div className="tx">Event Ends: {formatDate(event.ending_date)}</div>
              <div className="tx"><label>{event.status}</label></div>
            </div>
            </div>
          
        ))}
      </div>

      {/* Pagination Controls */}
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
  );
}

export default History;

