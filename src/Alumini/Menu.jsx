import React from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';

const Menu = ({ isOpen, onClose }) => {
  return (
    <div className={`menu-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>×</button>
      <ul>
        <li><Link to="/aldashboard">Home</Link></li>
        <li><Link to="/studentdirectory">Student Directory</Link></li>
        <li><Link to="/networkinghub">Networking Hub</Link></li>
        <li><Link to="/portaljob">Portal Job</Link></li>
        <li><Link to="/reunion">Reunion</Link></li>
        <li><Link to="/requests">Requests</Link></li>
        <li><Link to="/feedback">Feedback</Link></li>
      </ul>
    </div>
  );
};

export default Menu;
