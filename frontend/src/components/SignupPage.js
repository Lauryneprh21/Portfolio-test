import React, { useState } from 'react';
import axios from 'axios'; 
import '../styles/SignupPage.css'; 

const SignupPage = () => {
  // Utilisation de `useState` pour gérer les états locaux des champs de formulaire et des messages de succès/erreur.
  const [email, setEmail] = useState(''); // Stocke l'email saisi par l'utilisateur.
  const [password, setPassword] = useState(''); // Stocke le mot de passe saisi par l'utilisateur.
  const [error, setError] = useState(''); // Stocke le message d'erreur en cas de problème lors de l'inscription.
  const [success, setSuccess] = useState(''); // Stocke le message de succès si l'inscription réussit.

  
  const handleSignup = async (e) => {
    e.preventDefault(); 

    
    const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_LOCAL;

    try {
      // Envoi de la requête POST à l'API pour inscrire un nouvel utilisateur avec l'email et le mot de passe.
      const response = await axios.post(`${apiUrl}/api/signup`, { email, password });
      
   
      setSuccess(response.data.message);
      setError('');
    } catch (err) {

      setError(err.response?.data?.message || 'Something went wrong');
      setSuccess(''); 
    }
  };

  return (
    <div className="signup-container">
      <h2>Inscription</h2>
      {/* Formulaire d'inscription */}
      <form onSubmit={handleSignup}>
        <div>
          <label>Email </label>
          {}
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Mot de passe </label>
          {}
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Envoyer</button>
      </form>

      {/* Affiche le message d'erreur en rouge si une erreur survient */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Affiche le message de succès en vert si l'inscription réussit */}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default SignupPage;