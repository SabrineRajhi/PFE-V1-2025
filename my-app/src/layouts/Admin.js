import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import CardSettings from "components/Cards/CardSettings.js"
import Dashboard from "views/admin/Dashboard.js";
import GererCours from "views/admin/GererCours";
import Tables from "views/admin/Tables.js";
import MesCours from "views/admin/MesCours.js";
import ListCours from "views/admin/ListCours.js";
import Utilisateurs from "views/admin/Utilisateurs.js";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="AjouterCours" element={<GererCours/>} />
            <Route path="tables" element={<Tables />} />

            <Route path="listusers" element={<Utilisateurs />} />
            <Route path="mescours" element={<MesCours />} />
             <Route path="ListCours/idespac" element={<ListCours />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Routes>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
