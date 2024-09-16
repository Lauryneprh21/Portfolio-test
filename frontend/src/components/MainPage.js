import React from 'react';
import Bloc1 from './Bloc1';  
import Bloc2 from './Bloc2';  
import Bloc3 from './Bloc3';  
import Bloc4 from './Bloc4';  
import Bloc5 from './Bloc5';  
import Bloc6 from './Bloc6';  

// Composant principal de la page d'accueil.
const MainPage = () => {
  return (
    <div>
      {}
      <section id="home">
        <Bloc1 />
      </section>

      {}
      <section id="bloc2">
        <Bloc2 />
      </section>

      {}
      <section id="about">
        <Bloc3 />
      </section>

      {}
      <section id="project">
        <Bloc4 />
      </section>

      {}
      <section id="bloc5">
        <Bloc5 />
      </section>

      {}
      <section id="contact">
        <Bloc6 />
      </section>
    </div>
  );
};

export default MainPage;