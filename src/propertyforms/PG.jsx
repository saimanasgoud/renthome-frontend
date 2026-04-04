import { Section, Input, Select, Upload, SaveButton } from "../components/FormUI";
import { useState } from "react";
import { validateProperty } from "../utils/validation";
import { API_BASE_URL } from "../utils/config";

function PG({ onSave }) {
  const [facilities, setFacilities] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  /* ---------- REQUIRED FIELDS ---------- */
  const requiredFields = [
    "pgName",
    "pgType",
    "occupancyType",
    "rent",
    "contactName",
    "mobile",
  ];

  const formatFoodTimings = (timings) => {
  if (!timings || typeof timings !== "object") return null;

  return Object.entries(timings)
    .map(
      ([meal, time]) =>
        `${meal}: ${time.from} - ${time.to}`
    )
    .join(" | ");
};


  /* ---------- CHANGE HANDLER ---------- */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------- SAVE ---------- */
 const handleSave = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  const validationErrors = validateProperty(formData, requiredFields);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) return;

  const formattedFoodTimings = formatFoodTimings(formData.foodTimings);

  const dataToSave = {
    ...formData,
    facilities,
    foodTimings: formattedFoodTimings
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/forms/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        formJson: JSON.stringify(dataToSave),
        propertyType: "PG",
      }),
    });

    const savedData = await res.json();

    window.location.href = `/generate-qr/${savedData.id}`;

  } catch (err) {
    console.error(err);
    alert("Error saving PG");
  }
};

  /* ---------- FACILITIES ---------- */
  const facilityOptions = [
    "Wi-Fi",
    "Food Included",
    "Washing Machine",
    "Housekeeping",
    "Power Backup",
    "RO Water",
    "AC Rooms",
    "TV",
  ];

  const toggleFacility = (item) => {
    setFacilities((prev) =>
      prev.includes(item)
        ? prev.filter((f) => f !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-xl mx-auto">

      {/* PG IDENTITY */}
      <div className="bg-pink-50 border border-pink-100 rounded-3xl p-6 shadow-sm">
        <Section title={<span className="text-pink-700 font-semibold">🏠 PG / Hostel Information</span>} />

        <div>
          <Input
            id="pgName"
            label="PG / Hostel Name *"
            value={formData.pgName || ""}
            onChange={(e) => handleChange("pgName", e.target.value)}
          />
          {errors.pgName && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.pgName}
            </p>
          )}
        </div>

        <div>
          <Select
            id="pgType"
            label="PG Type *"
            options={["Male PG", "Female PG", "Co-Living"]}
            value={formData.pgType || ""}
            onChange={(e) => handleChange("pgType", e.target.value)}
          />
          {errors.pgType && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.pgType}
            </p>
          )}
        </div>

        <div>
          <Select
            id="occupancyType"
            label="Occupancy Type *"
            options={[
              "Single Sharing",
              "Double Sharing",
              "Triple Sharing",
              "Multiple Sharing",
            ]}
            value={formData.occupancyType || ""}
            onChange={(e) => handleChange("occupancyType", e.target.value)}
          />
          {errors.occupancyType && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.occupancyType}
            </p>
          )}
        </div>
      </div>

      {/* PRICING */}
      <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 shadow-sm">
        <Section title={<span className="text-rose-700 font-semibold">💰 Pricing (Per Bed)</span>} />

        <div>
          <Input
            id="rent"
            label="Monthly Rent Per Bed (₹) *"
            type="number"
            value={formData.rent || ""}
            onChange={(e) => handleChange("rent", e.target.value)}
          />
          {errors.rent && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.rent}
            </p>
          )}
        </div>

        <Input
          label="Security Deposit (₹) *"
          value={formData.deposit || ""}
          onChange={(e) => handleChange("deposit", e.target.value)}
        />
        <Select
          label="Electricity Charges"
          options={["Included", "Extra (As per usage)"]}
          onChange={(e) => handleChange("electricityCharges", e.target.value)}
        />
      </div>

      {/* FOOD DETAILS */}
      <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 shadow-sm">
        <Section title={<span className="text-orange-700 font-semibold">🍽️ Food Details</span>} />

        <Select label="Food Provided?" options={["Yes", "No"]}
          onChange={(e) => handleChange("foodProvided", e.target.value)} />

        <Select label="Food Type" options={["Veg", "Non-Veg", "Both"]}
          onChange={(e) => handleChange("foodType", e.target.value)} />

        {/* <Input
          label="Food Timings (Optional)"
          value={formData.foodTimings || ""}
          onChange={(e) => handleChange("foodTimings", e.target.value)}
        /> */}

        <div className="mt-4">
  <label className="block text-sm font-medium mb-3">
    Food Timings (Optional)
  </label>

  <div className="space-y-3">

    {["Morning", "Afternoon", "Dinner"].map((meal) => {
      const timings = formData.foodTimings || {};
      const isChecked = timings[meal];

      return (
        <div key={meal} className="bg-white border rounded-xl p-3">
          {/* Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!isChecked}
              onChange={() => {
                const updated = { ...timings };
                if (updated[meal]) {
                  delete updated[meal];
                } else {
                  updated[meal] = { from: "", to: "" };
                }
                handleChange("foodTimings", updated);
              }}
            />
            <span className="font-medium">{meal}</span>
          </label>

          {/* Time inputs (only if checked) */}
          {isChecked && (
            <div className="flex gap-3 mt-3">
              <input
                type="time"
                value={timings[meal].from}
                onChange={(e) =>
                  handleChange("foodTimings", {
                    ...timings,
                    [meal]: { ...timings[meal], from: e.target.value },
                  })
                }
                className="w-1/2 border rounded-lg px-3 py-2"
              />

              <input
                type="time"
                value={timings[meal].to}
                onChange={(e) =>
                  handleChange("foodTimings", {
                    ...timings,
                    [meal]: { ...timings[meal], to: e.target.value },
                  })
                }
                className="w-1/2 border rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>
      );
    })}

  </div>
</div>

      </div>

      {/* FACILITIES */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 shadow-sm">
        <Section title={<span className="text-indigo-700 font-semibold">🛏️ Facilities Available</span>} />

        <div className="grid grid-cols-2 gap-3 mt-3">
          {facilityOptions.map((item) => (
            <label
              key={item}
              className={`px-3 py-2 rounded-xl border cursor-pointer text-sm text-center
                ${facilities.includes(item)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-indigo-50"
                }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={facilities.includes(item)}
                onChange={() => toggleFacility(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* RULES */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-6 shadow-sm">
        <Section title={<span className="text-yellow-700 font-semibold">📜 House Rules</span>} />
        <Select
          label="Curfew Time"
          options={["No Curfew", "10 PM", "11 PM", "12 PM"]}
          value={formData.curfew || ""}
          onChange={(e) => handleChange("curfew", e.target.value)}
        />

        <Select
          label="Guests Allowed?"
          options={["Yes", "No"]}
          value={formData.guestsAllowed || ""}
          onChange={(e) => handleChange("guestsAllowed", e.target.value)}
        />

        <Select
          label="Smoking / Alcohol Allowed?"
          options={["Yes", "No"]}
          value={formData.smokingAllowed || ""}
          onChange={(e) => handleChange("smokingAllowed", e.target.value)}
        />

        <Select
          label="Preferred Contact Method"
          options={["Call", "WhatsApp", "Both"]}
           value={formData.preferredContact || ""}
          onChange={(e) => handleChange("preferredContact", e.target.value)}
        />
      </div>

      {/* OWNER DETAILS */}
      <div className="bg-teal-50 border border-teal-100 rounded-3xl p-6 shadow-sm">
        <Section title={<span className="text-teal-700 font-semibold">👤 Owner / Caretaker Details</span>} />

        <div>
          <Input
            id="contactName"
            label="Contact Person Name *"
            value={formData.contactName || ""}
            onChange={(e) => handleChange("contactName", e.target.value)}
          />
          {errors.contactName && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.contactName}
            </p>
          )}
        </div>

        <div>
          <Input
            id="mobile"
            label="Mobile Number *"
            value={formData.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
          />
          {errors.mobile && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.mobile}
            </p>
          )}
        </div>
      </div>

      {/* MEDIA */}
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm">
        <Section title={<span className="text-gray-700 font-semibold">📸 PG Media (Optional)</span>} />
    
    <Upload
  label="PG Room Images (Optional)"
  onChange={(e) => handleChange("roomImages", e.target.files)}
/>

<Upload
  label="PG Common Area Images (Optional)"
  onChange={(e) => handleChange("commonAreaImages", e.target.files)}
/>

    </div>

      {/* SAVE */}
      <div className="sticky bottom-4 bg-white border rounded-2xl p-4 shadow-lg">
        <SaveButton onClick={handleSave} />
        <p className="text-xs text-gray-400 text-center mt-2">
          PG details can be updated anytime
        </p>
      </div>

    </div>
  );
}

export default PG;
