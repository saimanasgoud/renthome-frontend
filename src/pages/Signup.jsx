import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };
const handleSignup = async (e) => {
  e.preventDefault();

  if (!form.name || !form.mobile || !form.email || !form.password) {
    setError("All fields are required");
    return;
  }

  if (!validatePassword(form.password)) {
    setError("Password must be 8+ chars, include number & special char");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const text = await res.text(); // ✅ get response first

    if (!res.ok) {
      throw new Error(text); // ✅ show backend error
    }

    // ✅ success
    setSuccess("Signup successful! Redirecting to login...");
    setError("");

    setTimeout(() => navigate("/login"), 1000);

  } catch (err) {
    setError(err.message); // ✅ real error shown
  }
};

  return (
    <div className="min-h-screen mt-20 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center text-purple-600">
          Get Started
        </h1>

        <p className="text-sm text-gray-500 text-center mt-2">
          Create an account to post your rental property
        </p>

        {/* FORM */}
        <form onSubmit={handleSignup} className="mt-6 space-y-4">

          {/* NAME */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Displayed on Property"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* MOBILE */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Email ID
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Should be 8 character's strong "
              value={form.password}
              onChange={(e) => {
                handleChange(e);

                if (e.target.value && !validatePassword(e.target.value)) {
                  setError("Weak password (min 8 chars, number & special char)");
                } else {
                  setError("");
                }
              }}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ERROR / SUCCESS */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          {/* SIGNUP BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>

        {/* PRIVACY MESSAGE */}
        <div className="mt-5 bg-green-50 p-3 rounded-xl text-sm text-gray-700">
          🔒 <b>Your details are 100% safe.</b><br />
          We use your mobile number and email only for verification and communication.
          Your data is never shared with anyone.
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have account?{" "}
          <span
            className="text-green-500 border border-yellow-500 p-1 pb-2 pl-2 pr-2 rounded-xl font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </div>

      </div>
    </div>
  );
}
