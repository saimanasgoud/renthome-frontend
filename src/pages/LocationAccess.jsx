import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LocationAccess() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pincode: "",
    city: "",
    state: "",
    area: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    if (!formData.pincode) {
      alert("Enter pincode");
      return;
    }

    // 🔥 THIS IS IMPORTANT
   navigate("/properties", {
  state: {
    pincode: formData.pincode,
    city: formData.city,
    state: formData.state
  }
});
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Search Location 📍</h1>

      <input
        name="pincode"
        placeholder="Pincode"
        onChange={handleChange}
        className="border p-2 m-2"
      />

      <input
        name="city"
        placeholder="City"
        onChange={handleChange}
        className="border p-2 m-2"
      />

      <input
        name="state"
        placeholder="State"
        onChange={handleChange}
        className="border p-2 m-2"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 mt-3"
      >
        Search
      </button>
    </div>
  );
}