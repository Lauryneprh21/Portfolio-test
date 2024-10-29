import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  // Définition des états pour gérer l'email entré par l'utilisateur et le message à afficher après la soumission.
  const [email, setEmail] = useState(''); // État pour stocker l'email entré par l'utilisateur.
  const [message, setMessage] = useState(''); // État pour stocker le message à afficher après la soumission du formulaire.

 
  const handleSubmit = async (e) => {
    e.preventDefault();  

    
    const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_LOCAL;

    console.log('API URL:', apiUrl);  
    console.log('Email:', email);  

    try {
      // Envoie une requête POST à l'API pour demander la réinitialisation du mot de passe.
      const response = await axios.post(`${apiUrl}/api/forgot-password`, { email });

      
      if (response.status === 200) {
        setMessage('Un email de réinitialisation du mot de passe a été envoyé');
      } else {
         
        setMessage(response.data.message);
      }
    } catch (error) {
       
      console.error('Forgot password error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        setMessage(error.response.data.message); // Affiche le message d'erreur spécifique reçu de l'API.
      } else {
        setMessage('Erreur lors de l\'envoi de l\'email de réinitialisation');  
      }
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Mot de passe oublié</h2>
      {}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Votre email"
          value={email}  
          onChange={(e) => setEmail(e.target.value)}  
          required 
        />
        <button type="submit">Envoyer</button> {}
      </form>
      {}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPasswordPage;