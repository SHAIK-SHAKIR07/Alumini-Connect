// src/Student/Smenubar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Smenubar.css';

const Smenubar = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>X</button>
      <ul>
        <li>Home</li>
        <Link to='/alumnidirectory'><li>Alumni Directory</li></Link>
        <Link to='/snetworkinghub'><li>Networking Hub</li></Link>
        <Link to='/sportaljob'><li>Portal Job</li></Link>
        <Link to='/sfeedback'><li>Feedback</li></Link>
        <Link to='/sreunion'><li>Reunion</li></Link>
      </ul>
    </div>
  );
};

export default Smenubar;
