import React, { useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link'; 
import { FaBars } from 'react-icons/fa';   
import '../styles/Navbar.css';  

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/#home"></Link>
      </div>

      {}
      <div className="burger" onClick={toggleNavbar}>
        <FaBars /> {}
      </div>

      {}
      <ul className={`nav-links ${isOpen ? 'nav-open' : ''}`}>
        <li><Link smooth to="/#home" onClick={toggleNavbar}>Accueil</Link></li>
        <li><Link smooth to="/#about" onClick={toggleNavbar}>À propos</Link></li>
        <li><Link smooth to="/#projects" onClick={toggleNavbar}>Projets</Link></li>
        <li><Link smooth to="/#contact" onClick={toggleNavbar}>Contact</Link></li>
        <li><Link to="/login" onClick={toggleNavbar}>Connexion</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
