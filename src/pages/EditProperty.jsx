import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/config";
import Loader from "../components/Loader";
import AddProperty from "./AddProperty";

export default function EditProperty() {

  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PROPERTY ================= */

  useEffect(() => {

    if (!propertyId) return;

    fetch(`${API_BASE_URL}/api/forms/${propertyId}`)
      .then(res => {

        if (!res.ok) {
          throw new Error("Property not found");
        }

        return res.json();
      })
      .then(data => {

        // const loggedOwner = localStorage.getItem("ownerId");

//         // 🔒 Allow edit only if owner matches
// if (!data.ownerId || !loggedOwner || String(data.ownerId) !== String(loggedOwner)) {
//   console.log("❌ OWNER MISMATCH:", data.ownerId, loggedOwner);

//   // ❌ REMOVE ALERT
//   setProperty(null);
//   setLoading(false);
// }

        setProperty(data);
        setLoading(false);

      })
      .catch(err => {

        console.error(err);

        setLoading(false);

      });

  }, [propertyId, navigate]);



  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  }



  /* ================= PROPERTY NOT FOUND ================= */

  if (!property) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center">

        <h2 className="text-xl font-semibold text-red-600">
          Property not found
        </h2>

        <button
          onClick={() => navigate("/myproperties")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Go Back
        </button>

      </div>
    );

  }



  /* ================= EDIT MODE ================= */

  return (

    <AddProperty
      editMode={true}
      propertyId={propertyId}
    />

  );

}