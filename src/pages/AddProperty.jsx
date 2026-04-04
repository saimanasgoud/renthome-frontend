import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isOwnerLoggedIn } from "../utils/auth";
import { API_BASE_URL } from "../utils/config";
import { Input } from "../components/FormUI";
import Flat from "../propertyforms/Flat";
import Apartment from "../propertyforms/Appartment";
import IndipendentHouse from "../propertyforms/IndependentHouse";
import PG from "../propertyforms/PG";
import Office from "../propertyforms/Office";
import Shop from "../propertyforms/Shop";
import Others from "../propertyforms/Others";

export default function AddProperty({ editMode }) {

  const navigate = useNavigate();
  const { type: urlType, propertyId } = useParams();

  const capitalize = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  const [type, setType] = useState(urlType ? capitalize(urlType) : "");
  const [initialData, setInitialData] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [savedPropertyId, setSavedPropertyId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [posting, setPosting] = useState(false);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null
  });

  /* ================= LOAD OLD DATA FOR EDIT ================= */

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      (err) => {
        console.error("Location error:", err);
      }
    );
  };
  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {

    if (!editMode || !propertyId) return;

    fetch(`${API_BASE_URL}/api/forms/${propertyId}`)
      .then(res => res.json())
      .then(data => {

        const form = JSON.parse(data.formJson);

        setType(data.propertyType);
        setInitialData(form);

      });

  }, [editMode, propertyId]);


  /* ================= SAVE PROPERTY ================= */

  const handleSaveProperty = async (data) => {

   if (!location.latitude || !location.longitude) {
  console.log("Location not available, saving without it");
}

    try {
      setErrorMsg("");

      const ownerId = localStorage.getItem("ownerId");
      const payload = {
        propertyType: type,
        formJson: JSON.stringify(data),
        ownerId: Number(ownerId),
        latitude: location.latitude,
        longitude: location.longitude
      };

      const res = await fetch(`${API_BASE_URL}/api/forms/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const savedData = await res.json();

      setSavedPropertyId(savedData.id);
      setShowConfirm(true);


    } catch (err) {

      console.error(err);
      setErrorMsg(err.message);

    }

  };


  /* ================= POST PROPERTY ================= */

  const postProperty = async () => {

    if (posting) return;
    setPosting(true);

    try {

      setPosting(true);

      const res = await fetch(
        `${API_BASE_URL}/api/forms/post/${savedPropertyId}`,
        { method: "PUT" }
      );

      if (!res.ok) throw new Error("Post failed");

      navigate(`/generate-qr/${savedPropertyId}`);

    } catch (err) {

      alert("Failed to post property.");
      setPosting(false);

    }

  };


  /* ================= OWNER AUTH CHECK ================= */

  if (!isOwnerLoggedIn()) {

    return (

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow text-center mt-24">

        <h2 className="text-2xl font-bold text-red-500 mb-3">
          Owner Login Required
        </h2>

        <p className="text-gray-600 mb-6">
          Please login as a property owner to post your property.
        </p>

        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Login as Owner
        </Link>

      </div>

    );

  }


  /* ================= UI ================= */

  return (

    <div className="max-w-xl mx-auto bg-white p-4 rounded-xl shadow">

      <h1 className="text-2xl font-bold text-center text-green-600 mt-12 mb-6">
        Add Property
      </h1>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
          {errorMsg}
        </div>
      )}

      <label className="block mb-2 text-blue-500 font-medium">
        What type of property are you listing?
      </label>

      {/* <div className="mb-4 text-center">
        <button
          onClick={getUserLocation}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Get My Location 📍
        </button>
      </div> */}

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        disabled={!!urlType}
        className="w-full mb-6 px-4 py-3 border rounded-lg"
      >
        <option value="">Select</option>
        <option>Flat</option>
        <option>Apartment</option>
        <option>Independent House</option>
        <option>PG</option>
        <option>Office</option>
        <option>Shop</option>
        <option>Others</option>
      </select>


      {/* PROPERTY FORMS */}

      {type === "Flat" &&
        <Flat onSave={handleSaveProperty} initialData={initialData} editMode={editMode} />
      }

      {type === "Apartment" &&
        <Apartment onSave={handleSaveProperty} initialData={initialData} editMode={editMode} />
      }

      {type === "Independent House" &&
        <IndipendentHouse onSave={handleSaveProperty} initialData={initialData} editMode={editMode} />
      }

      {type === "PG" &&
        <PG onSave={handleSaveProperty} initialData={initialData} editMode={editMode} />
      }

      {type === "Office" &&
        <Office onSave={handleSaveProperty} initialData={initialData} editMode={editMode} />
      }

      {type === "Shop" &&
        <Shop onSave={handleSaveProperty} initialData={initialData} editMode={editMode} />
      }

      {type === "Others" &&
        <Others onSave={handleSaveProperty} initialData={initialData} editMode={editMode} />
      }

      {/* CONFIRM POPUP */}

      {showConfirm && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl shadow-xl text-center">

            <h2 className="text-xl font-bold text-green-600 mb-3">
              Property Saved Successfully ✅
            </h2>

            <p className="text-gray-600 mb-4">
              Once you post the property, tenants can view it.
            </p>

            <div className="flex gap-4">

              <button
                onClick={postProperty}
                className="flex-1 py-2 cursor-pointer bg-blue-600 text-white rounded-lg"
              >
                Yes, Post Property
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 cursor-pointer bg-gray-300 rounded-lg"
              >
                Go Back / Edit
              </button>

            </div>

          </div>
        </div>

      )}

    </div>

  );

}