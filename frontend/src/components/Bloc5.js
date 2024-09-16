import React, { useState, useEffect, useContext } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import AuthContext from '../AuthContext';
import '../styles/Bloc5.css';

const Bloc5 = () => {
  const { isAdmin } = useContext(AuthContext); // On récupère le contexte pour savoir si l'utilisateur est admin.

  // State pour gérer les œuvres, les catégories, les tags et l'œuvre en cours d'édition.
  const [oeuvres, setOeuvres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // Filtre par catégorie sélectionnée.
  const [selectedTag, setSelectedTag] = useState(''); // Filtre par tag sélectionné.
  const [editingOeuvre, setEditingOeuvre] = useState(null); // Œuvre en cours d'édition.

  // L'URL de l'API change en fonction de l'environnement (local ou production).
  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL_LOCAL;

  // Utilisation de useEffect pour récupérer les données des œuvres, catégories et tags depuis l'API lorsque le composant est monté.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const oeuvresResult = await axios.get(`${apiUrl}/api/oeuvres`);
        const categoriesResult = await axios.get(`${apiUrl}/api/categories`);
        const tagsResult = await axios.get(`${apiUrl}/api/tags`);
        setOeuvres(oeuvresResult.data);
        setCategories(categoriesResult.data);
        setTags(tagsResult.data);
      } catch (error) {
        console.error('Failed to fetch data:', error); 
      }
    };
    fetchData();
  }, [apiUrl]); // Ce useEffect est réexécuté seulement si l'apiUrl change.

  // Fonction pour ajouter une nouvelle œuvre.
  const addOeuvre = async () => {
    const title = document.getElementById('oeuvreTitle').value;
    const category = document.getElementById('oeuvreCategory').value;
    const tags = document.getElementById('oeuvreTags').value.split(',');  
    const imageUrl = document.getElementById('oeuvreImageUrl').value;
    const newOeuvre = { title, category, tags, imageUrl };

    try {
      const result = await axios.post(`${apiUrl}/api/oeuvres`, newOeuvre, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Authentification via un token.
      });
      setOeuvres([...oeuvres, result.data]); // Ajoute la nouvelle œuvre à la liste des œuvres.
    } catch (error) {
      console.error('Failed to add oeuvre:', error); 
    }
  };

  // Fonction pour supprimer une œuvre par son ID.
  const deleteOeuvre = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/oeuvres/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOeuvres(oeuvres.filter(oeuvre => oeuvre._id !== id));  
    } catch (error) {
      console.error('Failed to delete oeuvre:', error);
    }
  };

  // Fonction pour modifier une œuvre.
  const editOeuvre = async (id) => {
    const title = document.getElementById('editOeuvreTitle').value;
    const category = document.getElementById('editOeuvreCategory').value;
    const tags = document.getElementById('editOeuvreTags').value.split(',');
    const imageUrl = document.getElementById('editOeuvreImageUrl').value;
    const updatedOeuvre = { title, category, tags, imageUrl };

    try {
      const result = await axios.put(`${apiUrl}/api/oeuvres/${id}`, updatedOeuvre, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOeuvres(oeuvres.map(oeuvre => (oeuvre._id === id ? result.data : oeuvre))); // Met à jour l'œuvre modifiée.
      setEditingOeuvre(null); // Arrête l'édition une fois la modification effectuée.
    } catch (error) {
      console.error('Failed to update oeuvre:', error);
    }
  };

  // Fonction pour ajouter une nouvelle catégorie.
  const addCategory = async () => {
    const category = document.getElementById('newCategory').value;
    try {
      const result = await axios.post(`${apiUrl}/api/categories`, { name: category }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategories([...categories, result.data]);  
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  // Fonction pour supprimer une catégorie par son ID.
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategories(categories.filter(category => category._id !== id)); // Met à jour la liste des catégories après suppression.
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  // Fonction pour ajouter un nouveau tag.
  const addTag = async () => {
    const tag = document.getElementById('newTag').value;
    try {
      const result = await axios.post(`${apiUrl}/api/tags`, { name: tag }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTags([...tags, result.data]);  
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  // Fonction pour supprimer un tag par son ID.
  const deleteTag = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/tags/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTags(tags.filter(tag => tag._id !== id));  
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  // Filtre les œuvres par catégorie et/ou tag sélectionné.
  const filteredOeuvres = oeuvres.filter(oeuvre => 
    (selectedCategory ? oeuvre.category === selectedCategory : true) &&
    (selectedTag ? oeuvre.tags.includes(selectedTag) : true)
  );

  
  const statusFormatter = (current, total) => `Diapo ${current} sur ${total}`;

  return (
    <div className="projet-container">
      <h2>Vous voulez voir d'autres de mes créations ?</h2>
      <p>C'est très simple, il vous suffit d'interagir ici avec la boîte de recherche</p>
      
      <div className="filters">
        { }
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Select category"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(category => (
            <option key={category._id} value={category.name}>{category.name}</option>
          ))}
        </select>
        
        { }
        <select 
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          aria-label="Select tag"
        >
          <option value="">Tous les tags</option>
          {tags.map(tag => (
            <option key={tag._id} value={tag.name}>{tag.name}</option>
          ))}
        </select>
      </div>
      
      <div className="flex-container">
        {/* Partie réservée aux admins pour ajouter/supprimer/modifier des œuvres, catégories et tags */}
        {isAdmin() && (
          <div className="commands-cell">
            <div>
              <input type="text" placeholder="Titre de l'œuvre" id="oeuvreTitle" aria-label="Titre de l'œuvre" aria-required="true" />
              <input type="text" placeholder="Catégorie" id="oeuvreCategory" aria-label="Catégorie" aria-required="true" />
              <input type="text" placeholder="Tags (séparés par des virgules)" id="oeuvreTags" aria-label="Tags" aria-required="true" />
              <input type="text" placeholder="URL de l'image" id="oeuvreImageUrl" aria-label="URL de l'image" aria-required="true" />
              <button onClick={addOeuvre}>Ajouter Œuvre</button>
            </div>

            <div>
              <input type="text" placeholder="Nouvelle catégorie" id="newCategory" aria-label="Nouvelle catégorie" aria-required="true" />
              <button onClick={addCategory}>Ajouter Catégorie</button>
            </div>

            <div>
              <input type="text" placeholder="Nouveau tag" id="newTag" aria-label="Nouveau tag" aria-required="true" />
              <button onClick={addTag}>Ajouter Tag</button>
            </div>

            {/* Affichage des catégories existantes avec la possibilité de les supprimer */}
            <div>
              <h3>Catégories Existantes</h3>
              <ul>
                {categories.map(category => (
                  <li key={category._id}>
                    {category.name}
                    <button onClick={() => deleteCategory(category._id)}>Supprimer</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Affichage des tags existants avec la possibilité de les supprimer */}
            <div>
              <h3>Tags Existants</h3>
              <ul>
                {tags.map(tag => (
                  <li key={tag._id}>
                    {tag.name}
                    <button onClick={() => deleteTag(tag._id)}>Supprimer</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formulaire d'édition d'une œuvre */}
            {editingOeuvre && (
              <div>
                <h3>Modifier Œuvre</h3>
                <input type="text" placeholder="Titre de l'œuvre" defaultValue={editingOeuvre.title} id="editOeuvreTitle" aria-label="Titre de l'œuvre" aria-required="true" />
                <input type="text" placeholder="Catégorie" defaultValue={editingOeuvre.category} id="editOeuvreCategory" aria-label="Catégorie" aria-required="true" />
                <input type="text" placeholder="Tags (séparés par des virgules)" defaultValue={editingOeuvre.tags.join(',')} id="editOeuvreTags" aria-label="Tags" aria-required="true" />
                <input type="text" placeholder="URL de l'image" defaultValue={editingOeuvre.imageUrl} id="editOeuvreImageUrl" aria-label="URL de l'image" aria-required="true" />
                <button onClick={() => editOeuvre(editingOeuvre._id)}>Enregistrer</button>
                <button onClick={() => setEditingOeuvre(null)}>Annuler</button>
              </div>
            )}
          </div>
        )}

        {/* Affichage des œuvres sous forme de carousel */}
        <div className={`oeuvres-cell ${isAdmin() ? '' : 'user-view'}`}>
          <Carousel showThumbs={false} showIndicators={true} showArrows={false}  statusFormatter={statusFormatter}>
            {filteredOeuvres.map(oeuvre => (
              <div key={oeuvre._id}>
                <img src={oeuvre.imageUrl} alt={oeuvre.title} loading="lazy" width="298" height="298" />
                <p className="legend">{oeuvre.title} - {oeuvre.category} - {oeuvre.tags.join(', ')}</p>
                {isAdmin() && (
                  <>
                    <button onClick={() => deleteOeuvre(oeuvre._id)}>Supprimer</button>
                    <button onClick={() => setEditingOeuvre(oeuvre)}>Modifier</button>
                  </>
                )}
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Bloc5;