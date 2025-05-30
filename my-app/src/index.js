import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Dashboard from "views/admin/Dashboard.js";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

// views without layouts
import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";

import { AuthProvider } from './views/auth/AuthContext.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* add routes with layouts */}
           <Route path="/admin/dashboard" element={<Dashboard />} />

           <Route path="/auth/*" element={<Auth />} />
          <Route path="/admin/*" element={<Admin />} />
       

        {/* add routes without layouts */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Index />} />

        {/* catch-all route */}
         <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </AuthProvider>
  </BrowserRouter>,
 
);
