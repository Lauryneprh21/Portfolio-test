import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom'; // Utilisé pour la navigation entre les pages.
import { HashLink } from 'react-router-hash-link'; // Permet de naviguer vers des sections spécifiques de la même page avec un hash.
import { FaTimes } from 'react-icons/fa';  
import AuthContext from '../AuthContext';  

const Header = () => {
  // État pour contrôler l'ouverture ou la fermeture du menu de navigation.
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  
  const { user, logout } = useContext(AuthContext);

  // Fonction qui bascule l'état du menu entre ouvert et fermé.
  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="header">
      {}
      <nav className={`nav ${isNavOpen ? 'nav-open' : ''}`}>
        <ul className="nav-links">
          {}
          <li>
            <HashLink 
              smooth to="/#home" 
              className={({ isActive }) => (isActive ? 'active' : 'inactive')}
              onClick={handleNavToggle}  
            >Accueil</HashLink>
          </li>
          <li>
            <HashLink 
              smooth to="/#about" 
              className={({ isActive }) => (isActive ? 'active' : 'inactive')}
              onClick={handleNavToggle}
            >À propos</HashLink>
          </li>
          <li>
            <HashLink 
              smooth to="/#project" 
              className={({ isActive }) => (isActive ? 'active' : 'inactive')}
              onClick={handleNavToggle}
            >Projets</HashLink>
          </li>
          <li>
            <HashLink 
              smooth to="/#contact" 
              className={({ isActive }) => (isActive ? 'active' : 'inactive')}
              onClick={handleNavToggle}
            >Contact</HashLink>
          </li>

          { }
          {user ? (
            <>
              {}
              <li>
                <span>{user.email}</span>
              </li>
              {}
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
        
        { }
        <div className="close-btn" onClick={handleNavToggle}>
          <FaTimes className="icon" role="presentation" />
        </div>
      </nav>

      { }
      <div className="burger" role="button" tabIndex="0" aria-label="Toggle navigation menu" onClick={handleNavToggle}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/2613/2613045.png" 
          alt="Menu Icon" 
          className="menu-icon" 
        />
      </div>
    </header>
  );
}

export default Header;