import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../styles/ResetPasswordPage.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

const ResetPasswordPage = () => {
  // États pour gérer les valeurs des champs de formulaire et les messages d'erreur/succès.
  const [password, setPassword] = useState(''); // Stocke le nouveau mot de passe.
  const [confirmPassword, setConfirmPassword] = useState(''); // Stocke la confirmation du mot de passe.
  const [message, setMessage] = useState(''); // Stocke les messages à afficher (erreurs ou succès).
  const [showPassword, setShowPassword] = useState(false); // Contrôle la visibilité du mot de passe.
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Contrôle la visibilité du champ de confirmation du mot de passe.


  const { token } = useParams(); 
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // Vérification de la correspondance des mots de passe.
    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

   
    const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_LOCAL;

    try {
      // Envoie la requête POST à l'API pour réinitialiser le mot de passe.
      const response = await axios.post(`${apiUrl}/api/reset-password/${token}`, { password });

      // Si la réponse de l'API est correcte, affiche un message de succès et redirige vers la page de connexion.
      if (response.status === 200) {
        setMessage('Mot de passe réinitialisé avec succès');
        navigate('/login'); 
      } else {
        setMessage(response.data.message); 
      }
    } catch (error) {
      
      console.error('Reset password error:', error);
      setMessage('Erreur lors de la réinitialisation du mot de passe');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Réinitialiser le mot de passe</h2>
      
      {/* Formulaire de réinitialisation */}
      <form onSubmit={handleSubmit}>
        <div className="password-input">
          <label>Nouveau mot de passe</label>
          <input
            type={showPassword ? 'text' : 'password'} // Bascule entre texte et mot de passe pour la visibilité.
            placeholder="Nouveau mot de passe"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          {}
          <FontAwesomeIcon 
            icon={showPassword ? faEyeSlash : faEye} 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)} 
          />
        </div>

        <div className="password-input">
          <label>Confirmer le mot de passe</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'} 
            placeholder="Confirmer mot de passe"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required
          />
          {}
          <FontAwesomeIcon 
            icon={showConfirmPassword ? faEyeSlash : faEye} 
            className="toggle-password" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
          />
        </div>

        <button type="submit">Réinitialiser le mot de passe</button>
      </form>

      {}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;