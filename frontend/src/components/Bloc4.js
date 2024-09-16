import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/Bloc4.css';

// Flèche personnalisée pour la navigation suivante dans le carousel.
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ 
        ...style, 
    
        background: 'gray', 
        borderRadius: '50%', 
        width: '40px', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
      onClick={onClick} // Action déclenchée au clic pour faire défiler à droite
      aria-label="Next slide"
    >
      <i className="fas fa-chevron-right" style={{ color: 'white', fontSize: '20px', lineHeight: '1.5em' }} role="presentation"></i>
    </button>
  );
};

// Flèche personnalisée pour la navigation précédente dans le carousel.
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ 
        ...style, 
       
        background: 'gray', 
        borderRadius: '50%', 
        width: '40px', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
      onClick={onClick} // Action déclenchée au clic pour faire défiler à gauche
      aria-label="Previous slide"
    >
      <i className="fas fa-chevron-left" style={{ color: 'white', fontSize: '20px', lineHeight: '1.5em' }} role="presentation"></i>
    </button>
  );
};

const Bloc4 = () => {
  // Paramètres du carousel. 
  // On configure ici la vitesse de défilement, le nombre de slides à afficher et comment elles se comportent sur différents écrans.
  const settings = {
    dots: false, // Pas de points pour la navigation entre slides.
    infinite: true, // Le défilement est infini, revient au début après la dernière slide.
    speed: 500, // Vitesse de transition entre slides en millisecondes.
    slidesToShow: 3, // Nombre de slides visibles en même temps sur les grands écrans.
    slidesToScroll: 1, // Nombre de slides à faire défiler à chaque clic.
    nextArrow: <NextArrow />, // Utilisation de la flèche personnalisée pour aller à droite.
    prevArrow: <PrevArrow />, // Utilisation de la flèche personnalisée pour aller à gauche.
    responsive: [
      {
        breakpoint: 1024, // Pour les écrans inférieurs à 1024px.
        settings: {
          slidesToShow: 2, // On montre 2 slides seulement.
          slidesToScroll: 1, 
          infinite: true,
          dots: false // Toujours pas de points pour la navigation.
        }
      },
      {
        breakpoint: 600, // Pour les écrans inférieurs à 600px.
        settings: {
          slidesToShow: 1, // On montre seulement 1 slide à la fois.
          slidesToScroll: 1,
          initialSlide: 1 // On commence à afficher la première slide.
        }
      }
    ]
  };

  return (
    // Le composant Slider contient toutes les slides (projets).
    // aria-roledescription est utilisé ici pour des raisons d'accessibilité, décrivant le composant comme un carousel.
    <div className="carousel-container" aria-roledescription="carousel">
      <h2>Mes Projets</h2>
      <Slider {...settings}>
        {/* Chaque "carousel-item" représente un projet affiché sous forme de slide */}
        <div className="carousel-item" role="group" aria-roledescription="slide">
          <img src="https://res.cloudinary.com/des6g45rz/image/upload/v1723220197/bsb4mjo_-_Imgur_1_gy0o15.webp" alt="Project 1" loading="lazy" width="298" height="298" />
          <h3>Jardin Enchanté : Vie au Bord de la Forêt</h3>
          <p>Une scène en pixel art 3D détaillant un jardin forestier avec des personnages interactifs, des objets artisanaux et une cabane en bois, utilisant des textures riches et un éclairage doux pour une immersion totale.</p>
        </div>
        
        { }
        <div className="carousel-item" role="group" aria-roledescription="slide">
          <img src="https://res.cloudinary.com/des6g45rz/image/upload/v1723220318/6XkJSVq_-_Imgur_1_niibjm.webp" alt="Project 2" loading="lazy" width="298" height="298" />
          <h3>Village Enchanté : Havre de la Forêt</h3>
          <p>Scène en pixel art 3D d'un village médiéval avec des détails interactifs, des éclairages chaleureux et une palette nostalgique pour une immersion totale.</p>
        </div>
        
        <div className="carousel-item" role="group" aria-roledescription="slide">
          <img src="https://res.cloudinary.com/des6g45rz/image/upload/v1723220449/T1DF4CT_-_Imgur_2_ydviys.webp" alt="Project 3" loading="lazy" width="298" height="298" />
          <h3>Atelier Magique : Rencontre au Coin du Feu</h3>
          <p>Représentation en pixel art 3D d'un atelier chaleureux, mettant en avant des textures détaillées, un éclairage intérieur subtil, et une disposition soignée des meubles et objets, créant une atmosphère immersive et conviviale.</p>
        </div>
        
        <div className="carousel-item" role="group" aria-roledescription="slide">
          <img src="https://res.cloudinary.com/des6g45rz/image/upload/v1723220545/mY4fLFM_-_Imgur_1_cwxkuo.webp" alt="Project 4" loading="lazy" width="298" height="298" />
          <h3>​Réunion au Cœur de la Forêt</h3>
          <p>​Présentant une maison forestière avec des textures détaillées et un éclairage dynamique autour d'un feu central, cette scène en pixel art 3D est entourée de personnages variés et d'objets magiques finement pixelisés, utilisant des dégradés subtils et une palette de couleurs riche pour créer une profondeur et une ambiance immersive.</p>
        </div>
      </Slider>
    </div>
  );
};

export default Bloc4;