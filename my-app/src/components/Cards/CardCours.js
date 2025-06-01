import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import { fetchEspacesCoursWithElements } from "../../Services/services";

// Constantes API
const API_BASE_URL = "http://localhost:8087/api";
const TYPE_ELEMENTS_URL = `${API_BASE_URL}/type-element/getAllTypeElements`;
const ESPACE_COURS_URL = `${API_BASE_URL}/espaceCours/getAllEspaceCours`;

export default function CardCours({ color = "light" }) {
  const navigate = useNavigate();

  // États
  const [cours, setCours] = useState([]);
  const [user, setUser] = useState(null);

  // Récupération des données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [typesRes, coursRes] = await Promise.all([
          axios.get(TYPE_ELEMENTS_URL),
          fetchEspacesCoursWithElements(),
        ]);

        setCours(coursRes);
      } catch (error) {
        console.error("Erreur lors du chargement initial:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Récupération de l'utilisateur
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur de parsing JSON utilisateur :", e);
      }
    }
  }, []);

  // Récupération des cours avec authentification si nécessaire
  useEffect(() => {
    const fetchCoursWithAuth = async () => {
      if (!user) return;

      const role = getNormalizedRole(user.roles);
      if (!["enseignant", "apprenant", "admin"].includes(role)) return;

      try {
        const token = user.accessToken || localStorage.getItem("accessToken");
        const response = await axios.get(ESPACE_COURS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCours(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des cours :", error);
      }
    };

    fetchCoursWithAuth();
  }, [user]);

  // Fonction pour normaliser les rôles
  const getNormalizedRole = useCallback((roles) => {
    if (!roles || !Array.isArray(roles)) return null;
    if (roles.includes("ROLE_ADMIN")) return "admin";
    if (roles.includes("ROLE_ENSEIGNANT")) return "enseignant";
    if (roles.includes("ROLE_APPRENANT")) return "apprenant";
    return null;
  }, []);

  // Rôle normalisé de l'utilisateur
  const normalizedRole = useMemo(
    () => user && getNormalizedRole(user.roles),
    [user, getNormalizedRole]
  );

  return (
    <>
      <div
        className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${
          color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"
        }`}
      >
        {normalizedRole === "admin" && (
          <button
            className="flex items-center px-4 py-2 hover:bg-green-50 text-green-700 font-medium transition"
            onClick={() => navigate("/AjouterElementCours")}
          >
            <i className="fa-solid fa-circle-plus w-5 mr-3 text-green-500"></i>
            Ajouter
          </button>
        )}

        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={`font-semibold text-lg ${
                  color === "light" ? "text-blueGray-700" : "text-white"
                }`}
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
                {["Id", "Icon", "Titre", "Description", "Action"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase"
                    >
                      {header}
                    </th>
                  )
                )}
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
                    <div className="flex gap-2 items-center">
                      <TableDropdown coursItem={coursItem} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
