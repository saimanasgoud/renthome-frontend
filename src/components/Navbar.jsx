import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isOwnerLoggedIn, logout } from "../utils/auth";
// import { isAdmin } from "../utils/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [showGuide, setShowGuide] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const lastProperty = localStorage.getItem("lastViewedProperty");
  const [loggingOut, setLoggingOut] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));

 useEffect(() => {
  const updateAuth = () => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  };

  updateAuth();

  window.addEventListener("authChange", updateAuth);

  return () => {
    window.removeEventListener("authChange", updateAuth);
  };
}, []);

  // Disable body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  const handleLogout = () => {
    setLoggingOut(true);

    // close menu instantly
    setOpen(false);

    logout();
    window.dispatchEvent(new Event("authChange"));

    setTimeout(() => {
      setLoggingOut(false);
      navigate("/");
    }, 300);
  };

  return (
    <>

      {loggingOut && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-semibold">Logging out...</span>
          </div>
        </div>
      )}
      {/* TOP NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-yellow-200 text-blue-500">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">RentHome</h1>
          <button onClick={() => setOpen(true)} className="text-2xl">
            ☰
          </button>
        </div>
      </nav>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white text-white z-50
        transform transition-transform duration-500
        overflow-y-auto
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-700 sticky top-0 bg-violet-400 z-10">
          <h2 className="text-lg font-semibold">
            {role === "ADMIN"
              ? "Admin Portal 👑"
              : role === "OWNER"
                ? "Owner Portal"
                : "User Portal"}
          </h2>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="p-4 flex flex-col gap-4 max-h-[calc(100vh-64px)]">
          {/* COMMON */}
          <Link
            to={
              role === "USER"
                ? "/user/dashboard"
                : role === "ADMIN"
                  ? "/admin"
                  : "/dashboard"
            }

            onClick={() => setOpen(false)}
            className="w-full px-4 py-3 text-black rounded-lg text-center font-bold hover:bg-green-200 transition"
          >
            Dashboard
          </Link>

          {/* 👤 USER VIEW */}
          {!localStorage.getItem("token") && (
            <>

              <Link
                to="/user/nearme"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 text-black rounded-lg text-center font-bold hover:bg-green-200 transition"
              >
                Near Me
              </Link>

              <Link
                to="/user/smartchoice"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 text-black rounded-lg text-center font-bold hover:bg-green-200 transition flex items-center justify-center gap-2"
              >
                Smart Choice
              </Link>

              {lastProperty && lastProperty !== "null" && (
                <Link
                  to={`/property/${lastProperty}`}
                  onClick={() => setOpen(false)}
                  className="w-full px-4 py-3 text-black rounded-lg text-center font-bold hover:bg-green-200 transition flex items-center justify-center gap-2"
                >
                  Property Details
                </Link>
              )}

              {/*               
              {!lastProperty && (
                <p className="text-sm text-white text-center opacity-80">
                  Scan a property QR to view details
                </p>
              )} */}

              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 text-blue-500 rounded-lg text-center font-bold hover:bg-green-200 transition"
              >
                Login / SignUp
              </Link>

              {/* 
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
            className="w-full px-4 py-3 text-blue-500 rounded-lg text-center font-bold hover:bg-green-200 transition"
              >
                Signup
              </Link> */}
              {/* INFO + SAFETY SECTIONS */}
              <div className="pt-4 space-y-4">

                {/* HOW IT WORKS (GUIDE) */}
                <div>
                  <button
                    onClick={() => setShowGuide(!showGuide)}
                    className="w-full mb-2 px-4 py-3 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition flex items-center justify-between"
                  >
                    <span>📘 How RentHome Works</span>
                    <span className="text-lg">{showGuide ? "−" : "+"}</span>
                  </button>

                  {showGuide && (
                    <div className="px-4 py-3 rounded-lg bg-purple-50 text-sm leading-relaxed border border-purple-200">
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        <li>List your property with rent, location, and contact details.</li>
                        <li>Generate a QR code and place it on your To-Let board.</li>
                        <li>Tenants scan the QR to view details and contact you directly.</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* SAFETY & SMART TIPS */}
                <div>
                  <button
                    onClick={() => setShowSafety(!showSafety)}
                    className="w-full mb-2 px-4 py-3 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition flex items-center justify-between"
                  >
                    <span>🛡️ Safety & Smart Renting Tips</span>
                    <span className="text-lg">{showSafety ? "−" : "+"}</span>
                  </button>

                  {showSafety && (
                    <div className="px-4 py-3 mb-10 rounded-lg bg-green-50 text-sm leading-relaxed border border-green-200">
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        <li>🔐 Never pay advance before visiting the property.</li>
                        <li>👀 Always verify the location and facilities in person.</li>
                        <li>📸 Check photos and details carefully before deciding.</li>
                        <li>🤝 Meet the owner directly and confirm all terms.</li>
                        <li>📄 Read rules, rent, and deposit details clearly.</li>
                        <li>🚫 Avoid deals that sound too good to be true.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* 🏠 OWNER VIEW */}
          {role === "OWNER" && (<>
            <Link
              to="/owner/addproperty"
              onClick={() => setOpen(false)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 text-center font-bold hover:bg-yellow-200 transition"
            >
              Post Property
            </Link>

            <Link
              to="/owner/myproperties"
              onClick={() => setOpen(false)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 text-center font-bold hover:bg-yellow-200 transition"
            >
              My Properties
            </Link>

            <Link
              to="/owner/generateqr"
              onClick={() => setOpen(false)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 text-center font-bold hover:bg-yellow-200 transition"
            >
              Generate QR
            </Link>

            <Link
              to="/owner/analytics"
              onClick={() => setOpen(false)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 text-center font-bold hover:bg-yellow-200 transition"
            >
              Analytics
            </Link>

            <button
              onClick={handleLogout}
              className="ml-10 mr-10 py-3 rounded-lg bg-red-500 hover:bg-red-500 transition"
            >
              Logout
            </button>
          </>


          )}
          {role === "ADMIN" && (
            <>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 rounded-lg text-red-600 text-center font-bold hover:bg-red-100 transition"
              >
                Admin Dashboard 👑
              </Link>

              <Link
                to="/admin/users"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 rounded-lg text-gray-900 text-center font-bold hover:bg-red-100 transition"
              >
                👥 Manage Users
              </Link>

              <Link
                to="/admin/properties"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 rounded-lg text-gray-900 text-center font-bold hover:bg-red-100 transition"
              >
                🏠 All Properties
              </Link>

              <Link
                to="/admin/analytics"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 rounded-lg text-gray-900 text-center font-bold hover:bg-red-100 transition"
              >
                📊 Admin Analytics
              </Link>

              <button
                onClick={handleLogout}
                className="ml-10 mr-10 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div >
    </>
  );
}
