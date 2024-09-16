import React, { useState, useContext } from 'react';
import '../styles/Bloc3.css';
import AuthContext from '../AuthContext';

const Bloc3 = () => {
  const { isAdmin } = useContext(AuthContext); // On vérifie si l'utilisateur est admin en utilisant le contexte d'authentification.

  const [paragraph, setParagraph] = useState(`Passionné(e) de design, je crée des interfaces intuitives et esthétiques pour améliorer l'expérience utilisateur. 
Mon travail allie créativité et fonctionnalité pour donner vie à des idées uniques.

Chaque projet est une opportunité de repousser les limites du design et de l'innovation. 
J'accorde une attention particulière aux détails pour garantir que chaque interaction soit fluide et agréable.
Mon objectif est de créer des solutions sur mesure qui non seulement répondent aux besoins des utilisateurs, 
mais qui les enchantent également par leur beauté et leur simplicité.`);

  // Cette fonction est appelée à chaque fois que l'utilisateur modifie le contenu du paragraphe.
  // Elle met à jour l'état du paragraphe avec le nouveau texte saisi.
  const handleParagraphChange = (e) => {
    setParagraph(e.target.textContent);
  };

  // Déclenchée lorsque l'utilisateur quitte le champ éditable après modification.
  // C'est ici qu'on pourrait sauvegarder les modifications, par exemple en envoyant les données à une API.
  const handleBlur = () => {
    console.log("Modifications sauvegardées");
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
          // Le contenu devient éditable uniquement si l'utilisateur est admin. Cela permet de contrôler qui peut modifier le texte.
          contentEditable={isAdmin()}
          suppressContentEditableWarning={true} // On désactive les avertissements de React concernant le contenu éditable.
          onInput={handleParagraphChange} // Déclenché lorsque l'utilisateur modifie le texte, ce qui met à jour l'état.
          onBlur={handleBlur} // Déclenché lorsque l'utilisateur clique en dehors du texte après l'avoir modifié, déclenchant une "sauvegarde" des modifications.
          style={{
            
            border: isAdmin() ? '1px dashed gray' : 'none',
            padding: isAdmin() ? '5px' : '0',
            whiteSpace: 'pre-wrap' // Cela permet de conserver les retours à la ligne et les espaces dans le texte modifiable.
          }}
        >
          {paragraph} { }
        </p>
      </div>
    </section>
  );
}

export default Bloc3;