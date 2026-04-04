import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";

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

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  /* ================= PASSWORD LOGIN ================= */


  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    if (!mobile || !password) {
      setError("Please enter mobile and password");
      return;
    }

    console.log("Sending:", mobile, password);

    setLoading(true);
    setLoadingText("Logging in...");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, password }),
      });

      if (!res.ok) {
        setError("Invalid mobile or password");
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

       if (data.role === "ADMIN") {
  navigate("/admin");
} else if (data.role === "OWNER") {
  navigate("/owner/dashboard");
} else {
  navigate("/user/dashboard");
}

      }, 800);

    } catch (err) {
      setError("Login failed");
      setLoading(false);
    }
  };

  /* ================= EMAIL OTP LOGIN (DEMO) ================= */
  const sendMagicLink = async () => {

    if (!navigator.onLine) {
      setErrorMsg("❌ No internet connection");
      return;
    }

    if (!email) {
      setErrorMsg("Please enter email");
      return;
    }

    if (resendCount >= 3) {
      setErrorMsg("❌ Maximum resend limit reached. Try later.");
      return;
    }

    setLinkLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-magic-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setSuccessMsg("✅ Magic link sent! Check your email");
      setTimer(30);
      setResendCount((prev) => prev + 1);

    } catch (err) {
      setErrorMsg("❌ Failed to send link. Try Mobile + Password login");
    } finally {
      setLinkLoading(false);
    }
  };

  return (
    <>
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
                setError("");
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
                <label className="block text-sm font-medium text-gray-700">
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500"
                />
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
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={sendMagicLink}
                disabled={timer > 0}
                className="w-full py-3 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2"
              >
                {linkLoading ? (
                  "Sending..."
                ) : (
                  "Send Magic Link"
                )}
              </button>

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

              {errorMsg && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {errorMsg}
                </p>
              )}

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
