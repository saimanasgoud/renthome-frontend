import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Country, State, City } from "country-state-city";

const RADIUS_OPTIONS = [1, 3, 5, 10, 15, 20];

function getDistanceKm(lat1, lon1, lat2, lon2) {
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

export default function NearbyFallback({ allHomes = [] }) {

  const [step, setStep] = useState("start");
  const [budget, setBudget] = useState("");
  const [bhk, setBhk] = useState("");
  const [radius, setRadius] = useState(1);
  const [selectedRadius, setSelectedRadius] = useState(1);
  const [userLoc, setUserLoc] = useState(null);
  const [propertyType, setPropertyType] = useState("");
  const [error, setError] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [country, setCountry] = useState("IN");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeData, setPincodeData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [activeMode, setActiveMode] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [results, setResults] = useState([]);

  const tips = [
    "💡 Tip: Homes closer to city centers rent faster.",
    "🏡 Tip: Compare rent and distance before deciding.",
    "📍 Tip: Location access helps us find better homes.",
    "⚡ Tip: Increasing radius shows more homes.",
  ];

  const searchPincode = async () => {

    if (pincode.length !== 6) {
      setError("Enter valid 6 digit pincode");
      setPincodeData([]);
      return;
    }

    setPincodeLoading(true);

    try {

      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data[0].Status !== "Success") {
        setError("Pincode not found");
        setPincodeData([]);
        setPincodeLoading(false);
        return;
      }

      const locationText =
        area && city && state
          ? `${area}, ${city}, ${state}`
          : city && state
            ? `${city}, ${state}`
            : area
              ? area
              : "your location";

      const offices = data[0].PostOffice;

      // const valid = offices.filter(
      //   (po) =>
      //     po.State.toLowerCase().includes(state.toLowerCase()) &&
      //     (
      //       po.District.toLowerCase().includes(city.toLowerCase()) ||
      //       po.Block.toLowerCase().includes(city.toLowerCase()) ||
      //       po.Name.toLowerCase().includes(city.toLowerCase())
      //     )
      // );

      const stateName =
        State.getStatesOfCountry(country).find((s) => s.isoCode === state)?.name || "";

      const valid = offices.filter(
        (po) =>
          po.State.toLowerCase().includes(stateName.toLowerCase())
      );

      if (valid.length === 0) {
        setError("Invalid pincode for selected state or city");
        setPincodeData([]);
        setPincodeLoading(false);
        return;
      }

      setError("");
      setPincodeData(valid);

    } catch (err) {
      setError("Failed to fetch location");
    }

    setPincodeLoading(false);
  };


  /* ---------- LOCATION ---------- */

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setActiveMode("auto");

    navigator.geolocation.getCurrentPosition(

      (pos) => {

        setLocationStatus("allowed");

        setUserLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });

        // start search
        startSearch();

      },

      () => {
        setLocationStatus("denied");
      }

    );

  };

  /* ---------- SEARCH BUTTON ---------- */

  const runSearch = () => {
    setRadius(selectedRadius);
  };

  useEffect(() => {
    if (!country) {
      setCountry("IN");
    }
  }, []);

  /* ---------- NEARBY HOMES ---------- */



  // ✅ PROPERTY TYPE FILTER
  // if (propertyType) {
  //   homes = homes.filter((h) =>
  //     (h.propertyType || "").toLowerCase().includes(propertyType.toLowerCase()));
  // }

  const nearbyHomes = useMemo(() => {

    let homes = results.length > 0 ? results : [];

    if (homes.length === 0) return [];

    return homes
      .map((h) => {

        let parsed = {};
        try {
          parsed = h.formJson ? JSON.parse(h.formJson) : {};
        } catch {
          parsed = {};
        }

        const distanceKm =
          userLoc && h.latitude && h.longitude
            ? getDistanceKm(
              userLoc.lat,
              userLoc.lng,
              Number(h.latitude),
              Number(h.longitude)
            )
            : null;

        return {
          ...h,
          images: h.images || [],
          distanceKm,
          bhk: parsed.bhk || "",
          rent: parsed.rent || 0,
          title:
            parsed.apartmentName ||
            parsed.flatName ||
            h.title ||
            "Property",
          area:
            parsed.area ||
            parsed.city ||
            "Location not specified",
          propertyType: h.propertyType || parsed.propertyType || "",
        };
      })
      .filter(h => {
        if (!radius) return true;
        if (h.distanceKm == null) return true; // allow unknown
        return h.distanceKm <= radius;
      })
      .filter(h => !budget || h.rent <= Number(budget))
      .filter(h => !bhk || (h.bhk || "").includes(bhk))
      .filter(h =>
        !propertyType ||
        (h.propertyType || "")
          .toLowerCase()
          .includes(propertyType.toLowerCase())
      )
      .sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));

  }, [results, userLoc, radius, budget, bhk, propertyType]);


  const startSearch = async () => {

    setStep("search");
    setSearchLoading(true);

    setLoadingMessage("📍 Detecting your location...");
    setProgress(10);

    setTimeout(() => {
      setLoadingMessage("🔎 Searching homes near you...");
      setProgress(40);
    }, 2000);

    setTimeout(() => {
      setLoadingMessage("🏠 Matching homes with your preferences...");
      setProgress(70);
    }, 4000);

    setTimeout(() => {
      setLoadingMessage("✨ Almost ready! Preparing results...");
      setProgress(90);
    }, 6000);

    try {

const query = new URLSearchParams({
  pincode,
  city,
  state,
  area
}).toString();

fetch(`${import.meta.env.VITE_API_URL}/api/forms/search?${query}`);

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        throw new Error("Server error");
      }

      const data = await res.json();

      console.log("Search result:", data);

      if (Array.isArray(data)) {

        setResults(data);

        // ✅ SAVE FOR GLOBAL USE
        localStorage.setItem(
          "searchLocation",
          JSON.stringify({ pincode, city, state, area })
        );
      }

    } catch (err) {
      console.error("Search failed", err);
    }

    setTimeout(() => {
      setProgress(100);
      setSearchLoading(false);
      setStep("results");
    }, 8000);
  };

  useEffect(() => {

    if (step !== "search") return;

    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 2500);

    return () => clearInterval(interval);

  }, [step]);

  return (

    <div className="p-3 bg-white rounded-2xl border shadow-lg max-w-3xl mx-auto">

      {/* STEP 1 */}

      {step === "start" && (

        <div className="text-center space-y-4">

          <h2 className="text-2xl font-bold">
            🔎 Search Homes Within 20 km Radius
          </h2>

          <p className="text-gray-600 max-w-md mx-auto">
            This tool helps you discover homes near your current location.
            We can suggest homes based on your budget and BHK preference.
          </p>

          <div className="bg-blue-50 border rounded-xl p-4 text-sm text-gray-700 max-w-md mx-auto">
            <p>✔ Enter your budget and BHK</p>
            <p>✔ Allow location access</p>
            <p>✔ Discover nearby homes instantly</p>
          </div>

          <button
            onClick={() => setStep("prefs")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>

        </div>

      )}
      {/* STEP 2 */}

      {step === "prefs" && (

        <div className="text-center">

          <h3 className="text-lg font-bold mb-4">
            Tell us what you're looking for
          </h3>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">

            {/* PROPERTY TYPE */}
            <select
              value={propertyType}
              onChange={(e) => {
                setPropertyType(e.target.value);
                setBhk("");
              }}
              className="border rounded-lg p-2"
            >
              <option value="">Select Property Type *</option>
              <option value="PG">PG</option>
              <option value="Apartment">Apartment</option>
              <option value="Flat">Flat</option>
              <option value="IndependentHouse">Independent House</option>
              <option value="Shop">Shop</option>
              <option value="Office">Office</option>
              <option value="Others">Others</option>
            </select>

            {/* BHK */}
            {/* BHK (Only for residential properties) */}
            {(propertyType === "Apartment" ||
              propertyType === "Flat" ||
              propertyType === "IndependentHouse") && (

                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="border rounded-lg p-2"
                >
                  <option value="">Select BHK *</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK+</option>
                </select>

              )}

            {/* BUDGET */}
            <input
              type="number"
              placeholder="Max Budget ₹ (optional)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="border rounded-lg p-2"
            />

          </div>

          {error && (
            <p className="text-red-600 mt-3">{error}</p>
          )}

          <div className="flex justify-center gap-4 mt-4">

            <button
              onClick={() => setStep("start")}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Back
            </button>

            <button
              onClick={() => {

                if (!propertyType) {
                  setError("Please select property type");
                  return;
                }
                if (
                  (propertyType === "Apartment" ||
                    propertyType === "Flat" ||
                    propertyType === "IndependentHouse") &&
                  !bhk
                ) {
                  setError("Please select BHK");
                  return;
                }

                setError("");
                setStep("location");

              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Continue
            </button>

          </div>

        </div>

      )}
      {/* STEP 3 */}
      {/* STEP 3 : LOCATION */}

      {step === "location" && (

        <div className="text-center space-y-4">

          <h3 className="text-lg font-bold">
            📍 Allow Location Access
          </h3>

          <p className="text-gray-600">
            We use your location to find nearby homes.
          </p>

          <div className="flex justify-center gap-4">

            <div className="flex justify-center gap-4">

              <button
                onClick={requestLocation}
                className={`px-5 py-2 rounded-lg font-medium transition
${activeMode === "auto"
                    ? "bg-blue-700 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
`}
              >
                📍 Use My Location
              </button>

              <button
                onClick={() => {
                  setManualMode(true);
                  setStep("location");
                  setActiveMode("manual");
                }}
                className={`px-2 py-2 rounded-lg font-medium transition
${activeMode === "manual"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
`}
              >
                ✏️ Enter Location Manually
              </button>

            </div>
          </div>


          {locationStatus === "allowed" && (
            <p className="text-green-600 text-sm mt-3 bg-green-50 p-2 rounded">
              ✅ Location permission granted
            </p>
          )}

          {locationStatus === "denied" && (
            <p className="text-red-600 text-sm mt-3 bg-red-50 p-2 rounded">
              ❌ Location permission denied. Please enable location access.
            </p>
          )}
        </div>

      )}

      {/* STEP 4 : MANUAL LOCATION */}

      {step === "location" && manualMode && (

        <div className="mt-6 bg-gray-50 border rounded-xl p-4 max-w-md mx-auto space-y-3">

          <h4 className="font-semibold text-center">
            Enter Location
          </h4>


          {/* COUNTRY */}

          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value)
              setState("")
              setCity("")
              setArea("")
              setPincode("")
              setPincodeData([])
            }}
            className="border rounded-lg p-2 w-full"
          >
            <option value="">Select Country</option>

            {Country.getAllCountries().map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}

          </select>

          {/* STATE */}

          {country && (

            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value)
                setCity("")
              }}
              className="border rounded-lg p-2 w-full"
            >

              <option value="">Select State</option>

              {State.getStatesOfCountry(country).map((s) => (
                <option key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </option>
              ))}

            </select>

          )}
          {/* CITY */}

          {state && (

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border rounded-lg p-2 w-full"
            >

              <option value="">Select City</option>

              {City.getCitiesOfState(country, state).map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}

            </select>

          )}
          {/* pincode select */}

          {country === "IN" && city && (

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Enter Pincode
              </label>

              <div className="flex gap-2">

                <input
                  type="number"
                  placeholder="Ex: 500081"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value); setError(""); }}

                  className="border rounded-lg p-2 w-full"
                />

                <button
                  onClick={searchPincode}
                  disabled={pincodeLoading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg active:scale-95 transition"
                >
                  {pincodeLoading ? "Loading..." : "Search"}
                </button>

              </div>
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
            </div>

          )}

          {pincodeData.length > 0 && (

            <div className="border rounded-lg max-h-40 overflow-y-auto">

              {pincodeData.map((po) => (
                <div
                  key={po.Name}
                  className="p-2 hover:bg-yellow-50 cursor-pointer"
                  onClick={() => {

                    setArea(po.Name)
                    setPincodeData([]);
                  }}
                >

                  {po.Name}, {po.District}

                </div>
              ))}

            </div>

          )}

          {area && (

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Selected Area
              </label>

              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />

            </div>

          )}

          {area && (

            <div className="flex justify-between pt-4">

              <button
                onClick={() => {
                  setManualMode(false);
                  setStep("location");
                  setActiveMode("");
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Go Back
              </button>

              <button
                onClick={() => startSearch()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg"
              >
                Save & Continue
              </button>

            </div>

          )}

          <button
            onClick={() => {
              setManualMode(false);
              setStep("prefs"); // ✅ GO TO STEP 2
              setActiveMode("");
              setArea("");
              setCity("");
              setState("");
              setPincode("");
              setPincodeData([]);
              setError("");
            }}
            className="px-4 py-2 bg-red-200 rounded-lg"
          >
            Go Back
          </button>
        </div>


      )}


      {/* STEP 5 */}

      {step === "search" && (

        <div className="text-center space-y-6">

          <h3 className="text-xl font-semibold">
            🔍 Finding homes near
            <span className="text-blue-600 font-bold"> {area || "your location"}</span>
          </h3>

          {/* spinner */}

          <div className="flex justify-center">
            <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
          </div>

          {/* progress bar */}

          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all duration-700"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* loading message */}

          <p className="text-gray-700 font-medium animate-pulse">
            {loadingMessage}
          </p>

          {/* rotating tips */}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 max-w-md mx-auto">
            {tips[tipIndex]}
          </div>

          <p className="text-xs text-gray-400">
            Searching nearby homes. This may take a few seconds.
          </p>

          <button
            onClick={() => setStep("location")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Back
          </button>

        </div>

      )}

      {/* STEP 5 */}

      {step === "results" && (

        <div>
          <div>
            <h3 className="text-xl font-bold">
              🏠 Homes near
              <span className="text-blue-600 font-semibold"> {area || city}</span>
            </h3>

            <p className="text-sm pt-3 pb-3 text-gray-500">
              Within <strong> {radius} km • </strong> <strong>{nearbyHomes.length} </strong> homes found
            </p>

            <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-xl shadow-sm">              <select
              value={selectedRadius}
              onChange={(e) =>
                setSelectedRadius(Number(e.target.value))
              }
              className="border rounded p-1"
            >
              {RADIUS_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r} km
                </option>
              ))}
            </select>
              <button
                onClick={runSearch}
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Update
              </button>

            </div>

          </div>

          {nearbyHomes.length === 0 ? (

            <div className="text-center">
              <div className="text-center py-5">

                <p className="text-lg font-semibold text-gray-700">
                  No homes found within {radius} km
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Try increasing the search radius or changing filters.
                </p>

                <button
                  onClick={() => setStep("location")}
                  className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Search Another Location
                </button>
              </div>

              {/* <button
                onClick={() => setStep("location")}
                className="px-4 -mt-10 py-2 bg-gray-200 rounded-lg"
              >
                Back
              </button> */}

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {nearbyHomes.map((home) => (

                <div
                  key={home.id}
                  className="bg-white border rounded-xl shadow-sm hover:shadow-xl transform hover:scale-105 transition duration-300 p-4"                >

                  <img
                    src={
                      home.images?.[0] ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    className="w-full h-40 object-cover rounded-lg"
                  />


                  <h3 className="font-semibold text-lg">
                    {home.title || home.formJson?.apartmentName || home.formJson?.bhk || "Property"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    📍 {home.area}
                  </p>

                  <div className="flex justify-between items-center">

                    <p className="text-green-700 font-semibold">
                      ₹ {home.rent ? home.rent : "Not specified"}
                    </p>

                    <p className="text-sm text-gray-600">
                      {home.distanceKm !== null
                        ? home.distanceKm < 1
                          ? `${(home.distanceKm * 1000).toFixed(0)} m away`
                          : `${home.distanceKm} km away`
                        : "Location not available"}                    </p>

                  </div>

                  <Link
                    to={`/property/${home.id}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg mt-2"
                  >
                    View Full Details
                  </Link>

                </div>

              ))}

            </div>
          )}

        </div>


      )}

      {pincodeLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">

            <span className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>

            <p className="text-gray-700 font-medium">
              Fetching location details...
            </p>

          </div>

        </div>
      )}

    </div>

  );

}