import React, { useState } from "react";
import { ajouterElementCours } from "../../Services/services";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AjouterElementCours = ({ initialData = {}, onSuccess }) => {
  const [visibleEC, setVisibleEC] = useState(initialData.visibleEC || false);
  const [ordreEC, setOrdreEC] = useState(initialData.ordreEC || 1);
  const [dateLimite, setDateLimite] = useState(initialData.dateLimite || "");
  const [idespac, setIdespac] = useState(initialData.idespac || "");
  const [idTE, setIdTE] = useState(initialData.idTE || "");
  const [cheminElt, setCheminElt] = useState(null);
  const [description, setDescription] = useState(initialData.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const idEC = initialData.idEC;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!cheminElt && !idEC) {
      toast.error("Veuillez sélectionner un fichier.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("visibleEC", visibleEC);
    formData.append("ordreEC", ordreEC);
    formData.append("dateLimite", dateLimite);
    formData.append("idespac", idespac);
    formData.append("idTE", idTE);
    formData.append("des_elt", description);
    if (cheminElt) formData.append("chemin_elt", cheminElt);

    try {
      if (idEC) {
        // MODIFICATION
        const response = await axios.put(
          "/updateElementCours/{idEC}",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Élément modifié avec succès !");
      } else {
        // AJOUT
        const response = await ajouterElementCours(formData);
        toast.success("Élément ajouté avec succès !");
      }

      onSuccess && onSuccess();
    } catch (error) {
      toast.error("Erreur : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-14 px-6 sm:px-8 pb-20">
      {" "}
      <div className="max-w-4xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête avec gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {idEC
                ? "Modifier un Élément de Cours"
                : "Ajouter un Nouvel Élément de Cours"}
            </h1>
            <p className="text-blue-100 mt-2">
              Remplissez le formulaire ci-dessous pour{" "}
              {idEC ? "modifier" : "ajouter"} un élément à votre cours
            </p>
          </div>

          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colonne gauche */}
              <div>
                {/* Description */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Entrez une description..."
                  />
                </div>

                {/* Ordre */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={ordreEC}
                    onChange={(e) => setOrdreEC(parseInt(e.target.value))}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    min="1"
                  />
                </div>

                {/* Date Limite */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Date Limite
                  </label>
                  <input
                    type="date"
                    value={dateLimite}
                    onChange={(e) => setDateLimite(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Colonne droite */}
              <div>
                {/* Visible */}
                <div className="mb-6 flex items-center">
                  <input
                    type="checkbox"
                    id="visible"
                    checked={visibleEC}
                    onChange={(e) => setVisibleEC(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="visible"
                    className="ml-2 text-gray-700 font-medium"
                  >
                    Visible pour les étudiants
                  </label>
                </div>

                {/* ID Espace Cours */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    ID Espace Cours
                  </label>
                  <input
                    type="number"
                    value={idespac}
                    onChange={(e) => setIdespac(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Type d'Élément */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Type d'Élément
                  </label>
                  <select
                    value={idTE}
                    onChange={(e) => setIdTE(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">-- Choisir un type --</option>
                    <option value="1">Image</option>
                    <option value="2">PDF</option>
                    <option value="5">Document</option>
                    <option value="3">Vidéo</option>
                  </select>
                </div>

                {/* Fichier */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Fichier
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="text-sm text-gray-500 mt-2">
                          {cheminElt
                            ? cheminElt.name
                            : "Cliquez pour téléverser un fichier"}
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, JPG, MP4 (Max. 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => setCheminElt(e.target.files[0])}
                        required={!idEC}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Traitement...
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 inline-block mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      ></path>
                    </svg>
                    {idEC ? "Modifier l'Élément" : "Ajouter l'Élément"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Conseils pour ajouter des éléments de cours
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <li className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-600">
                Utilisez des descriptions claires pour aider les étudiants à
                identifier le contenu
              </p>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-600">
                Vérifiez les dates limites pour éviter les erreurs de planning
              </p>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-600">
                Organisez les éléments dans l'ordre logique de consultation
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AjouterElementCours;
