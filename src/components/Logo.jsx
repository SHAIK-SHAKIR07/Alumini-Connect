import React from 'react';
import defaultLogo from '../assets/react.svg';
import './Logo.css';

const Logo = ({ text = 'Alumini Connect', src }) => {
  const logoSrc = src || defaultLogo;
  return (
    <div className="logo-brand">
      <img src={logoSrc} alt="Logo" className="logo-icon" />
      <span className="logo-text">{text}</span>
    </div>
  );
};

export default Logo;
