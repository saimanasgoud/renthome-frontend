import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";
import Info from "../components/Info";
import Loader from "../components/Loader";
import "../styles/PropertyDetails.css";
import { ImageGallery } from "./PropertyDetails";

export default function QRCodeGenerator() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [ownerProperties, setOwnerProperties] = useState([]);
  const [showList, setShowList] = useState(false);
  const myProperties =
    JSON.parse(localStorage.getItem("myProperties")) || [];
  const ownerId = localStorage.getItem("ownerId");
  const role = localStorage.getItem("role");
  const isOwner = role === "OWNER";
  useEffect(() => {
    if (!propertyId) {
      // frontend-only: count properties from localStorage
      const myProps = JSON.parse(
        localStorage.getItem("myProperties") || "[]"
      );

      setLoading(false);
    }
  }, [propertyId]);

  const fetchOwnerProperties = async () => {
    try {

      if (!ownerId) {
        alert("Owner not logged in");
        return;
      }

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/forms/owner`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("OWNER ID:", ownerId);

      if (!res.ok) throw new Error("Failed to fetch properties");

      const data = await res.json();

      // sort latest first
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOwnerProperties(sorted);
      setShowList(true);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }


    // const token = localStorage.getItem("token");

    // fetch(`${API_BASE_URL}/api/forms/${propertyId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // })     

    fetch(`${API_BASE_URL}/api/forms/${propertyId}`)

      .then((res) => {
        if (!res.ok) throw new Error("Property not found");
        return res.json();
      })
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [propertyId]);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token && propertyId) {
  //     navigate("/login");
  //   }
  // }, [navigate, propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader />
      </div>
    )
  }

  if (propertyId && !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Property not found
        </h2>

        <button
          onClick={() => {
            if (role === "OWNER") {
              navigate("/owner/addproperty");
            } else {
              alert("Only owners can add property");
            }
          }}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Property
        </button>
      </div>
    );
  }



  if (!propertyId && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white max-w-md w-full p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-bold text-gray-800">
            Select a property to generate QR
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Choose one of your listed properties
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                if (role === "OWNER") {
                  navigate("/owner/myproperties");
                } else {
                  alert("Only owners allowed");
                }
              }}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold"
            >
              📋 View My Properties
            </button>

            <button
              onClick={() => {
                if (role === "OWNER") {
                  navigate("/owner/addproperty");
                } else {
                  navigate("/login");
                }
              }}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold"
            >
              ➕ Add New Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  let parsedForm = {};
  try {
    parsedForm = property?.formJson
      ? JSON.parse(property.formJson)
      : {};
  } catch (e) {
    console.error("Invalid formJson", e);
  }

  console.log("PROPERTY:", property);
  console.log("FORM JSON:", property?.formJson);
  console.log("PARSED FORM:", parsedForm);
  console.log("IMAGES:", parsedForm.images);

  const qrValue = `${window.location.origin}/renthome/property/${propertyId}`;

  /* ---------- HELPERS ---------- */

  const formatLabel = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase());

  const renderValue = (value) => {
    if (value === null || value === undefined || value === "") return "-";

    // ✅ HANDLE STRING LIST (amenities case)
    if (typeof value === "string" && value.includes(",")) {
      return value;
    }

    // Array
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    // Object
    if (typeof value === "object") {
      return Object.entries(value)
        .map(([k, v]) => {
          if (typeof v === "object") {
            return `${k}: ${v.from || ""} - ${v.to || ""}`;
          }
          return `${k}: ${v}`;
        })
        .join(" | ");
    }

    return value.toString();
  };

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });


  return (
    <div className="min-h-screen mt-10 bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl border rounded-lg p-6">

        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl font-semibold italic text-indigo-700 text-center
               bg-indigo-50 border border-indigo-200 rounded-xl px-2 py-1 shadow-sm">
          Tenant Viewing Details
        </h1>

        <p className="text-sm mt-5 text-center text-green-600 mt-1">
          Generated on {today}
        </p>
        {/* 
        <p className="text-center text-sm text-gray-600 mt-1">
          Property ID: #{property.id} |{" "}
          {new Date(property.createdAt).toLocaleDateString()}
        </p> */}

        {/* PROPERTY TYPE */}
        <div className="mt-6 text-center">
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold
            ${property.propertyType === "Apartment"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
            }`}>
            {property.propertyType}
          </span>

        </div>

        {/* DYNAMIC DETAILS */}
        <div className="mt-8">
          <h2 className="font-bold border-b pb-2 mb-4">
            PROPERTY INFORMATION
          </h2>

          {/* ===== PG DETAILS ===== */}
          {/* {property.propertyType === "PG" && (
            <div className="mt-8">
              <h2 className="font-bold border-b pb-2 mb-4">
                PG DETAILS
              </h2>

              <div className="space-y-3 text-sm">
                <Info label="PG Name" value={parsedForm.pgName} />
                <Info label="PG Type" value={parsedForm.pgType} />
                <Info label="Occupancy" value={parsedForm.occupancyType} />
                <Info label="Rent Per Bed" value={parsedForm.rent && `₹ ${parsedForm.rent}`} />
                <Info label="Deposit" value={parsedForm.deposit && `₹ ${parsedForm.deposit}`} />
                <Info label="Facilities" value={parsedForm.facilities?.join(", ")} />

                {parsedForm.foodTimings && (
                  <Info
                    label="Food Timings"
                    value={Object.entries(parsedForm.foodTimings)
                      .map(([meal, t]) => `${meal}: ${t.from} - ${t.to}`)
                      .join(" | ")}
                  />
                )}

                <Info label="Contact Name" value={parsedForm.contactName} />
                <Info label="Mobile" value={parsedForm.mobile} />
              </div>
            </div>
          )} */}
          {/* 
          <div className="pd-sections">

  {Object.entries(parsedForm).map(([key, value]) => {
    if (!value || key === "images") return null;

    return (
      <div key={key} className="pd-card">

        <div className="pd-card-header">
          <h2>
            {key.replace(/([A-Z])/g, " $1")}
          </h2>
        </div>

        <div className="pd-card-body">
          <div className="pd-value">
            {renderValue(value)}
          </div>
        </div>

      </div>
    );
  })}

</div> */}

          <div className="pd-sections">
            {Object.entries(parsedForm).map(([key, value]) => {
              if (!value || key === "images") return null;

              return (
                <div key={key} className="pd-card">
                  <div className="pd-card-header">
                    <h2>{formatLabel(key)}</h2>
                  </div>

                  <div className="pd-card-body">
                    <div className="pd-value">
                      {renderValue(value)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ✅ SHOW IMAGES */}
          {/* <h3 className="mt-5">images</h3>

    {parsedForm.images && (
<div className="grid grid-cols-1 mt-5 sm:grid-cols-2 gap-4 mb-4">       
   {parsedForm.images.map((img, i) => (
    <div
        key={i}
        className="overflow-hidden rounded-xl shadow-md border bg-white">
  
  <img
    src={img}
    alt="property"
    className="w-full h-32 sm:h-36 md:h-40 object-cover"
  /> */}
          {/* </div>
        ))}
      </div>
    )} */}

          {parsedForm.images && parsedForm.images.length > 0 && (
            <div className="pd-card">
              <div className="pd-card-header">
                <h2>Images</h2>
              </div>

              <div className="pd-card-body">
                <ImageGallery images={parsedForm.images} />
              </div>
            </div>
          )}

          {property.propertyType !== "PG" &&
            property.propertyType !== "Apartment" && (
              <div className="space-y-3 text-sm">
                {Object.entries(parsedForm).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex border-b last:border-none pb-2"
                  >
                    <div className="w-1/3 font-medium text-gray-700">
                      {formatLabel(key)}
                    </div>
                    <div className="w-auto text-gray-900">

                      {key === "images" ? (
                        <div className="grid grid-cols-1 gap-3">
                          {(Array.isArray(value) ? value : JSON.parse(value || "[]")).map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="property"
                              className="rounded-lg w-full h-40 object-cover border"
                            />
                          ))}
                        </div>
                      ) : (
                        renderValue(value)
                      )}

                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* DECLARATION */}
        <div className="border-t mt-8 pt-4 text-sm text-gray-600">
          I hereby confirm that the above property details are correct and
          published for tenant viewing.
        </div>

        <h1 className="text-xl mt-10 md:text-3xl font-bold italic text-emerald-700 text-center
               bg-emerald-50 border-l-4 border-emerald-600 rounded-lg px-1 py-2 shadow">
          ✔ Verified Rental Details
        </h1>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">          {/*  <button
            onClick={() => setShowQR(true)}
            className="flex-1 ml-16 mr-16 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Generate QR Code
          </button> */}
          {/* <button
            onClick={() => window.print()}
            className="flex-1 bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-800"
          >
            Download / Print
          </button> */}
        </div>


        {isOwner && (
          <div className="flex gap-4 mt-6">

            <button
              onClick={() =>
                navigate(`/edit-property/${property.propertyType}/${propertyId}`)
              }
              className="w-full bg-yellow-400 text-white py-3 rounded-xl font-semibold shadow hover:bg-yellow-500"
            >
              ✏️ Back to Edit
            </button>

            <button
              onClick={fetchOwnerProperties}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-purple-700"
            >
              View Latest Properties
            </button>

            <button
              onClick={() => setShowQR(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-blue-700"
            >
              Generate QR Code
            </button>

          </div>
        )}

        {showList && ownerProperties.length > 0 && (
          <div className="mt-6 border rounded-lg p-4 bg-gray-50">

            <h3 className="font-semibold mb-3">
              Your Recently Posted Properties
            </h3>

            {ownerProperties.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center border-b py-2"
              >

                <span>
                  🏠 {p.title || p.propertyType} #{p.id}
                </span>

                <button
                  onClick={() => navigate(`/generate-qr/${p.id}`)}
                  className="text-blue-600 font-medium"
                >
                  View QR
                </button>

              </div>
            ))}

          </div>
        )}
        {/* QR SECTION */}
        {showQR && (
          <div className="mt-10 text-center">
            <div className="inline-block p-4 border rounded-lg bg-white">
              <QRCode value={qrValue} size={180} />
            </div>

            {/* <p className="text-xs text-gray-500 mt-3 break-all">
              {qrValue}
            </p> */}

            <div className="flex gap-3 grid-cols-2 grid mt-4">

              {/* DOWNLOAD */}
              <button
                onClick={() => {
                  const svg = document.querySelector("svg");
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext("2d");

                  const img = new Image();
                  img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    const pngFile = canvas.toDataURL("image/png");

                    const downloadLink = document.createElement("a");
                    downloadLink.download = `property-${propertyId}-qr.png`;
                    downloadLink.href = pngFile;
                    downloadLink.click();
                  };

                  img.src =
                    "data:image/svg+xml;base64," +
                    btoa(unescape(encodeURIComponent(svgData)));
                }}
                className="bg-green-600 text-white py-3 rounded-lg font-semibold"
              >
                Download
              </button>

              {/* PRINT */}
              <button
                onClick={() => window.print()}
                className="bg-gray-700 text-white py-3 rounded-lg font-semibold"
              >
                Print
              </button>

              {/* SHARE */}
              <button
                onClick={async () => {
                  if (navigator.share) {
                    await navigator.share({
                      title: "Rental Property",
                      text: "Check this rental property",
                      url: qrValue,
                    });
                  } else {
                    alert("Sharing not supported on this browser");
                  }
                }}
                className="bg-blue-600 text-white py-3 rounded-lg font-semibold"
              >
                Share
              </button>

              {/* CLOSE */}
              <button
                onClick={() => setShowQR(false)}
                className="bg-gray-300 py-3 rounded-lg font-semibold"
              >
                Close
              </button>

              {/* <button
                onClick={() => navigator.share?.({ url: qrValue })}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
              >
                Share
              </button> */}

              <div className="flex gap-3 mt-4">
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
