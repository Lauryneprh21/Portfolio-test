import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import '../styles/Bloc6.css';

const Bloc6 = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send('service_g2m4a6c', 'template_pj2c2tx', {
      from_name: name,
      from_email: email,
      message: message,
    }, 'ywTaXzdYF9Qiho4TM')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        setSuccessMessage('Votre message a été envoyé avec succès !');
        setName('');
        setEmail('');
        setMessage('');
      }, (err) => {
        console.log('FAILED...', err);
        setSuccessMessage('Une erreur s\'est produite. Veuillez réessayer.');
      });
  };

  return (
    <div className="bloc6-container">
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
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      <div className="contact-info">
        <h2>Contactez moi !</h2>
        <p>350, 5e avenue, New York, NY 10118</p>
        <p>1 212-736-3100</p>
        <p>Pixael@gmail.com</p>
      </div>
      <div className="contact-form">
        <form onSubmit={handleSubmit}>
        <input
  type="text"
  placeholder="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
  aria-label="Name"
  aria-required="true"
/>
<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  aria-label="Email"
  aria-required="true"
/>
<textarea
  placeholder="Message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  required
  aria-label="Message"
  aria-required="true"
></textarea>
          <button type="submit">Soumettre</button>
        </form>
        {successMessage && <p>{successMessage}</p>}
      </div>
    </div>
  );
};

export default Bloc6;
