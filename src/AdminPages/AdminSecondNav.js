import React from 'react';
import './AdminSecondNav.css';
import { Link } from 'react-router-dom';

function AdminSecondNav() {
  return (
    <div>
      <div className="main-body">
        <div className="common first">
           <Link to ="/firstpage"> <li>Requests</li> </Link>
        </div>
        <div className="common seconds">
          <Link to="/history"><li>History</li> </Link>
        </div>
        <div className="common thirds">
          <Link to="/ourVenue"><li>Our Venue</li> </Link>
        </div>
       
      </div>
    </div>
  )
}

export default AdminSecondNav
