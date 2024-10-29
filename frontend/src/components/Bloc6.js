import React, { useState } from 'react';
import '../styles/Bloc6.css';

const Bloc6 = () => {
  // Définition des états pour gérer le formulaire de contact.
  const [name, setName] = useState(''); // État pour stocker le nom de l'utilisateur.
  const [email, setEmail] = useState(''); // État pour stocker l'adresse e-mail de l'utilisateur.
  const [message, setMessage] = useState(''); // État pour stocker le message de l'utilisateur.
  const [successMessage, setSuccessMessage] = useState(''); // État pour afficher le message de succès ou d'erreur après l'envoi du formulaire.
 
 
  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL_LOCAL;

  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page.

     
    const token = localStorage.getItem('token');

     
    if (token) {
      console.log("Token envoyé:", token); 
    }

    try {
      // Envoi d'une requête POST à l'API pour envoyer un e-mail.
      const response = await fetch(`${apiUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })  
        },
        body: JSON.stringify({
          from_name: name,
          from_email: email,
          message: message
        })
      });

   
      if (response.ok) {
        setSuccessMessage('Votre message a été envoyé avec succès !');
        setName('');  
        setEmail('');  
        setMessage('');  
      } else {
        
        setSuccessMessage('Une erreur s\'est produite. Veuillez réessayer.');
      }
    } catch (error) {
      
      console.log('FAILED...', error);
      setSuccessMessage('Une erreur s\'est produite. Veuillez réessayer.');
    }
  };

  return (
    <div className="bloc6-container">
      {}
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.674628564969!2d-74.005973!3d40.712775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzgnMzcnNTAuMSJOIDc0wrAwMicxOC45Ilc!5e0!3m2!1sen!2sus!4v1614834445505!5m2!1sen!2sus"
          style={{ 
            border: 0, 
            width: '100%', 
            height: '300px', 
            maxWidth: '100%', 
            maxHeight: '100%' 
          }}
 title="Google Maps Location"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {}
      <div className="contact-info">
        <h2>Contactez moi !</h2>
        <p>350, 5e avenue, New York, NY 10118</p>
        <p>1 212-736-3100</p>
        <p>Pixael@gmail.com</p>
      </div>

      {}
      <div className="contact-form">
        <form onSubmit={handleSubmit}>
          {}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}  
            required
            aria-label="Name"
            aria-required="true"
          />
          {}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
            aria-label="Email"
            aria-required="true"
          />
          {}
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)} 
            required
            aria-label="Message"
            aria-required="true"
          ></textarea>
          {}
          <button type="submit">Soumettre</button>
        </form>

        { }
        {successMessage && <p>{successMessage}</p>}
      </div>
    </div>
  );
};

export default Bloc6;