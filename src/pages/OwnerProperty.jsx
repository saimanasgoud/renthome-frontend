import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";
import Loader from "../components/Loader";

export default function MyProperties() {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteProperty, setDeleteProperty] = useState(null); const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const ownerId = localStorage.getItem("ownerId");

  /* ================= DELETE PROPERTY ================= */

  const handleDelete = (property) => {

    fetch(`${API_BASE_URL}/api/forms/${property.id}`, {
      method: "DELETE",
    }).then(() => {

      setProperties(prev => prev.filter(p => p.id !== property.id));
      setShowDeleteModal(false);
      setDeleteProperty(null);

    });

  };


  /* ================= FETCH OWNER PROPERTIES ================= */

  useEffect(() => {

    if (!ownerId) {
      console.warn("OwnerId missing");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/forms/owner/${ownerId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setProperties(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Error fetching properties:", err);
        setProperties([]);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [ownerId]);


  /* ================= DASHBOARD STATS ================= */

  const total = properties.length;
  const posted = properties.filter(p => p.posted).length;
  const draft = properties.filter(p => !p.posted).length;

  /* ================= LOADING UI ================= */

  if (loading) {
    return (
      // <div className="pt-20 text-center text-gray-500 animate-pulse">
      //   Loading your properties...
      // </div>
      <Loader />
    );
  }


  /* ================= MAIN UI ================= */

  return (
    <div className="pt-20 px-4 min-h-screen bg-gray-100">

      {/* OWNER SUMMARY */}
      <div className="bg-white border rounded-xl shadow p-5 mb-6">

        <h3 className="text-lg text-gray-600 mt-2">
          You have <span className="font-semibold text-indigo-600">{total} </span>
          properties registered with <span className="font-semibold">RentHomes</span>.
        </h3>

        <p className="text-1xl text-gray-500 mt-2 italic">
          Manage your listings, track performance, and attract tenants faster.
        </p>

        <div className="mt-4 text-center">

          <p className="text-sm flex text-gray-500 mb-2"
            onClick={() => navigate("/analytics")}>
            Want to see detailed performance and analytics...? <strong className="underline bg-yellow-200 p-0.2 cursor-pointer rounded-lg"> Then View Full Analytics →</strong>
          </p>

        </div>

      </div>

      {properties.length === 0 ? (

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-red-600 mb-4">
            You haven’t posted any properties yet.
          </p>

          <button
            onClick={() => navigate("/addproperty")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            ➕ Add Your First Property
          </button>
        </div>

      ) : (

        <div className="grid gap-5">

          {properties.map((property) => {

            const title = property.title || "Untitled Property";
            const area = property.area || "N/A";
            const rent = property.rent || "N/A";
            return (
              <div
                key={property.id}
                className="bg-white border rounded-xl shadow hover:shadow-lg transition p-5"
              >

                <div className="flex justify-between items-center">

                  <h2 className="font-semibold text-lg">
                    {title}
                  </h2>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${property.posted
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {property.posted ? "Posted" : "Draft"}
                  </span>

                </div>

                <p className="text-gray-500 text-sm mt-2">
                  📐 {area} sq.ft • 💰 ₹{rent}
                </p>

                <div className="flex gap-3 mt-4 flex-wrap">

                  <button
                    onClick={() => navigate(`/generate-qr/${property.id}`)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    View QR
                  </button>

                  <button
                    onClick={() => navigate(`/property/${property.id}`)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => navigate(`/edit-property/${property.propertyType.toLowerCase()}/${property.id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setDeleteProperty(property);
                      setShowDeleteModal(true);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

                {showDeleteModal && (
                  <div className="fixed inset-0 bg-black/0 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 w-[340px] text-center border border-gray-200">
                      <h3 className="text-lg font-semibold text-red-600 flex items-center justify-center gap-2">
                        ⚠️ Delete Property Permanently
                      </h3>

                      <p className="text-1xl p-2 text-gray-500">
                        Verify the property details before confirming deletion.
                      </p>

                      {deleteProperty && (
                        <div className="mt-0 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-left">



                          <div className="mt-3 space-y-1 text-gray-600 text-xs">

                            <div className="text-center">

                              <div className="flex justify-center">

                              </div>


                              {deleteProperty && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">

                                  <p className="text-gray-700">
                                    🏠 <span className="font-semibold">{deleteProperty.propertyType}</span>
                                  </p>

                                  <p className="text-gray-500 mt-1">
                                    📅 Uploaded on{" "}
                                    <span className="font-medium">
                                      {deleteProperty.createdAt
                                        ? new Date(deleteProperty.createdAt).toLocaleDateString()
                                        : "Unknown"}
                                    </span>
                                  </p>

                                </div>
                              )}

                              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                                ⚠️ Once this property is deleted, it <strong>cannot be recovered</strong> or restored.
                              </div>

                            </div>

                          </div>

                        </div>
                      )}

                      <div className="flex justify-center gap-20 mt-5">

                        <button
                          onClick={() => setShowDeleteModal(false)}
                          className="px-4 py-2 bg-gray-200 rounded-lg"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={() => handleDelete(deleteProperty)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            );

          })}

        </div>

      )}

    </div>
  );
}