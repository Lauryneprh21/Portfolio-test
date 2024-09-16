// On importe les différentes bibliothèques et composants nécessaires.
// React est utilisé pour créer notre interface utilisateur.
// react-router-dom nous permet de gérer la navigation entre différentes pages de l'application.
// AuthProvider gère tout ce qui concerne l'authentification des utilisateurs.

 
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import './App.css';

// Ici, on définit le composant principal de notre application : `App`.
// Ce composant englobe toute l'application, y compris la gestion de l'authentification et la navigation entre les pages.
const App = () => {
  return (
    // AuthProvider entoure l'application pour s'assurer que toutes les pages peuvent accéder aux infos d'authentification (comme savoir si l'utilisateur est connecté ou non).
    <AuthProvider>
      {/* Le Router nous permet de changer de page sans recharger toute l'application. */}
      <Router>
        { }
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        { }
        <Header />

        {/* Le contenu principal de la page est contenu ici. Le `id="main-content"` permet de rendre fonctionnel le lien d'accessibilité ci-dessus. */}
        <main id="main-content">
          {/* Routes : C'est ici qu'on définit quelles pages vont s'afficher selon l'URL dans laquelle on se trouve. */}
          <Routes>
            { }
            <Route path="/" element={<MainPage />} />

            { }
            <Route path="/login" element={<LoginPage />} />

            { }
            <Route path="/signup" element={<SignupPage />} />

            { }
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            { }
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Routes>
        </main>

        { }
        <Footer />
      </Router>
    </AuthProvider>
  );
};

 
export default App;