import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fileService } from "../../Services/services";
import AjouterElementCours from "./AjouterElementCours";

const ModifierCoursPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cours = location.state?.cours;
  console.log(cours);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [elementSelectionne, setElementSelectionne] = useState(null);

  const handleNavigateToEditelement = (ec) => {
    navigate(`/modifierElt/${ec.idEC}`, { state: { ec } });
    console.log(" id :ec ", ec.idEC);
  };

  const handleSupprimer = (idec) => {
    console.log("Supprimer élément", idec);
    // Implémenter la logique de suppression
  };

  const handlemodifier = () => {
    console.log("Ajouter un nouvel élément");
    // Implémenter la logique d’ajout
  };

  if (!cours) {
    return <div>Erreur : Aucune donnée de cours reçue.</div>;
  }

  return (
    <div>
      <h2>Modifier espace Cours ID: {cours.idespac}</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ordre</th>
            <th>Description</th>
            <th>Visible</th>
            <th>Type</th>
            <th>Date limite</th>
            <th>Date ajout</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr key={cours.idEC}>
            <td>{cours.idEC}</td>
            <td>{cours.ordreEC ?? "N/A"}</td>
            <td>{cours.element?.desElt ?? "N/A"}</td>
            <td>{cours.visibleec ? "Oui" : "Non"}</td>
            <td>{cours.element?.typeElement?.nomTE ?? "N/A"}</td>
            <td>
              {cours.dateLimite
                ? new Date(cours.dateLimite).toLocaleDateString()
                : "N/A"}
            </td>
            <td>
              {cours.dateAjoutEC
                ? new Date(cours.dateAjoutEC).toLocaleDateString()
                : "N/A"}
            </td>
            <td>
              <button onClick={() => handleNavigateToEditelement(cours)}>
                Modifier
              </button>
              <button onClick={() => handleSupprimer(cours)}>Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => setAfficherFormulaire(!afficherFormulaire)}>
        {afficherFormulaire ? "Fermer le formulaire" : "Ajouter un élément"}
      </button>
      {afficherFormulaire && (
        <AjouterElementCours
          initialData={
            elementSelectionne
              ? {
                  idEC: elementSelectionne.idEC,
                  visibleEC: elementSelectionne.visibleec,
                  ordreEC: elementSelectionne.ordreEC,
                  dateLimite: elementSelectionne.dateLimite?.slice(0, 10),
                  idespac: elementSelectionne.espaceCours?.idespac,
                  idTE: elementSelectionne.element?.typeElement?.idTE,
                  description: elementSelectionne.element?.desElt,
                }
              : { idespac: cours.idespac }
          }
          onSuccess={() => {
            setAfficherFormulaire(false);
            setElementSelectionne(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default ModifierCoursPage;
