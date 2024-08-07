import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResetPasswordPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }
  
    const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_LOCAL;
  
    console.log('API URL:', apiUrl);
    console.log('Token:', token);
    console.log('Password:', password);
  
    try {
      const response = await axios.post(`${apiUrl}/api/reset-password/${token}`, { password });
  
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
      <form onSubmit={handleSubmit}>
        <div className="password-input">
          <label>Nouveau mot de passe</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon 
            icon={showPassword ? faEyeSlash : faEye} 
            className={showPassword ? "toggle-password toggle-password-eye-slash" : "toggle-password toggle-password-eye"} 
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
          <FontAwesomeIcon 
            icon={showConfirmPassword ? faEyeSlash : faEye} 
            className={showConfirmPassword ? "toggle-password toggle-password-eye-slash" : "toggle-password toggle-password-eye"} 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
          />
        </div>
        <button type="submit">Réinitialiser le mot de passe</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
