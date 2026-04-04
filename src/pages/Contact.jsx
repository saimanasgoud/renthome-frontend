import { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [form, setForm] = useState({
    issue: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been submitted.");
    setForm({ issue: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">

        <h1 className="text-3xl font-bold text-violet-500 mb-4 text-center">
          Contact Support
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Need help? Select your issue below and our support team will assist you.
        </p>

        {/* SUPPORT OPTIONS
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            "Account or Login Issue",
            "Property Listing Issue",
            "QR Code Not Working",
            "Report Fake Listing",
            "General Question",
            "Other",
          ].map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 text-sm text-gray-700 bg-gray-50"
            >
              {item}
            </div>
          ))}
        </div> */}

        {/* CONTACT FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Issue Type
            </label>
            <select
              name="issue"
              value={form.issue}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select an issue --</option>
              <option>Account or Login Issue</option>
              <option>Property Listing Issue</option>
              <option>QR Code Not Working</option>
              <option>Report Fake Listing</option>
              <option>General Question</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe Your Issue
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Please describe your issue clearly..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Submit Request
          </button>
        </form>

        {/* FOOTER INFO */}
        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Support Email: support@renthome.com</p>
          <p className="mt-1">
            Please check our{" "}
            <Link to="/faq" className="text-blue-600 font-bold hover:underline">
              FAQ's
            </Link>{" "}
            before contacting support.
          </p>
          <p className="mt-1">
            Our team usually responds within 24–48 hours.
          </p>
        </div>

      </div>
    </div>
  );
}
