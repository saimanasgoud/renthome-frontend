import { useEffect, useState } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";

export default function Home() {

  const [loaded, setLoaded] = useState(false);
  const role = localStorage.getItem("role") || "";
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [wakingUp, setWakingUp] = useState(false);
  const [backendStatus, setBackendStatus] = useState("unknown");
  // "unknown" | "sleeping" | "running"

  useEffect(() => {

    setSearchLoading(true); // start loading

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setSearchLoading(false); // stop loading
    }, 500); // you can adjust time

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
  }, []);


  const fetchWithTimeout = (url, options, timeout = 5000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT")), timeout)
      ),
    ]);
  };

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    setLoading(true);

    const startTime = Date.now();

    fetch(`${API_BASE_URL}/api/auth/ping`)
      .then(res => res.text())
      .then(data => setProperties(data || []))
      .catch(err => {
        console.error(err);
        setProperties([]);
      })
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const minTime = 3000; // 👈 2 seconds (change this)

        const remainingTime = minTime - elapsed;

        setTimeout(() => {
          setLoading(false);
        }, remainingTime > 0 ? remainingTime : 0);
      });
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.pincode) {
      setSearch(location.state.pincode);
    }
  }, []);


const checkBackend = async () => {
  setWakingUp(true);

  try {
    const res = await fetchWithTimeout(
      `${API_BASE_URL}/api/auth/ping`,
      {},
      5000
    );

    if (res.ok) {
      setBackendStatus("running");
    } else {
      setBackendStatus("unreachable");
    }
  } catch (err) {
    setBackendStatus("unreachable");
  }

  setWakingUp(false);
};  

  useEffect(() => {
    checkBackend();
  }, []);

  useEffect(() => {
  if (backendStatus === "unreachable") {
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }
}, [backendStatus]);

  const filteredHomes = (properties || []).filter((home) => {
    let parsed = {};

    try {
      parsed = JSON.parse(home.formJson || "{}");
    } catch {
      parsed = {};
    }

    const searchText = debouncedSearch.toLowerCase();

    // 🔥 STRICT LOCATION FILTER
    const matchesLocation =
      (parsed.pincode?.includes(searchText) ||
        parsed.city?.toLowerCase().includes(searchText) ||
        parsed.selectedArea?.toLowerCase().includes(searchText));

    return matchesLocation;
  });

  const highlight = (text) => {
    if (!text || typeof text !== "string") return "";

    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, `<mark>$1</mark>`);
  };

  return (

    // <div className="min-h-screen mt-10 bg-gradient-to-b from-blue-50 to-white px-4 flex flex-col">

    <div className={`min-h-screen mt-10 bg-gradient-to-b from-blue-50 to-white px-4 flex flex-col transition-all duration-700 
      ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

      {backendStatus === "unreachable" && (
        <div className="bg-yellow-50 text-purple-600 p-3 mt-8 rounded-lg text-center mb-4">
          ⏳ Server is currently unavailable. Attempting to reconnect.....

          <button
            onClick={checkBackend}
            disabled={wakingUp}
            className="ml-3 mt-4 px-3 py-1 bg-yellow-200 border border-pink-600 text-gray-800 font-semibold rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {wakingUp ? "⏳ Connecting to server…" : "Reconnect Now"}
          </button>

          {backendStatus === "unreachable" && !wakingUp && (
            <p className="text-sm mt-4 text-red-500 mt-2">
              ⚠️ Backend service is currently unreachable
            </p>
          )}
        </div>
      )}


      {backendStatus === "running" && (
        <p className="text-green-600 text-center mb-2">
          ✅ Server is running
        </p>
      )}


      {/* SEARCH BAR */}
      <section className="mt-10 max-w-xl mx-auto animate-slideUp w-full">
        <input
          type="text"
          placeholder="Search by area, BHK, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-4 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </section>

      {/* SEARCH RESULTS */}
      {search && (
        <section className="mt-10 max-w-3xl mx-auto w-full">

          {searchLoading ? (
            <div className="space-y-4 mt-6 skeleton rounded">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow border flex gap-4 animate-pulse"
                >
                  {/* IMAGE SKELETON */}
                  <div className="w-32 h-24 bg-gray-200 rounded-lg"></div>

                  {/* TEXT SKELETON */}
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (

            <>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Search Results for "<span className="text-yellow-600">{search}</span>" are Total <strong className="text-green-600"> {filteredHomes.length} </strong> Homes
              </h2>

              {filteredHomes.length === 0 ? (
                <p className="text-gray-500 text-center">
                  😕 No homes found for "{search}"
                  <br />
                  Try a different area or pincode
                </p>
              ) : (

                <div className="space-y-4">

                  {filteredHomes.map((home) => {
                    let parsed = {};
                    try {
                      parsed = JSON.parse(home.formJson || "{}");
                    } catch {
                      parsed = {};
                    }
                    return (
                      <div
                        key={home.id}
                        className="bg-white rounded-xl p-4 shadow border flex gap-4"
                      >

                        {/* IMAGE */}
                        <img
                          src={
                            parsed.images?.[0] ||
                            home.images?.[0] ||
                            "https://via.placeholder.com/150"
                          }
                          alt="property"
                          className="w-32 h-24 object-cover rounded-lg"
                        />

                        {/* DETAILS */}
                        <div className="flex-1">

                          {/* TITLE */}
                          <h3
                            className="font-bold text-lg"
                            dangerouslySetInnerHTML={{
                              __html: highlight(home?.title || ""),
                            }}
                          />

                          {/* TYPE */}
                          <p className="text-sm text-blue-600 font-semibold">
                            {home.propertyType || "Property"}
                          </p>

                          {/* LOCATION */}
                          <p className="text-gray-600 text-sm">
                            {parsed.apartmentName ||
                              parsed.area ||
                              parsed.locality ||
                              "Location not available"}
                          </p>

                          {/* RENT */}
                          <p className="text-green-600 font-semibold mt-1">
                            ₹{parsed.rent || home.rent || "N/A"}
                          </p>

                          {/* BUTTON */}
                          <Link
                            to={`/property/${home.id}`}
                            className="inline-block mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            View Full Info →
                          </Link>


                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      )}



      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse absolute top-10 left-10"></div>
        <div className="w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse absolute bottom-10 right-10"></div>
      </div>

      {/* HERO */}
      <section className="pt-10 text-center">
        {/* <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 animate-fadeIn"> */}
        {/* <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 animate-fadeIn"> */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 animate-fadeIn tracking-wide leading-tight">
          Find Rental Homes Instantly, No Brokers! <br />
          <span className="block text-blue-600 mt-2">
            Instantly with QR Code
          </span>
        </h1>

        {role && (
          <p className="mt-2 text-sm text-gray-500 animate-fadeIn">
            Welcome back, {role.toLowerCase()} 👋
          </p>
        )}

        <p className="mt-4 text-gray-600 max-w-md mx-auto animate-slideUp">
          RentHome helps you discover houses, flats, and rooms for rent without
          brokers. people find the right home directly and transparently and
          contact owners directly...        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
          <Link
            to="/user/nearme"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 hover:scale-105 transition duration-300"

          >Find Homes Near Me
          </Link>

          <Link
            to="/addproperty"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition duration-300 shadow hover:shadow-xl"          >
            Post / add Property
          </Link>
        </div>
      </section>

      {/* TRUST CARD */}
      {/* <div className="flex justify-center mt-6">
        <div className="bg-white shadow-lg rounded-xl px-6 py-4 text-center animate-fadeUp border w-full max-w-md">
          <p className="text-sm text-green-600 font-medium leading-relaxed">
            ✔ Trusted by 100+ users <br />
            ✔ No Brokerage <br />
            ✔ Direct Owner Contact
          </p>
        </div>
      </div> */}

      <section className="mt-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800">
          🔥 Trending Homes
        </h2>



        {/* LOADING CARD */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl px-6 py-5 border flex flex-col items-center gap-3 animate-fadeUp w-full max-w-sm">

              {/* Animated Loader */}
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>

              {/* Text */}
              <p className="text-sm text-gray-700 font-medium text-center">
                Finding the best homes for you...
              </p>

              {/* Sub text */}
              <span className="text-xs text-gray-500">
                This will only take a moment ✨
              </span>

            </div>
          </div>
        )}


        {/* EMPTY CARD */}
        {properties.length === 0 && !loading && (
          <div className="flex justify-center mt-6">
            <div className="bg-white shadow-lg rounded-xl px-6 py-4 text-center animate-fadeUp border w-full max-w-md">
              <p className="text-gray-500 text-sm">
                📭 No properties available yet <br />
                <span className="text-green-600 w-full font-medium">
                  Be the first to post!
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {properties.slice(0, 6).map((home) => {
            let parsed = {};
            try {
              parsed = JSON.parse(home.formJson || "{}");
            } catch { }

            return (
              <div
                key={home.id}
                className="bg-white rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden group"
              >
                <img
                  src={parsed.images?.[0] || "https://via.placeholder.com/300"}
                  className="h-48 w-full object-cover group-hover:scale-105 transition duration-300"
                />

                <div className="p-4">
                  <h3 className="font-bold text-lg">{home.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {parsed.city || "Location"}
                  </p>
                  <p className="text-green-600 font-semibold mt-2">
                    ₹{parsed.rent}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-center mb-5 text-gray-800">
          How RentHome Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="card animate-fadeInDelay">
            <span className="step">1</span>
            <h3>📤 Owner Uploads Property</h3>
            <p>Property owner uploads details & media.</p>
            <strong className="text-green-600">✔ Trusted by 100+ users <br /></strong>
          </div>

          <div className="card animate-fadeInDelay2">
            <span className="step">2</span>
            <h3>📱 QR Code Generated</h3>
            <p>QR code is placed on the TO-LET board.</p>
            <strong className="text-green-600">✔ No Brokerage <br /></strong>
          </div>

          <div className="card animate-fadeInDelay3">
            <span className="step">3</span>
            <h3>🏠 Tenant Scans & Views</h3>
            <p>Tenant scans QR to view full details.</p>
            <strong className="text-green-600">✔ Direct Owner Contact <br /></strong>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-5 max-w-4xl features mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-6">
          What You Can Do on RentHome
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition">            <h3 className="font-semibold">Browse Rentals</h3>
            <p className="text-sm text-gray-600">
              View flats, houses, and rooms available for rent.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">No Brokerage</h3>
            <p className="text-sm text-gray-600">
              Contact owners directly without middlemen.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">Scan QR Code</h3>
            <p className="text-sm text-gray-600">
              Scan QR codes on TO-LET boards to view details instantly.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">Near Me Search</h3>
            <p className="text-sm text-gray-600">
              Find homes close to your current location.
            </p>
          </div>
        </div>
      </section>


      {/* TRUST SECTION */}
      <section className="-mb-10 mt-10 bg-white py-16 rounded-2xl pt-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-1">

          <h2 className="text-2xl font-bold text-center text-purple-600 mb-5">
            Why Owners & Tenants Trust RentHome
          </h2>

          <p className="text-center text-gray-600 text-base md:text-lg max-w-3xl mx-auto mb-6 leading-relaxed">
            RentHome is built to simplify renting by enabling direct owner-tenant
            communication, removing brokerage, and maintaining clear, trustworthy
            property listings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">

            {[
              "0% Brokerage. No middlemen involved. Direct contact between tenant and owner",

              "Only registered owners can post properties. Clear and honest property information.",

              "No hidden charges at any stage. Owners manage listings anytime.",

              "Simple and easy-to-use platform. Mobile-friendly and fast experience.",

              "Privacy-focused design for safety and trust.",


            ].map((point, index) => (
              <div
                key={index}
                className="bg-gray-50 p-3 rounded-xl border hover:shadow-lg transition"
              >
                {/* <div className="text-blue-600 font-bold text-xl mb-2">
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </div> */}
                <p className="text-sm text-gray-700">
                  {point}
                </p>
              </div>
            ))}

          </div>
          <h1 className="text-center text-green-500 mt-5 font-bold">
            Built for trust, not commissions.</h1>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Are you a property owner?{" "}
          <Link to="/addproperty" className="text-blue-600 cursor-pointer font-medium">
            Post your property here
          </Link>
        </p>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
