import React, { useState } from "react";
import { createPopper } from "@popperjs/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { uploadElement, fetchEspacesCoursWithElements, fileService, getAllElementCour } from '../../Services/services';

const TableDropdown = ({
  coursItem,
  handleFileAction,
  handleDownload,
  handleOpenCours,
  handleNavigateToEditCour,
  handleDeleteCours,
}) => {
  const navigate = useNavigate();

  // Dropdown state
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();

  // State to store fetched elements (to avoid redundant API calls)
  const [fetchedElements, setFetchedElements] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "left-start",
    });
    setDropdownPopoverShow(true);
  };

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  // Fetch elements associated with the course (shared between Afficher and Télécharger)
  const fetchElements = async () => {
    if (fetchedElements) return fetchedElements; // Use cached result if available

    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accesstoken");
      if (!token) throw new Error("Aucun token d'authentification trouvé");

      const response = await axios.get(
        `http://localhost:8087/api/espace-cours/${coursItem.idespac}/element`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const elements = response.data;
      if (!elements || elements.length === 0) {
        throw new Error("Aucun élément associé à ce cours.");
      }

      setFetchedElements(elements);
      return elements;
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Session expirée. Veuillez vous reconnecter."
          : err.response?.status === 404
          ? "Aucun élément associé à ce cours."
          : err.message || "Erreur lors de la récupération des éléments.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the correct docId (id_elt) for the element associated with the course
  const getDocId = async () => {
    if (coursItem.elementsCours && coursItem.elementsCours.length > 0) {
      return coursItem.elementsCours[0].element.id_elt; // Use the first element's id_elt
    }

    const elements = await fetchElements();
    return elements[0].element.id_elt;
  };

  return (
    <>
      <a
        className="text-blueGray-500 py-1 px-3"
        href="#"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </a>

      <div
        ref={popoverDropdownRef}
        className={`${
          dropdownPopoverShow ? "block" : "hidden"
        } bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48`}
      >
        {/* Bouton Afficher sécurisé */}
        <button
          className="flex items-center px-4 py-2 hover:bg-blue-50 text-blue-700 font-medium transition w-full"
          onClick={async () => {
            try {
              setError(null);
              const elements = await fetchElements();
              const url = await handleFileAction(elements[0]); // Pass the entire element object
              if (url && url.success && url.action === 'preview') {
                window.open(url.url, "_blank");
              }
            } catch (err) {
              alert(error || err.message);
            }
          }}
          disabled={isLoading}
        >
          <i className="fa-regular fa-eye w-5 mr-3 text-blue-500"></i>
          {isLoading ? "Chargement..." : "Afficher"}
        </button>

        {/* Actions */}
        <div className="px-4 py-2 text-sm text-gray-700 space-y-1">
          <button
            className="block w-full text-left hover:underline text-blue-600"
            onClick={() => handleOpenCours(coursItem)}
          >
            Ouvrir
          </button>
          <button
            className="block w-full text-left hover:underline text-purple-600"
            onClick={async () => {
              try {
                setError(null);
                const docId = await getDocId();
                handleDownload(docId);
              } catch (err) {
                alert(error || err.message);
              }
            }}
            disabled={isLoading}
          >
            Télécharger
          </button>
        </div>

        {/* Éditer */}
        <a
          href="#"
          className="flex items-center px-4 py-2 hover:bg-yellow-50 text-yellow-700 font-medium transition"
          onClick={(e) => {
            e.preventDefault();
            handleNavigateToEditCour(coursItem.idespac);
          }}
        >
          <i className="fa-solid fa-pen-to-square w-5 mr-3 text-yellow-500"></i>
          Éditer
        </a>

        {/* Supprimer */}
        <a
          href="#"
          className="flex items-center px-4 py-2 hover:bg-red-50 text-red-700 font-medium transition"
          onClick={(e) => {
            e.preventDefault();
            handleDeleteCours(coursItem.idespac);
          }}
        >
          <i className="fa-solid fa-trash-can w-5 mr-3 text-red-500"></i>
          Supprimer
        </a>
      </div>
    </>
  );
};

export default TableDropdown;