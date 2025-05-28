// src/components/Modals/EditCourseModal.js
import React from "react";

const EditCourseModal = ({ isOpen, onClose, course, onSave }) => {
  if (!isOpen || !course) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCours = {
      ...course,
      titre: e.target.titre.value,
      description: e.target.description.value,
    };
    onSave(updatedCours);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-1/2">
        <h2 className="text-xl font-bold mb-4">Éditer le cours</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Titre</label>
            <input
              name="titre"
              defaultValue={course.titre}
              className="border w-full px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label>Description</label>
            <textarea
              name="description"
              defaultValue={course.description}
              className="border w-full px-2 py-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Annuler
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
