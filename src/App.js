import './App.css';
import Login from './login';
import Signup from "./signup";
import React, { useState } from "react";


import Organizer from './organizer';


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstPage from './AdminPages/FirstPage';
import History from './AdminPages/History';
import OurVenue from './AdminPages/OurVenue';
import Addevent from './Addevent';




function App() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <>
    <Router>
      <Routes>
        <Route path='/firstpage' element={<FirstPage/>}/>
        <Route path="/" element={<Organizer searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path='/ourVenue' element={<OurVenue/>}/>
        <Route path='/addEvent' element={<Addevent/>}/>
      </Routes>
    </Router>
  
      </>
  );
}

export default App;
