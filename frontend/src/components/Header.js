import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom'; // Utilisé pour la navigation entre les pages.
import { HashLink } from 'react-router-hash-link'; // Permet de naviguer vers des sections spécifiques de la même page avec un hash.
import { FaTimes } from 'react-icons/fa'; // Icônes pour le menu burger et le bouton de fermeture.
import AuthContext from '../AuthContext'; // Contexte d'authentification pour gérer l'utilisateur connecté.

const Header = () => {
  // État pour contrôler l'ouverture ou la fermeture du menu de navigation.
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  // On récupère l'utilisateur connecté (s'il y en a un) et la fonction logout depuis le contexte d'authentification.
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
              onClick={handleNavToggle} // Ferme le menu après avoir cliqué sur un lien
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

          {/* Affichage conditionnel basé sur si l'utilisateur est connecté ou non */}
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
            // Si l'utilisateur n'est pas connecté, affiche un lien vers la page de connexion
            <li>
              <NavLink 
                to="/login" 
                className={({ isActive }) => (isActive ? 'active' : 'inactive')}
                onClick={handleNavToggle}
              >Connexion</NavLink>
            </li>
          )}
        </ul>
        
        {/* Bouton de fermeture du menu, affiché dans le menu mobile */}
        <div className="close-btn" onClick={handleNavToggle}>
          <FaTimes className="icon" role="presentation" />
        </div>
      </nav>

      {/* Icône de menu burger pour ouvrir le menu */}
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