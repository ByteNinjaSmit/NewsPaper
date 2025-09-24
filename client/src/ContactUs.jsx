import React from "react";
import "./ContactUs.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Message sent successfully!");
    };

    return (
        <div className="contact-page">
            <h1 className="contact-title">Contact Us</h1>
            <p className="contact-subtitle">
                Have questions, suggestions, or feedback? We'd love to hear from you.
                Get in touch with our team.
            </p>

            <div className="contact-container">
                {/* Left Box - Send Message */}
                <div className="contact-box">
                    <h2>Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <input type="text" placeholder="Full Name" required />
                        <input type="email" placeholder="Email Address" required />
                        <textarea placeholder="Message" rows="5" required></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>

                {/* Right Box - Get in Touch */}
                <div className="contact-box">
                    <h2>Get in Touch</h2>
                    <div className="contact-info">
                        <FaEnvelope className="icon" />
                        <div>
                            <h4>Email Address</h4>
                            <p>pharmacare0823@gmail.com</p>
                        </div>
                    </div>
                    <div className="contact-info">
                        <FaPhone className="icon" />
                        <div>
                            <h4>Phone Numbers</h4>
                            <p>+91 98229 54912</p>
                            <p>+91 97658 00266</p>
                            <p>+91 94220 21419</p>
                        </div>
                    </div>
                    <div className="contact-info">
                        <FaMapMarkerAlt className="icon" />
                        <div>
                            <h4>Address</h4>
                            <p>A/P Baragaon-Pimpri,Tal.Sinnar,Dist.Nashik-422103
                                Published at Flat No.8 ,Atharv Apartment,Vijay Nagar,Sinnar,Dist.Nashik,Pin Code-422103,Maharashtra</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
