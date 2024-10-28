import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // useNavigate pour rediriger l'utilisateur, Link pour la navigation interne.
import AuthContext from '../AuthContext'; 
import axios from 'axios'; 
import '../styles/Login.css';

const LoginPage = () => {
  // États pour gérer les valeurs des champs email, mot de passe et pour afficher un message d'erreur ou d'information.
  const [email, setEmail] = useState(''); // Stocke l'email saisi par l'utilisateur.
  const [password, setPassword] = useState(''); // Stocke le mot de passe saisi par l'utilisateur.
  const [message, setMessage] = useState(''); // Stocke un message d'erreur ou de succès pour l'afficher à l'utilisateur.

  // Récupère la fonction login et l'utilisateur actuel depuis le contexte d'authentification.
  const { login, user } = useContext(AuthContext);
  
  
  const navigate = useNavigate();

  // Fonction appelée lors de la soumission du formulaire de connexion.
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    
    const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_LOCAL;


      
    try {
      // Appel à l'API pour vérifier les informations de connexion.
      await axios.post(`${apiUrl}/api/login`, { email, password });
      
      // Si l'API renvoie une réponse correcte, on utilise la fonction login du contexte pour authentifier l'utilisateur.
      await login(email, password);
      
      
      navigate('/');
    } catch (err) {
      setMessage('Invalid email or password');
    }
  };

  
  useEffect(() => {
    if (user) {
      navigate('/'); // Si l'utilisateur est déjà connecté, redirection vers la page d'accueil.
    }
  }, [user, navigate]); 
  return (
    <div className="login-container">
      <h2>Connexion</h2>
      
      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input 
            type="password" 
            id="password"
            placeholder="Mot de passe" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Connexion</button>
      </form>

      {}
      {message && <p>{message}</p>}

      {}
      <div className="login-links">
        <Link to="/signup">S'inscrire</Link>
        <Link to="/forgot-password">Mot de passe oublié</Link>
      </div>
    </div>
  );
};

export default LoginPage;