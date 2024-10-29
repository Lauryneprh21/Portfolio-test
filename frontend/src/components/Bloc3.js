import React, { useState, useContext } from 'react';
import '../styles/Bloc3.css';
import AuthContext from '../AuthContext';
import axios from 'axios';

const Bloc3 = () => {
  const { isAdmin } = useContext(AuthContext);

  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL_LOCAL;

  const [paragraph, setParagraph] = useState(`Passionné(e) de design, je crée des interfaces intuitives et esthétiques pour améliorer l'expérience utilisateur. 
Mon travail allie créativité et fonctionnalité pour donner vie à des idées uniques.

Chaque projet est une opportunité de repousser les limites du design et de l'innovation. 
J'accorde une attention particulière aux détails pour garantir que chaque interaction soit fluide et agréable.
Mon objectif est de créer des solutions sur mesure qui non seulement répondent aux besoins des utilisateurs, 
mais qui les enchantent également par leur beauté et leur simplicité.`);

  const [message, setMessage] = useState("");  

  const handleParagraphChange = (e) => {
    setParagraph(e.target.textContent);
  };

  const handleBlur = async () => {
    try {
      const response = await axios.put(`${apiUrl}/api/update-paragraph`, { paragraph }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage("Paragraphe sauvegardé avec succès !"); // Affiche un message de succès
      console.log("Modifications sauvegardées:", response.data);
    } catch (error) {
      setMessage("Erreur lors de la sauvegarde du paragraphe.");
      console.error("Erreur lors de la sauvegarde des modifications:", error);
    } finally {
      setTimeout(() => setMessage(""), 3000);  
    }
  };

  return (
    <section className="container3">
      <div className="bloc3-text-section">
        <h2>Le design d'un jeu vidéo, c'est l'art de rendre l'impossible possible.</h2>
      </div>

      <div className="line-container">
        <hr className="custom-line" />
      </div>

      <div className="bloc3-text-section">
        <p
          contentEditable={isAdmin()}
          suppressContentEditableWarning={true}
          onInput={handleParagraphChange}
          onBlur={handleBlur}
          style={{
            border: isAdmin() ? '1px dashed gray' : 'none',
            padding: isAdmin() ? '5px' : '0',
            whiteSpace: 'pre-wrap'
          }}
        >
          {paragraph}
        </p>
        { }
        {message && <p style={{ color: message.includes("Erreur") ? 'red' : 'green' }}>{message}</p>}
      </div>
    </section>
  );
};

export default Bloc3;
