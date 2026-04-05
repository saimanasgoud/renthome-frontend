import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Components
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";

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

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate a 1.5 second loading time

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />

     <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/property/:propertyId" element={<PropertyDetails />} />
        <Route path="/addproperty" element={<AddProperty />} />
        <Route path="/login" element={<Login />} />
        <Route path="/generateqr/" element={<QRCodeGenerator />} />
        <Route path="/generate-qr/:propertyId" element={<QRCodeGenerator />} />
        <Route path="/location" element={<LocationAccess />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user/nearme" element={<NearMe />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/analytics" element={<OwnerAnalytics />} />
        <Route path="/myproperties" element={<OwnerProperty />} />
        <Route path="/user/smartchoice" element={<SmartChoice />} />
        <Route path="/edit-property/:type/:propertyId" element={<EditProperty />} />
        <Route path="/edit-property/:propertyId" element={<EditProperty />} />
        <Route path="/owner/qr-insights" element={<QrInsights />} />
        <Route path="/magic-login" element={<MagicLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* OWNER ROUTES */}
        <Route path="/owner/dashboard" element={<Home />} />
        <Route path="/owner/addproperty" element={<AddProperty />} />
        <Route path="/owner/myproperties" element={<OwnerProperty />} />

        {/* USER ROUTES */}
        <Route path="/user/dashboard" element={<Home />} />
        <Route path="/user/property/:propertyId" element={<PropertyDetails />} />
      </Routes>
    </>

  );
}

export default App;
