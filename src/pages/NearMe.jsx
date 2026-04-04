import { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";

/* ✅ Distance calculation (Haversine Formula) */
function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
}

export default function NearMe() {
  const [status, setStatus] = useState("loading");
  const [coords, setCoords] = useState(null);
  const [errors, setErrors] = useState({});
  const [activePanel, setActivePanel] = useState("none"); // "homes" | "manual" | null
  const [selectedHome, setSelectedHome] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [filteredHomes, setFilteredHomes] = useState([]);
  const [uiError, setUiError] = useState("");
  const [mode, setMode] = useState(null);
  const [typingText, setTypingText] = useState("");


  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });

        setStatus("allowed");
        setActivePanel("results");
      },
      (error) => {
        console.log(error);

        if (error.code === 1) {
          setStatus("denied");
          setActivePanel("permission");
        } else {
          setStatus("denied");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };


useEffect(() => {
  const text = "✨ You can add filters to find homes near you faster";
  let i = 0;

  const interval = setInterval(() => {
    setTypingText(text.slice(0, i));
    i++;

    if (i > text.length) clearInterval(interval);
  }, 40);

  return () => clearInterval(interval);
}, []);

const [manualLocation, setManualLocation] = useState({
  country: "IN",
  state: "",
  city: "",
  pincode: "",
});

const [homes, setHomes] = useState([]);

useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/forms/all`)
    .then(res => res.json())
    .then(data => {
      const formatted = data.map(p => {
        let parsed = {};
        try {
          parsed = JSON.parse(p.formJson || "{}");
        } catch {
          parsed = {};
        }

        return {
          id: p.id,
          propertyType: p.propertyType || "Property",
          title: p.title || "Property",
          apartment: parsed.apartmentName || "N/A",
          bhk: parsed.bhk || "N/A",
          city: parsed.city || "",
          pincode: parsed.pincode || "",
          lat: p.latitude,
          lng: p.longitude
        };
      });

      setHomes(formatted); // ✅ MISSING IN YOUR CODE
    });
}, []);

useEffect(() => {
  if (homes.length > 0) {

    const nearby = homes
      .map(home => {
        const distance =
          coords && home.lat != null && home.lng != null
          ? getDistanceInKm(coords.lat, coords.lng, home.lat, home.lng)
            : null;

        return { ...home, distance: Number(distance) };
      })
      .filter(home => home.distance !== null && home.distance <= 10)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));

    setFilteredHomes(nearby);
  }
}, [coords, homes]);

const permissionPanel = (
  <div className="max-w-md mx-auto bg-white border rounded-xl p-6 shadow-md mb-8">
    <div className="flex items-start gap-3 mb-4">
      <span className="text-2xl">📍</span>
      <h3 className="text-lg font-bold text-gray-800">
        Location Access Required
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        Allow location to discover homes near you instantly.
      </p>
    </div>

    <ul className="text-gray-700 text-sm space-y-2 mb-4 list-disc pl-5">
      <li>Show homes that are truly near your location</li>
      <li>Calculate accurate distance and travel time</li>
      <li>Your location is secure and never stored</li>
    </ul>

    <div className="flex gap-3">
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        How to Enable
      </button>

      <button
        onClick={() => setActivePanel("manual")}
        className="flex-1 border border-gray-400 text-gray-700 py-2 rounded hover:bg-gray-100"
      >
        Enter Manually
      </button>
    </div>
    {showHelp && (
      <div className="mt-4 bg-blue-50 border border-blue-300 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold mb-2">Enable Location Permission</p>

        <ol className="list-decimal pl-5 space-y-1">
          <li>Click the 🔒 lock icon near the browser address bar.</li>
          <li>Open <b>Site Settings</b>.</li>
          <li>Find <b>Location</b> permission.</li>
          <li>Select <b>Allow</b>.</li>
          <li>Refresh this page.</li>
        </ol>

        <button
          onClick={() => window.location.reload()}
          className="mt-3 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          Refresh Page
        </button>
      </div>
    )}
  </div>
);

const validateManualLocation = () => {
  const newErrors = {};

  const city = manualLocation.city || "";
  const pincode = manualLocation.pincode || "";

  // ✅ City validation
  if (!city.trim()) {
    newErrors.city = "City is required";
  }

  // ✅ Pincode validation
  if (!pincode.trim()) {
    newErrors.pincode = "Pincode is mandatory";
  } else if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    newErrors.pincode = "Enter valid 6-digit pincode";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleManualSearch = () => {

  validateManualLocation(); // optional

  const searchCity = (manualLocation.city || "").toLowerCase();
  const searchPincode = manualLocation.pincode || "";

  const filtered = homes.filter((home) => {
    const city = (home.city || "").toLowerCase();
    const pincode = home.pincode || "";

    // ✅ if nothing entered → show ALL homes
    if (!searchCity && !searchPincode) return true;

    // ✅ if pincode entered → match pincode
    if (searchPincode) return pincode === searchPincode;

    // ✅ if city entered → match city
    if (searchCity) return city.includes(searchCity);

    return true;
  });

  setFilteredHomes(filtered);
  setActivePanel("results");
  setMode("manual");
};

/* -------- PANELS (DEFINED BEFORE RETURN) -------- */
const manualPanel = (
  <div className="max-w-md mx-auto bg-white p-5 rounded-xl shadow">

    {/* country */}
    <select
      className="w-full mb-3 p-2 border rounded"
      value={manualLocation.country}
      onChange={(e) =>
        setManualLocation({ ...manualLocation, country: e.target.value })
      }
    >
      <option value="">Select Country</option>
      {Country.getAllCountries().map((c) => (
        <option key={c.isoCode} value={c.isoCode}>
          {c.name}
        </option>
      ))}
    </select>

    {/* state */}
    <select
      className="w-full mb-3 p-2 border rounded"
      value={manualLocation.state}
      onChange={(e) =>
        setManualLocation({ ...manualLocation, state: e.target.value })
      }
    >
      <option value="">Select State</option>
      {State.getStatesOfCountry(manualLocation.country).map((s) => (
        <option key={s.isoCode} value={s.isoCode}>
          {s.name}
        </option>
      ))}
    </select>

    {/* city */}

    <select
      className="w-full mb-3 p-2 border rounded"
      value={manualLocation.city}
      onChange={(e) =>
        setManualLocation({ ...manualLocation, city: e.target.value })
      }
    >
      <option value="">Select City</option>
      {City.getCitiesOfState(
        manualLocation.country,
        manualLocation.state
      ).map((c, i) => (
        <option key={i} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>

    {errors.city && (
      <p className="text-red-500 text-sm">{errors.city}</p>
    )}

    {/* pincode */}
    <input
      type="text"
      placeholder="Enter Pincode"
      value={manualLocation.pincode}
      onChange={(e) =>
        setManualLocation({ ...manualLocation, pincode: e.target.value })
      }
      className="w-full mb-3 p-2 border rounded"
    />
    {errors.pincode && (
      <p className="text-red-500 text-sm">{errors.pincode}</p>
    )}
    {uiError && (
      <p className="text-red-500 text-sm text-center mb-2">
        ⚠️ {uiError}
      </p>
    )}

    <button
      onClick={handleManualSearch}
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      🔍 Search Homes
    </button>

  </div>
);

const homesPanel = (
  <div className="max-w-3xl mx-auto space-y-4 mb-10">

    <p className="text-center text-gray-600 mb-4">
      Showing <strong>{filteredHomes.length}</strong> homes near you
    </p>

    {filteredHomes.length === 0 && activePanel === "results" && (
      <p className="text-center text-red-500 font-medium">
        ❌ No homes found your search. Try different filters.
      </p>
    )}
    {filteredHomes.map((home) => {
      const distance =
        coords && home.lat && home.lng
          ? Number(getDistanceInKm(coords.lat, coords.lng, home.lat, home.lng))
          : null;

      const isOpen = selectedHome === home.id;

      return (
        <div
          key={home.id}
          className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition"
        >
          <h2 className="text-lg font-bold text-blue-700">
            {home.propertyType}
          </h2>

          <p className="text-gray-800 font-semibold">
            {home.apartment !== "N/A"
              ? home.apartment
              : home.bhk !== "N/A"
                ? home.bhk
                : home.propertyType}
          </p>

          <p className="text-sm text-gray-600">
            🏠 {home.bhk}
          </p>

          <p className="text-sm text-gray-500">
            📍 {home.city || "Location not specified"}
          </p>

          <p className="text-green-600 font-semibold">
            {distance !== null
              ? distance < 1
                ? `${(distance * 1000).toFixed(0)} m away`
                : `${distance} km away`
              : "Location not available"}
          </p>

          <a
            href={`https://www.google.com/maps?q=${home.lat},${home.lng}`}
            target="_blank"
            className="text-blue-600 underline text-sm"
          >
            View on Map →
          </a>
        </div>
      )
    })}

  </div>
);
/* -------- UI -------- */

return (
  <div className="pt-20 px-4 max-w-5xl mx-auto">
    <h1 className="text-2xl font-bold mb-6 text-center">
      Homes Near You
    </h1>

    {status === "loading" && (
      <p className="text-center mb-3 text-gray-600">
        Checking location permission...
      </p>
    )}

    <p className="text-center text-blue-600 font-medium mb-4">
      {typingText}
    </p>

    {/* LOCATION STATUS */}
    {status === "allowed" && (
      <div className="max-w-md mx-auto mb-6 flex items-center gap-3 
                  bg-green-50 border border-green-400 
                  text-green-700 px-4 py-2 rounded-lg shadow-sm">
        <span className="text-xl">✅</span>
        <p className="font-medium">
          Location access granted. Showing nearby homes.
        </p>
      </div>
    )}

    {status === "denied" && (
      <div className="max-w-md mx-auto mb-6 flex items-center gap-3
                      bg-yellow-50 border border-yellow-400
                      px-4 py-2 rounded-lg">
        <span className="text-xl">⚠️</span>
        <p className="font-medium text-red-500">
          Location access denied. Please enter your location manually.
        </p>
      </div>
    )}
    {/* BUTTONS */}
    <div className="flex gap-4 justify-center mb-6">

      <button
        onClick={() => {
          setMode("gps");
          requestLocation();
        }}
        className={`px-5 py-2 rounded-full font-semibold transition-all duration-300
  ${mode === "gps"
            ? "bg-blue-700 text-white"
            : "bg-white text-gray-800 border border-green-700"
          }`}
      >
        Find Homes Near Me
      </button>

      <button
        onClick={() => {
          setMode("manual");
          setActivePanel("manual")
        }}

        className={`px-5 py-2 rounded-full font-semibold transition-all duration-300
  ${mode === "manual"
            ? "bg-green-700 text-white"
            : "bg-white text-gray-800 border border-green-700"
          }`}
      >
        Change Location
      </button>
    </div>

    {/* CONTENT BELOW BUTTONS */}
    {activePanel === "permission" && permissionPanel}
    {activePanel === "manual" && manualPanel}
    {/* 🔥 BEST RESULTS PANEL */}

    {activePanel === "results" && (
  <div className="mt-8">
    <h2 className="text-xl font-bold text-center mb-4">
      🔥 Filtered Homes Near You
    </h2>

    {homesPanel}
  </div>
)}

  </div>
);
}
