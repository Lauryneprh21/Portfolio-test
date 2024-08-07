import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FaBars, FaTimes } from 'react-icons/fa';
import AuthContext from '../AuthContext';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="header">
      <nav className={`nav ${isNavOpen ? 'nav-open' : ''}`}>
        <ul className="nav-links">
          <li>
            <HashLink 
              smooth to="/#home" 
              className={({ isActive }) => (isActive ? 'active' : 'inactive')}
              onClick={handleNavToggle}
            >Home</HashLink>
          </li>
          <li>
            <HashLink 
              smooth to="/#about" 
              className={({ isActive }) => (isActive ? 'active' : 'inactive')}
              onClick={handleNavToggle}
            >About</HashLink>
          </li>
          <li>
            <HashLink 
              smooth to="/#project" 
              className={({ isActive }) => (isActive ? 'active' : 'inactive')}
              onClick={handleNavToggle}
            >Project</HashLink>
          </li>
          <li>
            <HashLink 
              smooth to="/#contact" 
              className={({ isActive }) => (isActive ? 'active' : 'inactive')}
              onClick={handleNavToggle}
            >Contact</HashLink>
          </li>
          {user ? (
            <>
              <li>
                <span>{user.email}</span>
              </li>
              <li>
                <button className="logout-button" onClick={logout}>Déconnexion</button>
              </li>
            </>
          ) : (
            <li>
              <NavLink 
                to="/login" 
                className={({ isActive }) => (isActive ? 'active' : 'inactive')}
                onClick={handleNavToggle}
              >Connexion</NavLink>
            </li>
          )}
        </ul>
        <div className="close-btn" onClick={handleNavToggle}>
        <FaTimes className="icon" role="presentation" />
      </div>


      </nav>
      <div className="burger" role="button" tabindex="0" aria-label="Toggle navigation menu" onClick={handleNavToggle}>
  <img src="https://cdn-icons-png.flaticon.com/512/2613/2613045.png" alt="Menu Icon" className="menu-icon" />
</div>
    </header>
  );
}

export default Header;
