import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../AuthContext';
import Navbar from './Navbar'; 

const Header = () => {
  // On récupère l'utilisateur connecté (s'il y en a un) et la fonction logout depuis le contexte d'authentification.
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      { }
      <Navbar />

      {}
      <nav>
        <ul className="nav-user-links">
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
              >Connexion</NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
