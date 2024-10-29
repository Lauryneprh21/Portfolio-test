import React, { useState, useEffect, useContext } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AuthContext from '../AuthContext';
import '../styles/Bloc5.css';

const Bloc5 = () => {
  const { isAdmin } = useContext(AuthContext); // On récupère le contexte pour savoir si l'utilisateur est admin.

 
  const [oeuvres, setOeuvres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // Filtre par catégorie sélectionnée.
  const [selectedTag, setSelectedTag] = useState(''); // Filtre par tag sélectionné.
  const [editingOeuvre, setEditingOeuvre] = useState(null); // Œuvre en cours d'édition.

 
  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL_LOCAL;

  
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
  }, [apiUrl]);  

  // Fonction pour ajouter une nouvelle œuvre.
  const addOeuvre = async () => {
    const title = document.getElementById('oeuvreTitle').value;
    const category = document.getElementById('oeuvreCategory').value;
    const tags = document.getElementById('oeuvreTags').value.split(',').map(tag => tag.trim());  
    const imageUrl = document.getElementById('oeuvreImageUrl').value;
  
    // Vérification : tous les champs doivent être remplis
    if (!title || !category || !tags.length || !imageUrl) {
      alert('Tous les champs (Titre, Catégorie, Tags, URL de l\'image) doivent être remplis.');
      return;
    }
  
    const newOeuvre = { title, category, tags, imageUrl };
  
    try {
      const result = await axios.post(`${apiUrl}/api/oeuvres`, newOeuvre, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOeuvres([...oeuvres, result.data]);
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
      setEditingOeuvre(null);  
    } catch (error) {
      console.error('Failed to update oeuvre:', error);
    }
  };

  

  const toggleVisibility = async (id) => {
    try {
      const result = await axios.put(`${apiUrl}/api/oeuvres/${id}/visibility`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOeuvres(oeuvres.map(oeuvre => (oeuvre._id === id ? result.data : oeuvre)));  
    } catch (error) {
      console.error('Failed to update visibility:', error);
    }
  };

  // Ajouter une nouvelle catégorie.
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

  // Supprimer une catégorie par son ID.
  const deleteCategory = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        await axios.delete(`${apiUrl}/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCategories(categories.filter(category => category._id !== id));
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  // Ajouter un nouveau tag.
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

  
  const filteredOeuvres = oeuvres.filter(oeuvre => 
    (isAdmin() || oeuvre.isVisible) &&  
    (selectedCategory ? oeuvre.category === selectedCategory : true) &&
    (selectedTag ? oeuvre.tags.includes(selectedTag) : true)
  );

  
  const statusFormatter = (current, total) => `Diapo ${current} sur ${total}`;

  return (
    <div className="projet-container">
      <h2>Vous voulez voir d'autres de mes créations ?</h2>
      <p>C'est très simple, il vous suffit d'interagir ici avec la boîte de recherche</p>
      
      <div className="filters">
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
        {isAdmin() && (
          <div className="commands-cell">
            <div>
              <input type="text" placeholder="Titre de l'œuvre" id="oeuvreTitle" aria-label="Titre de l'œuvre" aria-required="true" />
              <input type="text" placeholder="Catégorie" id="oeuvreCategory" aria-label="Catégorie" aria-required="true" />
              <input type="text" placeholder="Tags (séparés par des virgules)" id="oeuvreTags" aria-label="Tags" aria-required="true" />
              <input type="text" placeholder="URL de l'image" id="oeuvreImageUrl" aria-label="URL de l'image" aria-required="true" />
              
              <div className="add-button-container">
  <button onClick={addOeuvre}>Ajouter</button>
</div>
            </div>
  
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <FontAwesomeIcon 
                icon={faPlus} 
                onClick={addCategory} 
                style={{ cursor: 'pointer', fontSize: '22px', marginRight: '8px' }}
              />
              <input id="newCategory" type="text" placeholder="Nouvelle catégorie" />
            </div>
  
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <FontAwesomeIcon 
                icon={faPlus} 
                onClick={addTag} 
                style={{ cursor: 'pointer', fontSize: '22px', marginRight: '8px' }}
              />
              <input id="newTag" type="text" placeholder="Nouveau tag" />
            </div>
  
            { }
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '25px', fontWeight: 'lighter' }}>

              <h3>Catégories Existantes</h3>
            </div>
            <div>
              {categories.map(category => (
                <div key={category._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginTop: '20px'}}>
                  <span style={{ marginRight: '8px' }}>–</span>
                  <span style={{ fontSize: '18px' }}>{category.name}</span>
                  <FontAwesomeIcon 
                    icon={faTrash} 
                    onClick={() => deleteCategory(category._id)} 
                    style={{ cursor: 'pointer', marginLeft: '15px', fontSize: '22px' }}
                  />
                </div>
              ))}
            </div>
  
            { }
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '25px' }}>
              <h3>Tags Existants</h3>
            </div> 
  
            <div>
              {tags.map(tag => (
                <div key={tag._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ marginRight: '8px' }}>–</span>
                  <span style={{ fontSize: '18px' }}>{tag.name}</span>
                  <FontAwesomeIcon 
                    icon={faTrash} 
                    onClick={() => deleteTag(tag._id)} 
                    style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '22px' }}
                  />
                </div>
              ))}
            </div>
  
            { }
            {editingOeuvre && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '25px', marginBottom: '25px'}}>
                  <h3>Modifier Œuvre</h3>
                </div>
                <input type="text" placeholder="Titre de l'œuvre" defaultValue={editingOeuvre.title} id="editOeuvreTitle" aria-label="Titre de l'œuvre" aria-required="true" />
                <input type="text" placeholder="Catégorie" defaultValue={editingOeuvre.category} id="editOeuvreCategory" aria-label="Catégorie" aria-required="true" />
                <input type="text" placeholder="Tags (séparés par des virgules)" defaultValue={editingOeuvre.tags.join(',')} id="editOeuvreTags" aria-label="Tags" aria-required="true" />
                <input type="text" placeholder="URL de l'image" defaultValue={editingOeuvre.imageUrl} id="editOeuvreImageUrl" aria-label="URL de l'image" aria-required="true" />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '25px' }}>
                  <button onClick={() => editOeuvre(editingOeuvre._id)}>Enregistrer</button>
                  <button onClick={() => setEditingOeuvre(null)}>Annuler</button>
                </div>
              </div>
            )}
          </div>
        )}
  
        { }
        <div className={`oeuvres-cell ${isAdmin() ? '' : 'user-view'}`}>
          <Carousel showThumbs={false} showIndicators={true} showArrows={false} statusFormatter={statusFormatter}>
            {filteredOeuvres.map(oeuvre => (
              <div key={oeuvre._id}>
                <img src={oeuvre.imageUrl} alt={oeuvre.title} loading="lazy" width="298" height="298" />
                <p className="legend">{oeuvre.title} - {oeuvre.category} - {oeuvre.tags.join(', ')}</p>
                {isAdmin() && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', marginTop: '15px' }}>
                    <FontAwesomeIcon 
                      icon={faTrash} 
                      onClick={() => deleteOeuvre(oeuvre._id)} 
                      style={{ cursor: 'pointer', fontSize: '22px' }}
                    />
                    <FontAwesomeIcon 
                      icon={faPen} 
                      onClick={() => setEditingOeuvre(oeuvre)} 
                      style={{ cursor: 'pointer', fontSize: '22px' }}
                    />
                    <FontAwesomeIcon 
                      icon={oeuvre.isVisible ? faEye : faEyeSlash} 
                      onClick={() => toggleVisibility(oeuvre._id)} 
                      style={{ cursor: 'pointer', fontSize: '22px' }}
                    />
                  </div>
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
