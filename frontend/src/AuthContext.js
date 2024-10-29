import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

 
const AuthContext = createContext();

// Configuration de l'URL de l'API en fonction de l'environnement (local en développement, production sinon).
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api' 
  : 'https://portfolio-test-1-r0vs.onrender.com/api';  

// Le composant `AuthProvider` fournit les fonctionnalités d'authentification à toute l'application.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  

  // Vérifie si un utilisateur est déjà connecté en consultant le token dans le localStorage lors du montage du composant.
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');  
      if (token) {
        try {
          
          const response = await axios.get(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },  
          });
          setUser(response.data); 
        } catch (error) {
          console.error('Error fetching user data', error); 
        }
      }
    };

    checkLoggedIn();  
  }, []);  

  // Fonction de connexion qui envoie les informations de connexion à l'API.
  const login = async (email, password) => {
    try {
      // Envoie une requête POST à l'API pour se connecter.
      const response = await axios.post(`${API_URL}/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Enregistre le token dans le localStorage et met à jour l'état de l'utilisateur.
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      console.error('Login error', error); 
      throw error;  
    }
  };

   
  const signup = async (email, password) => {
    try {
      // Envoie une requête POST à l'API pour s'inscrire.
      const response = await axios.post(`${API_URL}/signup`, { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Enregistre le token dans le localStorage et met à jour l'état de l'utilisateur.
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      console.error('Signup error', error);  
      throw error;  
    }
  };

  // Fonction de déconnexion qui supprime le token et réinitialise l'état de l'utilisateur.
  const logout = () => {
    localStorage.removeItem('token'); 
    setUser(null); 
  };

  // Fonction qui vérifie si l'utilisateur est administrateur.
  const isAdmin = () => {
    return user && user.role === 'admin';  
  };

  // Fournit les données et les fonctions du contexte d'authentification à toute l'application.
  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin }}>
      {children} {}
    </AuthContext.Provider>
  );
};

export default AuthContext;