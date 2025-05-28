import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardCours from "components/Cards/CardCours.js";

export default function ListeCours() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors du parsing JSON :", error);
      }
    } else {
      navigate("/login"); // Redirection si pas connecté
    }
  }, [navigate]);

  const getNormalizedRole = (roles) => {
    if (!roles || !Array.isArray(roles)) return null;
    if (roles.includes("ROLE_ADMIN")) return "admin";
    if (roles.includes("ROLE_ENSEIGNANT")) return "enseignant";
    if (roles.includes("ROLE_APPRENANT")) return "apprenant";
    return null;
  };

  if (!user) return <div>Chargement...</div>;

  const userRole = getNormalizedRole(user.roles);

  return (
    <>
      <div className="flex flex-wrap mt-4 px-4">
        <div className="w-full mb-12">
          {/* Affiche le titre en fonction du rôle */}
          <h2 className="text-xl font-bold mb-4">
            Espace {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </h2>

          {/* Affiche les cours uniquement si connecté */}
          <CardCours />
        </div>
      </div>
    </>
  );
}
