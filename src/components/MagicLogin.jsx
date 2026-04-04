import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";

export default function MagicLogin() {

    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {

        const token = new URLSearchParams(window.location.search).get("token");

        if (!token) return;

        fetch(`${API_BASE_URL}/api/auth/magic-login?token=${token}`, {
            method: "POST"
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Invalid or expired link");
                }
                return res.json();
            })
            .then(data => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("ownerId", data.ownerId);
                localStorage.setItem("role", data.role);

                window.dispatchEvent(new Event("authChange"));

                navigate("/");
            })
            .catch((err) => {
                setError("❌ Invalid or expired link. Please try again.");
            });

    }, [navigate]);

    return (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">

      {!error ? (
        <>
          <h1 className="text-2xl font-bold text-green-600">
            ✅ Logging you in...
          </h1>
          <p className="text-gray-500 mt-2">
            Please wait while we verify your link
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-red-500">
            ❌ Login Failed
          </h1>
          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go to Login
          </button>
        </>
      )}

    </div>
  </div>
);
}