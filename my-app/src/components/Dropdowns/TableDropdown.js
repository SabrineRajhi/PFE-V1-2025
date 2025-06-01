import React, { useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const TableDropdown = ({ coursItem }) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = useRef(null);
  const popoverDropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let popperInstance;
    if (
      dropdownPopoverShow &&
      btnDropdownRef.current &&
      popoverDropdownRef.current
    ) {
      popperInstance = createPopper(
        btnDropdownRef.current,
        popoverDropdownRef.current,
        {
          placement: "left-start",
        }
      );
      popperInstance.update();
    }
    return () => {
      if (popperInstance) popperInstance.destroy();
    };
  }, [dropdownPopoverShow]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverDropdownRef.current &&
        !popoverDropdownRef.current.contains(event.target) &&
        btnDropdownRef.current &&
        !btnDropdownRef.current.contains(event.target)
      ) {
        setDropdownPopoverShow(false);
      }
    };
    if (dropdownPopoverShow) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownPopoverShow]);

  const fetchElementByIdElt = async (id_elt) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token manquant");

      const response = await axios.get(
        `http://localhost:8087/api/element/v1/getByEspaceCoursId/${id_elt}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      const message =
        err.response?.status === 400
          ? "Élément introuvable ou erreur serveur."
          : err.message;
      throw new Error(message);
    }
  };

  const handleAfficher = async () => {
    setIsLoading(true);
    try {
      const element = await fetchElementByIdElt(coursItem.idespac);
      if (element?.cheminElt) {
        const fileUrl = `http://localhost:8087/${element.cheminElt}`;
        window.open(fileUrl, "_blank");
      } else {
        Swal.fire(
          "Fichier introuvable",
          "Le fichier est manquant pour cet élément.",
          "warning"
        );
      }
    } catch (err) {
      Swal.fire("Erreur", err.message, "error");
    } finally {
      setIsLoading(false);
      setDropdownPopoverShow(false);
    }
  };

  const handleNavigateToEditCour = (cours) => {
    navigate(`/ModifierCoursPage`, { state: { cours } });
  };

  const handleDeleteCours = async (id) => {
    const isConfirmed = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas annuler cette action !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    });

    if (!isConfirmed.isConfirmed) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token manquant");

      await axios.delete(
        `http://localhost:8087/api/espaceCours/deleteEspaceCours/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        title: "Supprimé !",
        text: "Le cours a été supprimé avec succès.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      window.location.reload();
    } catch (err) {
      Swal.fire({
        title: "Erreur !",
        text: "La suppression a échoué : " + err.message,
        icon: "error",
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
      setDropdownPopoverShow(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="text-blueGray-500 py-1 px-3"
        ref={btnDropdownRef}
        onClick={() => setDropdownPopoverShow((prev) => !prev)}
      >
        <i className="fas fa-ellipsis-v"></i>
      </button>

      <div
        ref={popoverDropdownRef}
        className={`${
          dropdownPopoverShow ? "block" : "hidden"
        } bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48`}
      >
        <button
          type="button"
          className="flex items-center px-4 py-2 hover:bg-blue-50 text-blue-700 font-medium transition w-full"
          onClick={handleAfficher}
          disabled={isLoading}
        >
          <i className="fa-regular fa-eye w-5 mr-3 text-blue-500"></i>
          {isLoading ? "Chargement..." : "Afficher"}
        </button>

        <button
          type="button"
          className="flex items-center px-4 py-2 hover:bg-yellow-50 text-yellow-700 font-medium transition w-full"
          onClick={() => handleNavigateToEditCour(coursItem)}
        >
          <i className="fa-solid fa-pen-to-square w-5 mr-3 text-yellow-500"></i>
          Éditer
        </button>

        <button
          type="button"
          className="flex items-center px-4 py-2 hover:bg-red-50 text-red-700 font-medium transition w-full"
          onClick={() => handleDeleteCours(coursItem.idespac)}
          disabled={isLoading}
        >
          <i className="fa-solid fa-trash-can w-5 mr-3 text-red-500"></i>
          Supprimer
        </button>
      </div>
    </>
  );
};

export default TableDropdown;
