import React, { useEffect, useState } from "react";

import TableDropdown from "components/Dropdowns/TableDropdown.js";
import { useNavigate, useLocation } from "react-router-dom";


import EditCourseModal from "./EditCourseModal";
import { uploadElement, fetchEspacesCoursWithElements, fileService, getAllElementCour } from '../../Services/services';

import axios from "axios";

export default function CardCours({color}) {

    const location = useLocation();
  const userRole = location.state?.userRole || 'apprenant'; // Par défaut étudiant
  const navigate = useNavigate();

  



  const [cours, setCours] = useState([]);
  const [user, setUser] = useState(null);

  const [file, setFile] = useState(null);
  const [desElt, setDesElt] = useState('');

   const [typeElementId, setTypeElementId] = useState('');
  const [espaceCoursId, setEspaceCoursId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedCours, setSelectedCours] = useState(null); // New state

 
   const [modalOpen, setModalOpen] = useState(false);
  const [coursToEdit, setCoursToEdit] = useState(null);
   
   
 
  const [selectedElement, setSelectedElement] = useState(null);
  const [typeElements, setTypeElements] = useState([]);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [elements, setElements] = useState([]); // New state
 
  const [showViewModal, setShowViewModal] = useState(false);



  const [editCoursData, setEditCoursData] = useState({
    titre: '',
    description: ''
  });
  // 🔧 Fonction pour rediriger vers la page d’édition d’un cours
  const handleNavigateToEditCour = (id) => {
    navigate(`/cours/edit/${id}`);
  };
  

    //use effect 
  useEffect(() => {
    
    fetch('http://localhost:8087/api/type-element/getAllTypeElements')
      .then(res => res.json())
      .then(setTypeElements)
      .catch(console.error);

    fetchEspacesCoursWithElements()
      .then(setCours)
      .catch(console.error);
  }, []);


  useEffect(() => {
    console.log(userRole)
    return () => {
      if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);


    const handleOpenCours = (coursItem) => {
    setSelectedCours(coursItem);
    setElements(coursItem.elementsCours || []);
    setSelectedElement(null);
    setPreviewUrl(null);
    setShowViewModal(true);
  };


  // Ajouter Element Cours 
 const handleSubmitCours = async (e) => {
    e.preventDefault();
    if (!espaceCoursId) return alert('Veuillez sélectionner un cours');

    try {
      const elementResponse = await uploadElement(file, desElt, typeElementId);
      const res = await fetch('http://localhost:8087/api/elementCours/addElementCours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visibleEC: true,
          ordreEC: 0,
          dateAjoutEC: new Date().toISOString(),
          dateLimiteEC: null,
          id_espc: parseInt(espaceCoursId),
          id_elt: elementResponse.idElt,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la création du lien');


      const updated = await fetchEspacesCoursWithElements();
      setCours(updated);

      alert('Succès : Élément ajouté !');
      setShowAddModal(false);
      setDesElt('');
      setTypeElementId('');
      setEspaceCoursId('');
      setFile(null);
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

       // Action
  const handleFileAction = async (element) => {
    if (!element?.element?.cheminElt) return alert('Aucun fichier disponible');

    const filename = element.element.cheminElt.split('/').pop();
    const result = await fileService.handleFile(filename);

    if (result.success) {
      if (element.element.typeElement?.idTE === 5) { // Word
        const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(result.url)}`;
        window.open(officeUrl, '_blank');
      } else if (result.action === 'preview') {
        if (previewUrl) window.URL.revokeObjectURL(previewUrl);
        setPreviewUrl(result.url);
      }
    } else {
      alert('Erreur fichier : ' + result.error);
    }
    return result; // Return result for Afficher button
  };

const handleDownload = async (docId) => {
    setIsDownloading(true);
    try {
      const result = await fileService.downloadFile(docId);
      if (!result.success) throw new Error(result.message);
      alert(result.message);
    } catch (error) {
      alert(`Échec téléchargement : ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

const handleAfficher = (idEspace) => {
  console.log("Afficher cours", idEspace);
};






const handleEditer = (idEspace) => {
  const coursSelectionne = cours.find(c => c.idespac === idEspace);
  if (coursSelectionne) {
    setCoursToEdit(coursSelectionne);
    setModalOpen(true);
  }
};

const handleSupprimer = (idEspace) => {
  console.log("Supprimer cours", idEspace);
};

const handlePreviewFile = async (nomFichier) => {
  try {
    const result = await fileService.handleFile(nomFichier);
    if (result.success && result.action === 'preview') {
      window.open(result.url, '_blank');
    }
  } catch (error) {
    console.error("Erreur lors de l'ouverture du fichier :", error);
  }
};



const handleSave = (updatedCours) => {
  // Mise à jour locale
  setCours(prev =>
    prev.map(c => (c.idespac === updatedCours.idespac ? updatedCours : c))
  );
  setModalOpen(false);
  setCoursToEdit(null);

  // TODO: Ajouter ici appel API pour sauvegarder les changements côté backend
  // ex: axios.put(`/api/espaceCours/${updatedCours.idespac}`, updatedCours)
};

const handleCloseModal = () => {
  setModalOpen(false);
  setCoursToEdit(null);
};







 

    const handleDeleteCours = async (coursId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;
    
    try {
      const response = await fetch(`http://localhost:8087/api/espaceCours/deleteEspaceCours/${coursId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      setCours(cours.filter(c => c.idespac !== coursId));
      alert('Cours supprimé avec succès');
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };
  

  const handleNavigateToEditCours = (coursItem) => {
    navigate(`/modifier/${coursItem.idespac}`, { state: { coursItem } });
    console.log("id",coursItem)
  };
  

  const handleUpdateCours = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8087/api/espaceCours/updateEspaceCours/${editCoursData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre: editCoursData.titre,
          description: editCoursData.description
        })
      });
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      
      const updated = await fetchEspacesCoursWithElements();
      setCours(updated);
      setShowEditModal(false);
      alert('Cours mis à jour avec succès');
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const handleAddNewCours = () => {
    // Implement the logic to add a new course
    // This would typically open another modal with a form to create a new course
    alert('Fonctionnalité d\'ajout de nouveau cours à implémenter');
  };

  useEffect(() => {
    // Récupération de l'utilisateur depuis localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur de parsing JSON utilisateur :", e);
      }
    }
  }, []);

  const getNormalizedRole = (roles) => {
    if (!roles || !Array.isArray(roles)) return null;
    if (roles.includes("ROLE_ADMIN")) return "admin";
    if (roles.includes("ROLE_ENSEIGNANT")) return "enseignant";
    if (roles.includes("ROLE_APPRENANT")) return "apprenant";
    return null;
  };

  useEffect(() => {
    const fetchCours = async () => {
      if (!user) return;

      const role = getNormalizedRole(user.roles);
      if (role !== "enseignant" && role !== "apprenant"&& role !== "admin") return;

      try {
        const token = user.accessToken || localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8087/api/espaceCours/getAllEspaceCours",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCours(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des cours :", error);
      }
    };

    fetchCours();
  }, [user]);
  


  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        {/* Ajouter */}
        {getNormalizedRole(user?.roles) === "admin" && (
       <a
  href="#"
  className="flex items-center px-4 py-2 hover:bg-green-50 text-green-700 font-medium transition"
  onClick={(e) => {
    e.preventDefault();
    navigate('/CardSettings'); // 🔁 Vers le bon composant
  }}
>
  <i className="fa-solid fa-circle-plus w-5 mr-3 text-green-500"></i>
  Ajouter
</a>
)
}
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Mes Cours
              </h3>
            </div>
          </div>
        </div>
        <div className="block overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Icon
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Action
                </th>
              </tr>
            </thead>
    <tbody>
  {cours.map((coursItem) => (
    <tr key={coursItem.idespac}>


      <td className="px-6 py-4 text-xs">{coursItem.idespac}</td>
      <td className="px-6 py-4 text-xs">
        <i className="fa-solid fa-book text-blue-500"></i>
      </td>
      <td className="px-6 py-4 text-xs">{coursItem.titre}</td>
      <td className="px-6 py-4 text-xs">{coursItem.description}</td>
      <td className="px-6 py-4 text-xs">
        {/* SUPPRIMER LE TD INTERNE ET UTILISER UNE DIV */}
        <div className="flex gap-2 items-center">

          <TableDropdown
             coursItem={coursItem}

  
  handleOpenCours={handleOpenCours}
  handleNavigateToEditCour={handleNavigateToEditCour}
  handleDeleteCours={handleDeleteCours}
 
  handleDownload={handleDownload}
  handleFileAction={handleFileAction}


     />

          <EditCourseModal
  isOpen={modalOpen}
  onClose={handleCloseModal}
  course={coursToEdit}
  onSave={handleSave}
/>
          
        </div>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
      {/* View Modal */}
      {showViewModal && (
        <div className="modal-overlay">
          <div className="modal-view-content">
            <div className="modal-header">
              <h2>Documents pour {selectedCours?.titre}</h2>
              <button onClick={() => setShowViewModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="document-list">
                {elements.length > 0 ? elements.map((element) => (
                  <div
                    key={element.idEC}
                    className={`document-item ${selectedElement?.idEC === element.idEC ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedElement(element);
                      handleFileAction(element);
                    }}
                  >
                    <img src="/path/to/document-icon.png" alt="Document" />
                    <div>
                      <p>{element.element.desElt}</p>
                      <p>Type: {element.element.typeElement?.nomTE}</p>
                      <p>Ajout: {new Date(element.dateAjoutEC).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : <p>Aucun document.</p>}
              </div>

              <div className="document-preview">
                {selectedElement ? (
                  <>
                    <div className="preview-header">
                      <h3>{selectedElement.element.desElt}</h3>
                      <div className="preview-actions">
                        <button onClick={() => handleDownload(selectedElement.element.id_elt)} disabled={isDownloading}>
                          {isDownloading ? 'Téléchargement...' : '↓ Télécharger'}
                        </button>
                        
                      </div>
                    </div>
                    <div className="preview-content">
                      {previewUrl && selectedElement.element.typeElement?.idTE === 2 && (
                        <embed src={previewUrl} type="application/pdf" width="100%" height="500px" />
                      )}
                      {previewUrl && selectedElement.element.typeElement?.idTE === 1 && (
                        <img src={previewUrl} alt="Aperçu" className="preview-image" />
                      )}
                      {previewUrl && selectedElement.element.typeElement?.idTE === 5 && (
                        <iframe src={previewUrl} width="100%" height="500px" title="Word Preview" />
                      )}
                    </div>
                  </>
                ) : <p>Sélectionnez un document.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
 

CardCours.defaultProps = {
  color: "light",
};
