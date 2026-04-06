import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NearbyFallback from "../components/NearbyFallback";
import { API_BASE_URL } from "../utils/config";

const API_BASE_URL = `${API_BASE_URL}/api/forms/all`;

// ---------------- Utils ----------------
function getDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((R * c).toFixed(1));
}

function extractArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.properties)) return data.properties;
  return [];
}

function normalizeProperty(p) {
  let form = {};

  try {
    if (p.formJson) {
      form = typeof p.formJson === "string"
        ? JSON.parse(p.formJson)
        : p.formJson;
    }
  } catch {
    form = {};
  }

  return {
    id: p.id,
    title: `${p.propertyType} - ${
      form.pgName ||
      form.apartmentName ||
      form.flatName ||
      form.houseName ||
      form.shopName ||
      form.officeName ||
      "Property"
    }`,

    rent: Number(form.rent) || 0,
    deposit: Number(form.deposit) || 0,
    size: Number(form.builtUpArea || form.size) || null,

    // ✅ ADD THESE
    pincode: p.pincode,
    city: p.city,
    state: p.state,

    area:
      form.area ||
      form.locality ||
      form.address ||
      "N/A",

    latitude: Number(p.latitude),
    longitude: Number(p.longitude),

    type: p.propertyType
  };
}

// ---------------- UI ----------------
function Badge({ children, color = "gray" }) {
  const map = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded ${map[color]}`}>
      {children}
    </span>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function PropertyCard({ home, distanceKm, badges = [] }) {
  return (
    <div className="p-4 rounded-xl border bg-white shadow hover:shadow-md transition flex flex-col">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">{home.title}</h3>
        <div className="flex gap-1">
          {badges.map((b, i) => (
            <Badge key={i} color={b.color}>
              {b.text}
            </Badge>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">{home.area}</p>

     <div className="grid grid-cols-2 gap-3 mb-3">
  <Stat label="Rent" value={`₹ ${home.rent}`} />
  <Stat label="Deposit" value={`₹ ${home.deposit}`} />
  <Stat label="Size" value={home.size ? `${home.size} sqft` : "N/A"} />
  <Stat
    label="Distance"
    value={distanceKm !== null ? `${distanceKm} km` : "N/A"}
  />
</div>

      <div className="mt-auto">
        <Link
          to={`/property/${home.id}`}
          className="block text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

// ---------------- Main ----------------
export default function SmartChoice() {
  const [allHomes, setAllHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNearby, setShowNearby] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

    // ✅ ADD HERE (INSIDE COMPONENT)
  const [userLocation, setUserLocation] = useState(null);

  const [searchLocation, setSearchLocation] = useState(
  JSON.parse(localStorage.getItem("searchLocation")) || {}
);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        console.log("Location denied");
      }
    );
  }, []);

const fetchProperties = async () => {
  setLoading(true);
  setError("");

  try {
    // 👇 ADD SMALL DELAY (IMPORTANT FOR UI)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const res = await fetch(API_BASE_URL);

    if (!res.ok) throw new Error("API error");

    const data = await res.json();

    const arr = extractArray(data).map(normalizeProperty);
    setAllHomes(arr);

    if (arr.length === 0) {
      setError("NO_DATA");
    }

  } catch (err) {
    console.error(err);
    setError("FETCH_ERROR");
    setAllHomes([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchProperties();
}, []);

  const enriched = useMemo(() => {
  return allHomes
    .filter((h) => {
      let parsed = {};

      try {
        parsed = h; // already normalized
      } catch {
        parsed = {};
      }

     return (
  (!searchLocation.pincode || h.pincode === searchLocation.pincode) &&
  (!searchLocation.city ||
    h.city?.toLowerCase() === searchLocation.city.toLowerCase()) &&
  (!searchLocation.area ||
    h.area?.toLowerCase().includes(searchLocation.area.toLowerCase()))
);
    })
    .map((h) => {
      const d = userLocation
        ? getDistanceKm(
            userLocation.lat,
            userLocation.lng,
            h.latitude,
            h.longitude
          )
        : null;

      const valueScore =
        h.size && h.rent ? Number((h.rent / h.size).toFixed(2)) : null;

      return { ...h, distanceKm: d, valueScore };
    });
}, [allHomes, userLocation, searchLocation]);

  const cheapest = useMemo(() => {
    if (!enriched.length) return null;
    return enriched.reduce((a, b) => (b.rent < a.rent ? b : a));
  }, [enriched]);

  const closest = useMemo(() => {
    const withDist = enriched.filter((h) => h.distanceKm != null);
    if (!withDist.length) return null;
    return withDist.reduce((a, b) =>
      b.distanceKm < a.distanceKm ? b : a
    );
  }, [enriched]);

  const bestValue = useMemo(() => {
    const withValue = enriched.filter((h) => h.valueScore != null);
    if (!withValue.length) return null;
    return withValue.reduce((a, b) =>
      b.valueScore < a.valueScore ? b : a
    );
  }, [enriched]);

  const picks = useMemo(() => {
    const map = new Map();
    if (cheapest) map.set(cheapest.id, { home: cheapest, tag: "Cheapest" });
    if (closest) map.set(closest.id, { home: closest, tag: "Closest" });
    if (bestValue) map.set(bestValue.id, { home: bestValue, tag: "Best Value" });
    return Array.from(map.values());
  }, [cheapest, closest, bestValue]);

  // ---------------- RENDER ----------------


  
  // If user chose Nearby mode
  if (showNearby) {
    return (
      <div className="min-h-screen mt-16 p-4 bg-gray-50">
        {/* <h1 className="text-2xl font-bold text-center mb-4">
          📍 Find Homes Near You
        </h1> */}

        <div className="max-w-5xl mx-auto">
          <NearbyFallback allHomes={allHomes} />

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowNearby(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              ← Back to Smart Picks
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal SmartChoice UI
  return (
    <div className="min-h-screen mt-16 p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center text-violet-700 mb-2">
        Smart Choice<br></br>Best Homes for You...
      </h1>
      <p className="text-center text-gray-600 mb-6 max-w-xl mx-auto">
        Click the <span className="font-semibold content-justified mb-8 text-black">“Find Homes Near Me”</span> button to discover
        properties around your location. We'll search nearby homes and suggest the best
        options based on distance, rent, and value.
      </p>



      <div className="text-center mb-6">
        <button
          onClick={() => setShowNearby(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
        >
          📍 Find Homes Near Me
        </button>
      </div>
      {showNearby && (
        <div className="max-w-4xl mx-auto mb-8">
          <NearbyFallback allHomes={allHomes} />
        </div>
      )}
      
      {loading && !showNearby && (
  <div className="flex flex-col items-center justify-center p-6 bg-white rounded border">

    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

    <p className="mt-3 text-gray-600 text-sm text-center">
      Fetching latest properties from server...
      <br />
      This may take a few seconds depending on network.
    </p>

    <button
      onClick={fetchProperties}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      🔄 Refresh Properties
    </button>

  </div>
)}


{!loading && error === "FETCH_ERROR" && (
  <div className="text-center p-6 bg-red-50 border border-red-300 rounded">
    
    <p className="text-red-600 font-semibold">
      ⚠️ Unable to load properties
    </p>

    <p className="text-sm text-gray-600 mt-2">
      Server is not running or connection failed.
    </p>

    <button
      onClick={fetchProperties}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      🔄 Try Again
    </button>
  </div>
)}
      {/* {!loading && (error || allHomes.length === 0) && (
        <div className="max-w-4xl mx-auto">
          <NearbyFallback allHomes={allHomes} />
        </div>
      )} */}

      {!loading && !error && picks.length > 0 && !showNearby && (
        <>
          <h2 className="font-semibold p-4 text-violet-800">🏆 Smart Picks For You</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {enriched.map((home) => (
              <PropertyCard
                key={home.id}
                home={home}
                distanceKm={home.distanceKm}
                badges={[]}
              />
            ))}
          </div>


        </>
      )}

      {/* <div className="mt-10 text-center">
        <Link
          to="/properties"
          className="inline-block px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          ← Back to Browse Homes
        </Link>
      </div> */}

    </div>
  );
}
