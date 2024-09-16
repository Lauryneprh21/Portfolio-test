import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import '../styles/Bloc2.css';

const Bloc2 = () => {
  return (
    <section className="container2">
      <div className="bloc2-text-section">
        <h2>​En pixel art, chaque pixel révèle la passion qui anime votre conception.</h2>
        <p>​Si mon univers vous captive, je vous invite à continuer l'exploration.</p>

        <Link smooth to="/#about">
        <button>Continuer</button>
        </Link>

      </div>
      
    </section>
  );
}

export default Bloc2;
