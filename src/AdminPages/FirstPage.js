import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';
import AdminSecondNav from './AdminSecondNav';
import './FirstPage.css';
import axios from 'axios';


function FirstPage() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(null);
    const [events, setEvent] = useState([]);

    // Check if user is admin
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

    // Fetch event data
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/parva_website/admins/add_event/')
            .then(response => {
                console.log('Event Data:', response.data); // Debugging
                setEvent(response.data);
            })
            .catch(error => {
                console.error('Error fetching event data:', error.response?.data || error.message);
            });
    }, []);

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Handle event rejection
    const handleReject = (eventId) => {
        axios.post(`http://127.0.0.1:8000/parva_website/admins/reject_event/${eventId}/`)
            .then(response => {
                console.log('Reject Response:', response.data); // Debugging
                alert('Event rejected successfully');
                setEvent(events.filter(event => event.id !== eventId));
            })
            .catch(error => {
                console.error('Error rejecting event:', error.response?.data || error.message);
                alert('An error occurred while rejecting the event.');
            });
    };

    // Handle event acceptance
    const handelAccept = (eventId) => {
        axios.post(`http://127.0.0.1:8000/parva_website/admins/accept_event/${eventId}/`)
            .then(response => {
                console.log('Accept Response:', response.data); // Debugging
                alert('Event accepted successfully');
                setEvent(events.filter(event => event.id !== eventId));
            })
            .catch(error => {
                console.error('Error accepting event:', error.response?.data || error.message);
                alert('An error occurred while accepting the event.');
            });
    };

    if (isAdmin === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <AdminNav />
            <AdminSecondNav />
            <div className="forborder"></div>
            <div className="listtype">
                {events.map(event => (
                    <div key={event.id} className="list">
                        <div className="mainbody">
                            <div className='EventHeading' style={{ color: '#A49C00' }}> {event.event_name} </div>
                            <div className='tx'><i class="material-symbols-outlined">pin_drop</i> {event.venue}</div>
                            <div className='tx'><i className="material-symbols-outlined">person</i> {event.organizers_name}</div>
                            <div className='tx'><i className="material-symbols-outlined">groups</i> {event.no_of_people}</div>
                            <div className='tx'><i className="material-symbols-outlined">call</i> {event.phone_number}</div>
                            <div className='tx'><i className="material-symbols-outlined">mail</i> {event.email}</div>
                            {/* <img
                                        src={`http://127.0.0.1:8000${event.venuePhoto}`}
                                        className="venue-photo"
                                        height='100%'
                                        width='100%'
                                    /> */}
                            <div className="events">
                                <div className='tx'>Event Starts : {formatDate(event.booked_date)}</div>
                                <div className='tx'>Event Ends : {formatDate(event.ending_date)}</div>
                            </div>
                        </div>
                        <div className="clickable">
                            <button className='Reject' onClick={() => handleReject(event.id)}><img src="6711656.png" alt="" width="40rem" /></button>
                            <button className='Accept' onClick={() => handelAccept(event.id)}><img src="right.png" alt="" width="40rem" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default FirstPage;
