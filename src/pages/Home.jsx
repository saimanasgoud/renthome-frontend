import { useEffect, useState } from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useLocation } from "react-router-dom";
export default function Home() {

  const [loaded, setLoaded] = useState(false);
  const role = localStorage.getItem("role") || "";
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 300);

  return () => clearTimeout(timer);
}, [search]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
  }, []);

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/forms/all`)
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(err => console.error(err));
  }, []);

  const location = useLocation();

useEffect(() => {
  if (location.state?.pincode) {
    setSearch(location.state.pincode);
  }
}, []);

const filteredHomes = properties.filter((home) => {
  let parsed = {};

  try {
    parsed = JSON.parse(home.formJson || "{}");
  } catch {
    parsed = {};
  }

  const searchText = debouncedSearch.toLowerCase();

  // 🔥 STRICT LOCATION FILTER
const matchesLocation =
  parsed.pincode?.includes(searchText) &&
  parsed.city?.toLowerCase().includes(searchText);
    parsed.selectedArea?.toLowerCase().includes(searchText);

  return matchesLocation;
});

  const highlight = (text) => {
    if (!text) return "";   // ✅ FIX
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, `<mark>$1</mark>`);
  };

  return (
    // <div className="min-h-screen mt-10 bg-gradient-to-b from-blue-50 to-white px-4 flex flex-col">

    <div className={`min-h-screen mt-10 bg-gradient-to-b from-blue-50 to-white px-4 flex flex-col transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>

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
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Search Results for "<span className="text-yellow-600">{search}</span>" are Total <strong className="text-green-600"> {filteredHomes.length} </strong> Homes
          </h2>

          {filteredHomes.length === 0 ? (
            <p className="text-gray-500">No matching homes found.</p>
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
                          __html: highlight(home.title),
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
            to="/nearme"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 hover:scale-105 transition duration-300"

          >Find Homes Near Me
          </Link>

          <Link
            to="/addproperty"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            Post / add Property
          </Link>
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
            <h3>Owner Uploads Home</h3>
            <p>Property owner uploads details & media.</p>
          </div>

          <div className="card animate-fadeInDelay2">
            <span className="step">2</span>
            <h3>QR Code Generated</h3>
            <p>QR code is placed on the TO-LET board.</p>
          </div>

          <div className="card animate-fadeInDelay3">
            <span className="step">3</span>
            <h3>Tenant Scans & Views</h3>
            <p>Tenant scans QR to view full details.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-5 max-w-4xl features mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-6">
          What You Can Do on RentHome
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">Browse Rentals</h3>
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
