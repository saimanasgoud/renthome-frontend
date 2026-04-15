import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";

const fetchWithTimeout = (url, options, timeout = 6000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), timeout)
    ),
  ]);
};

export default function Login() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("password"); // password | otp
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCount, setResendCount] = useState(0);
  const [loadingText, setLoadingText] = useState("Logging in...");
  const [dots, setDots] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (linkLoading) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length === 3 ? "" : prev + "."));
      }, 400);

      return () => clearInterval(interval);
    } else {
      setDots("");
    }
  }, [linkLoading]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  /* ================= PASSWORD LOGIN ================= */


  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    if (!mobile || !password) {
      setError("⚠️ Please enter mobile and password");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      setError("📱 Mobile number must be 10 digits");
      return;
    }

    if (!navigator.onLine) {
      setError("🌐 No internet connection");
      return;
    }

    setLoading(true);
    setLoadingText("Connecting to server...");

    // const failSafe = setTimeout(() => {
    //   setLoading(false);
    //   setError("❌ Request taking too long");
    // }, 3000);

    try {

      setLoadingText("🌐 Connecting to server...");
      setTimeout(() => setLoadingText("🔐 Verifying credentials..."), 800);
      setTimeout(() => setLoadingText("🚀 Logging you in..."), 1500);

      const res = await fetchWithTimeout(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile, password }),
        },
        10000   // ✅ 10 sec max
      );

      // const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ mobile, password }),
      // });

      if (!res.ok) {
        const text = await res.text();

        switch (text) {
          case "MOBILE_NOT_FOUND":
            setError("❌ Mobile not registered");
            break;

          case "WRONG_PASSWORD":
            setError("🔒 Incorrect password");
            break;

          case "ACCOUNT_BLOCKED":
            setError("⚠️ Account blocked. Contact support");
            break;

          case "TOO_MANY_ATTEMPTS":
            setError("⚠️ Too many attempts. Try later");
            break;

          default:
            setError("❌ Unable to login. Please try again");
        }

        setLoading(false);
        return;
      }

      setLoadingText("Authenticating...");

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("ownerId", data.ownerId);
      localStorage.setItem("role", data.role);

      window.dispatchEvent(new Event("authChange"));

      setLoadingText("Redirecting...");

      setTimeout(() => {
        setLoading(false);
        // clearTimeout(failSafe);

        const role = data.role?.toUpperCase();

        localStorage.setItem("role", role);

        if (role === "ADMIN") {
          navigate("/admin");
        } else if (role === "OWNER") {
          navigate("/owner/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }, 800);

    }
    catch (err) {
      console.error(err);

      if (!navigator.onLine) {
        setError("🌐 No internet connection");
      }
      else if (err.message === "TIMEOUT") {
        setError("⏳ Server is waking up... please wait");
      }
      else if (err.message.includes("Failed to fetch")) {
        setError("🔥 Server is down. Try again later");
      }
      else {
        setError("❌ Something went wrong");
      }

      setLoading(false);
    }

  };

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

  /* ================= EMAIL OTP LOGIN (DEMO) ================= */
  const sendMagicLink = async () => {

    if (!navigator.onLine) {
      setErrorMsg("❌ No internet connection");
      return;
    }

    if (!email) {
      setErrorMsg("⚠️ Please enter email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorMsg("❌ Please enter valid email");
      setShake(true);

      setTimeout(() => setShake(false), 400);
      return;
    }

    setLinkLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {

      console.log("Sending request to:", `${API_BASE_URL}/api/auth/send-magic-link`);

      const res = await fetchWithTimeout(
        `${API_BASE_URL}/api/auth/send-magic-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
        15000   // ✅ 3 sec max
      );


      // const res = await fetch(`${API_BASE_URL}/api/auth/send-magic-link`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email }),
      // });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "EMAIL_NOT_FOUND") {
          throw new Error("❌ Email not registered");
        } else {
          throw new Error(data.message || "Server error");
        }
      }

      if (!data.success) {
        throw new Error(data.message || "Operation failed");
      }

      setSuccessMsg(`✅ Magic link sent to ${email}`);
      setTimer(30);

    } 
    catch (err) {
  console.error("FULL ERROR:", err);

  if (!navigator.onLine) {
    setErrorMsg("🌐 No internet connection");
  } 
  else if (err.message === "TIMEOUT") {
    setErrorMsg("⏳ Server is waking up... please wait");
  } 
  else if (err.message.includes("Failed to fetch")) {
    setErrorMsg("🔥 Backend server is not running");
  } 
  else if (err.message.includes("NetworkError")) {
    setErrorMsg("🌐 Network error occurred");
  } 
  else {
    setErrorMsg("❌ Unable to send magic link. Try again");
  }

    } finally {
      setLinkLoading(false); // ✅ ALWAYS RESET BUTTON
    }
  };



  return (
    <>

      <style>
        {`
      @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
      }
      `}
      </style>

      {linkLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-xl flex items-center gap-3 shadow-lg">
            <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-semibold text-gray-700">
              Sending magic link...
            </span>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-xl flex items-center gap-3 shadow-lg">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-semibold text-gray-700">
              {loadingText}
            </span>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

          <h1 className="text-2xl font-bold text-center text-green-600">
            Login
          </h1>

          <p className="text-sm text-gray-500 text-center mt-2">
            Login to manage your rental properties
          </p>

          {/* ===== LOGIN TYPE TOGGLE ===== */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => {
                setLoginType("password");
                setError("");
                setEmail("");
              }}
              className={`px-3 py-2 rounded-xl font-semibold ${loginType === "password"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Mobile & Password
            </button>

            <button
              onClick={() => {
                setLoginType("otp");
                setError("");        // clear mobile error
                setErrorMsg("");     // clear email error
                setMobile("");
                setPassword("");
              }}
              className={`px-4 py-2 rounded-xl font-semibold ${loginType === "otp"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
                }`}
            >
              Email Login
            </button>
          </div>

          {/* ===== PASSWORD LOGIN ===== */}
          {loginType === "password" && (
            <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-2/2 text-sm rounded-lg border border-yellow-400 px-3 py-1 text-black bg-yellow-50 font-semibold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold"
              >
                {loading ? "Please wait..." : "Sign In"}
              </button>

              <p className="text-sm text-gray-500 text-center">
                Forgot password? Try Email login
              </p>
            </form>
          )}

          {/* ===== EMAIL OTP LOGIN ===== */}
          {loginType === "otp" && (
            <div className="mt-6 space-y-4">

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Registered Email
                </label>
                <div
                  className="relative"
                  style={{
                    animation: shake ? "shake 0.3s" : "none"
                  }}
                >
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={sendMagicLink}
                disabled={linkLoading || timer > 0}
                className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300
                ${linkLoading ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"}
               `}
              >
                Send Magic Link
              </button>

{errorMsg && (
  <div className="text-center">
    <p className="text-red-500">{errorMsg}</p>
    <button
      onClick={sendMagicLink}
      className="text-blue-600 underline text-sm mt-1"
    >
      Retry
    </button>
  </div>
)}

              {timer === 0 && resendCount > 0 && resendCount < 3 && (
                <p className="text-sm text-green-600 text-center mt-2">
                  🔄 You can resend the magic link
                </p>
              )}

              {timer > 0 && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  ⏳ Resend the magic link in <span className="font-bold">{timer}s</span>
                </p>
              )}


              {successMsg && (
                <p className="text-green-600 text-sm mt-2 text-center">
                  {successMsg}
                </p>
              )}

              {/* {errorMsg && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {errorMsg}
                </p>
              )} */}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <p className="text-xs text-gray-400 text-center">
                Click the link sent to your email to login
              </p>

            </div>
          )}
          {/* ===== SIGNUP LINK ===== */}
          <div className="mt-6 text-center text-sm text-gray-600">
            New owner?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-green-600 font-semibold cursor-pointer hover:underline"
            >
              Create account
            </span>
          </div>

        </div>
      </div>
    </>
  );
}
