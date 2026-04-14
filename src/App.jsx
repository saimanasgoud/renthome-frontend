import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Components
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import NotFound from "./components/NotFound";

// Pages
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import Login from "./pages/Login";
import LocationAccess from "./pages/LocationAccess";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import Signup from "./pages/Signup";
import NearMe from "./pages/NearMe";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import OwnerAnalytics from "./pages/OwnerAnalytics";
import OwnerProperty from "./pages/OwnerProperty";
import SmartChoice from "./pages/SmartChoice";
import EditProperty from "./pages/EditProperty";
import QrInsights from "./pages/QrInsights";
import MagicLogin from "./components/MagicLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRout";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/dashboard" element={<Home />} />
        <Route path="/property/:propertyId" element={<PropertyDetails />} />
        <Route path="/location" element={<LocationAccess />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/magic-login" element={<MagicLogin />} />

        {/* USER */}
        <Route path="/user/nearme" element={<NearMe />} />
        <Route path="/user/smartchoice" element={<SmartChoice />} />
        <Route path="/user/property/:propertyId" element={<PropertyDetails />} />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRole="USER">
              <Home />
            </ProtectedRoute>
          }
        />

        {/* OWNER */}
        <Route
          path="/owner/addproperty"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <AddProperty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/myproperties"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerProperty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/analytics"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/generateqr"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <QRCodeGenerator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/generate-qr/:propertyId"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <QRCodeGenerator />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/qr-insights" element={<QrInsights />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            localStorage.getItem("token") ? (
              localStorage.getItem("role") === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/user/dashboard" replace />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* ROOT REDIRECT (VERY IMPORTANT - KEEP HERE) */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              localStorage.getItem("role") === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/user/dashboard" replace />
              )
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* 404 (MUST BE LAST) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;