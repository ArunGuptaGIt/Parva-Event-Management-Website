import React, { useState } from "react";
import './signup.css'
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const  [password,setPassword] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [middle_name, setMiddle_name] = useState("");
    const [phone_numbers, setPhonenumber] = useState("");


    const middleNameToSend = middle_name.trim() === "" ? null : middle_name;

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
    

        try{
            const responce = await axios.post("http://127.0.0.1:8000/parva_website/admins/signup/",
                {
                    email,
                    password,
                    first_name,
                    last_name,
                    middle_name : middleNameToSend,
                    phone_numbers
                }
            );
        

            if(responce.status === 201)
            {
                alert("SignUp Successful");
                navigate('/login'); // Use navigate function for redirection
            }
        }

        catch(error)
        {
            if (error.response) {
                // Server responded with a status other than 2xx
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                // No response received from server
                alert("No response from server. Please try again later.");
            } else {
                alert(`Error: ${error.message}`);
            }
        }
    }
    return(
        <>
            <div className="main-box">
                
                <div className="rightsider">
                <img src="Banner.png" alt="Banner"/>
                    <h2 className="signin">Sign Up</h2>
                    <form action="" className="formMenu" onSubmit={handleSubmit}>
                    <div className="inputwrap">
                            <span>First Name</span>
                            <input type="name"  required className="inputfield"  value = {first_name} onChange={(e) => setFirst_name(e.target.value)} />
                            <i className="material-symbols-outlined">id_card</i>
                        </div>
                        <div className="inputwrap">
                            <span>Middle Name</span>
                            <input type="name" className="inputfield" placeholder="Optional" value = {middle_name} onChange={(e) => setMiddle_name(e.target.value)} />
                            <i className="material-symbols-outlined">id_card</i>
                        </div>
                        <div className="inputwrap">
                            <span>Last Name</span>
                            <input type="name" required className="inputfield" value = {last_name} onChange={(e) => setLast_name(e.target.value)} />
                            <i className="material-symbols-outlined">id_card</i>
                        </div>
                        
                        <div className="inputwrap">
                            <span>Phone Number</span>
                            <input type="tel" required className="inputfield" value = {phone_numbers} onChange={(e) => setPhonenumber(e.target.value)}/>
                            <i className="material-symbols-outlined">call</i>
                        </div>

                        <div className="inputwrap">
                            <span>Email Address</span>
                            <input type="email" placeholder="Something@gmail.com" required className="inputfield" value = {email} onChange={(e) => setEmail(e.target.value)} />
                            <i className="material-symbols-outlined">mail</i>
                        </div>
                        <div className="inputwrap">
                            <span>Password</span>
                            <input type="password" required className="inputfield" placeholder="Must be 8 character long" value = {password} onChange={(e) => setPassword(e.target.value)} />
                            <i className="material-symbols-outlined">lock</i>
                        </div>
                        
                       <center> <button className="loginbutton">Register</button></center>
                    </form>
                    <p className="signin">Go back to link <Link to="/login"> Login</Link> </p>
                </div>
            </div>
        </>
    )
}