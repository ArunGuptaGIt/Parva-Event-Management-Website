import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import './OurVenue.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function OurVenue() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(null);
    const [venues, setVenues] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const [newVenue, setNewVenue] = useState({
        name: '',
        capacity: '',
        location: '',
        description: '',
        contact: '',
        email: '',
        venuePhoto: null,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingVenueId, setEditingVenueId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

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

    // Fetch existing venues using GET request
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/parva_website/admins/add_venue/')
            .then(response => {
                setVenues(response.data);
            })
            .catch(error => {
                console.error('Error fetching venue data:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVenue({ ...newVenue, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewVenue({ ...newVenue, venuePhoto: file });

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        // Append fields to FormData
        Object.keys(newVenue).forEach((key) => {
            if (key === 'venuePhoto') {
                // Only append venuePhoto if a new file is selected
                if (newVenue.venuePhoto instanceof File) {
                    formData.append(key, newVenue[key]);
                }
            } else {
                formData.append(key, newVenue[key]);
            }
        });
    
        if (isEditing) {
            axios
                .put(`http://127.0.0.1:8000/parva_website/admins/add_venue/${editingVenueId}/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    setVenues(venues.map((venue) => (venue.id === editingVenueId ? response.data : venue)));
                    resetForm();
                })
                .catch((error) => {
                    console.error('Error updating venue:', error);
                });
        } else {
            axios
                .post('http://127.0.0.1:8000/parva_website/admins/add_venue/', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    setVenues([...venues, response.data]);
                    resetForm();
                })
                .catch((error) => {
                    console.error('Error creating venue:', error);
                });
        }
    };
    
    
    

    const resetForm = () => {
        setNewVenue({
            name: '',
            capacity: '',
            location: '',
            description: '',
            contact: '',
            email: '',
            venuePhoto: '',
        });
        setIsEditing(false);
        setEditingVenueId(null);
    };

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:8000/parva_website/admins/add_venue/${id}/`)
            .then(() => {
                setVenues(venues.filter(venue => venue.id !== id));
            })
            .catch(error => {
                console.error('Error deleting venue:', error);
            });
    };

    const handleEdit = (venue) => {
        setIsEditing(true);
        setEditingVenueId(venue.id);
        setNewVenue({
            name: venue.name,
            capacity: venue.capacity,
            location: venue.location,
            description: venue.description,
            contact: venue.contact,
            email: venue.email,
            venuePhoto: venue.venuePhoto
        });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = venues.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(venues.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <AdminNav />
            <div>
      <div className="main-body">
        <div className="common firsts">
           <Link to ="/firstpage"> <li>Requests</li> </Link>
        </div>
        <div className="common seconds">
          <Link to="/history"><li>History</li> </Link>
        </div>
        <div className="common third">
          <Link to="/ourVenue"><li>Our Venue</li> </Link>
        </div>
       
      </div>
    </div>
            <div className="forborder"></div>
            <div className="layoutstyle">
                <div className="lefty">
                    <div className="addvenue">
                        <h1>{isEditing ? 'Edit Venue' : 'Add Venue'}</h1>
                        <div className="eventsdetails">
                            Name of the Venue
                            <input
                                type="text"
                                className="inputboxes"
                                name="name"
                                value={newVenue.name}
                                onChange={handleInputChange}
                                placeholder="Venue Name"
                            />
                        </div>
                        <div className="eventsdetails">
                            No of People
                            <input
                                type="number"
                                className="inputboxes"
                                name="capacity"
                                value={newVenue.capacity}
                                onChange={handleInputChange}
                                placeholder="Capacity"
                            />
                        </div>
                        <div className="eventsdetails">
                            Address
                            <input
                                type="text"
                                className="inputboxes"
                                name="location"
                                value={newVenue.location}
                                onChange={handleInputChange}
                                placeholder="Location"
                            />
                        </div>
                        <div className="eventsdetails">
                            Description
                            <input
                                type="text"
                                className="inputboxes"
                                name="description"
                                value={newVenue.description}
                                onChange={handleInputChange}
                                placeholder="Description"
                            />
                        </div>
                        <div className="eventsdetails">
                            Contact
                            <input
                                type="number"
                                className="inputboxes"
                                name="contact"
                                value={newVenue.contact}
                                onChange={handleInputChange}
                                placeholder="Contact"
                            />
                        </div>
                        <div className="eventsdetails">
                            Email
                            <input
                                type="email"
                                className="inputboxes"
                                name="email"
                                value={newVenue.email}
                                onChange={handleInputChange}
                                placeholder="something@email.com"
                            />
                        </div>
                        <div className="eventsdetails">
                            <label htmlFor="img">Select image:</label>
                            <input
                                type="file"
                                id="img"
                                name="venuePhoto"
                                onChange={handleFileChange}
                            />
                        </div>

                        {imagePreview && <img src={imagePreview} alt="Venue Preview" width="100" height="100" />}

                        <center>
                            <button className="venuebutton" onClick={handleSubmit}>
                                {isEditing ? 'Update Venue' : 'Add Venue'}
                            </button>
                            {isEditing && (
                                <button className="venuebutton" type="button" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </center>
                    </div>
                </div>
                <div className="righty">
                    <div className="venueselection">
                        {currentItems.map(venue => (
                            <div key={venue.id} className="venuebox">
                                <div className="image">
                                    <img
                                        src={`http://127.0.0.1:8000${venue.venuePhoto}`}
                                        className="venue-photo"
                                        height='100%'
                                        width='100%'
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
                                        <button className="update" onClick={() => handleEdit(venue)}>
                                            Edit
                                        </button>
                                        <button className="update" onClick={() => handleDelete(venue.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={pageNumber === currentPage ? 'active' : ''}
                            >
                                {pageNumber}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OurVenue;