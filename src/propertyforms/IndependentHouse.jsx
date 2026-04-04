import { Section, Input, Select, Upload, SaveButton } from "../components/FormUI";
import { useState } from "react";
import { validateProperty } from "../utils/validation";
import { API_BASE_URL } from "../utils/config";

function IndependentHouse({ onSave }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const requiredFields = [
    "houseName",
    "ownerName",
    "plotSize",
    "totalFloors",
    "builtUpArea",
    "rent",
    "availableFrom",
    "mobile",
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

const handleSave = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  const validationErrors = validateProperty(formData, requiredFields);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/forms/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        formJson: JSON.stringify(formData),
        propertyType: "IndependentHouse",
      }),
    });

    const savedData = await res.json();

    // ✅ redirect to QR
    window.location.href = `/generate-qr/${savedData.id}`;

  } catch (err) {
    console.error(err);
    alert("Error saving property");
  }
};

  return (
    <div className="space-y-2 animate-fadeIn">


      {/* OWNER DETAILS */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm">
        <Section
          title={
            <span className="text-rose-700 font-semibold">
              👤 Owner Contact Details
            </span>
          }
        />

        <div>
          <Input
            id="ownerName"
            label="Owner Name *"
            value={formData.ownerName || ""}
            onChange={(e) => handleChange("ownerName", e.target.value)}
          />
          {errors.ownerName && <p className="text-red-500 text-sm text-right -mt-3">{errors.ownerName}</p>}
        </div>

        <div>
          <Input
            id="mobile"
            label="Mobile Number *"
            value={formData.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
          />
          {errors.mobile && <p className="text-red-500 text-sm text-right -mt-3">{errors.mobile}</p>}
        </div>

        <Input label="Alternate Contact (Optional)"
          id="alternateContact"
          value={formData.alternateContact || ""}
          onChange={(e) => handleChange("alternateContact", e.target.value)}
        />
        <Input
          id="email"
          label="Email (Optional)"
          value={formData.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <Select
          id="preferredContactMethod"
          label="Preferred Contact Method"
          options={["Call", "WhatsApp", "Both"]}
          value={formData.preferredContactMethod || ""}
          onChange={(e) =>
            handleChange("preferredContactMethod", e.target.value)
          }
        />
      </div>

      {/* HOUSE DETAILS */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm">
        <Section
          title={
            <span className="text-amber-700 font-semibold">
              🏡 Independent House Details
            </span>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          id="houseName"
          label="House / Plot Name *"
          value={formData.houseName || ""}
          onChange={(e) => handleChange("houseName", e.target.value)}
        />
        {errors.houseName && <p className="text-red-500 text-sm text-right -mt-3">{errors.houseName}</p>}
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <Input
              id="plotSize"
              label="Plot Size (sq yards) *"
              value={formData.plotSize || ""}
              onChange={(e) => handleChange("plotSize", e.target.value)}
            />
            {errors.plotSize && <p className="text-red-500 text-sm text-right -mt-3">{errors.plotSize}</p>}
          </div>

          <div>
            <Input
              id="builtUpArea"
              label="Built-up Area (sq ft) *"
              value={formData.builtUpArea || ""}
              onChange={(e) => handleChange("builtUpArea", e.target.value)}
            />
            {errors.builtUpArea && <p className="text-red-500 text-sm text-right -mt-3">{errors.builtUpArea}</p>}
          </div>
        </div>

        <div>
          <Input
            id="totalFloors"
            label="Number of Floors *"
            value={formData.totalFloors || ""}
            onChange={(e) => handleChange("totalFloors", e.target.value)}
          />
          {errors.totalFloors && <p className="text-red-500 text-sm -mt-1">{errors.totalFloors}</p>}
        </div>

        <Select
          id="houseType"
          label="House Type"
          options={["Ground Floor", "Duplex", "Triplex", "Villa-Style"]}
          value={formData.houseType || ""}
          onChange={(e) => handleChange("houseType", e.target.value)}
        />
      </div>

      {/* RENT & PAYMENT */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-sm">
        <Section
          title={
            <span className="text-green-700 font-semibold">
              💰 Rent & Payment Details
            </span>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <Input
              id="rent"
              label="Monthly Rent (₹) *"
              type="number"
              value={formData.rent || ""}
              onChange={(e) => handleChange("rent", e.target.value)}
            />
            {errors.rent && <p className="text-red-500 text-sm text-right -mt-3">{errors.rent}</p>}
          </div>

          <Input
            id="deposit"
            label="Security Deposit (₹) *"
            value={formData.deposit || ""}
            onChange={(e) => handleChange("deposit", e.target.value)}
          />

        </div>

        <Select
          id="maintenanceType"
          label="Maintenance Charges"
          options={[
            "Not Applicable",
            "Included in Rent",
            "Extra (Owner will mention)"
          ]}
          value={formData.maintenanceType || ""}
          onChange={(e) => handleChange("maintenanceType", e.target.value)}
        />


      </div>

      {/* HOUSE FEATURES */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 shadow-sm">
        <Section
          title={
            <span className="text-teal-700 font-semibold">
              ✨ House Features
            </span>
          }
        />

        <Select id="furnishingStatus" value={formData.furnishingStatus || ""}
          label="Furnishing Status *"
          options={[
            "Unfurnished",
            "Semi-Furnished",
            "Fully Furnished",
          ]}
          onChange={(e) => handleChange("furnishingStatus", e.target.value)}

        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Select id="parkingSpace" value={formData.parkingSpace || ""} label="Parking Space" options={["Car", "Bike", "Both", "None"]}
            onChange={(e) => handleChange("parkingSpace", e.target.value)} />

          <Select id="waterSupply" value={formData.waterSupply || ""} label="Water Supply" options={["Municipal", "Borewell", "Both"]}
            onChange={(e) => handleChange("waterSupply", e.target.value)} />
        </div>

        <Select id="powerBackup" value={formData.powerBackup || ""} label="Power Backup" options={["Yes", "No"]}
          onChange={(e) => handleChange("powerBackup", e.target.value)} />

        <Select id="petsAllowed" value={formData.petsAllowed || ""}
          onChange={(e) => handleChange("petsAllowed", e.target.value)}
          label="Pets Allowed?"
          options={["Yes", "No"]}
        />

        <Select id="boundaryWall" value={formData.boundaryWall || ""}
          label="Compound / Boundary Wall" onChange={(e) => handleChange("boundaryWall", e.target.value)}

          options={["Yes", "No"]}
        />
      </div>

      {/* AVAILABILITY */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 shadow-sm">
        <Section
          title={
            <span className="text-yellow-700 font-semibold">
              📅 Availability
            </span>
          }
        />

        <div>
          <Input
            id="availableFrom"
            label="Available From *"
            type="date"
            value={formData.availableFrom || ""}
            onChange={(e) => handleChange("availableFrom", e.target.value)}
          />
          {errors.availableFrom && <p className="text-red-500 text-right -mt-3 text-sm">{errors.availableFrom}</p>}
        </div>

        <Select
          id="preferredTenants"
          label="Preferred Tenants"
          options={["Family", "Bachelors", "Anyone"]}
          value={formData.preferredTenants || ""}
          onChange={(e) =>
            handleChange("preferredTenants", e.target.value)
          }
        />
      </div>

      {/* MEDIA */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
        <Section
          title={
            <span className="text-gray-700 font-semibold">
              📸 Property Media (Optional)
            </span>
          }
        />

        <Upload id="houseImages" label="House Images (Optional)" />
        <Upload id="houseVideo" label="House Video / Walkthrough (Optional)" />
      </div>

      {/* SAVE */}
      <div className="sticky bottom-4 bg-white border rounded-xl p-4 shadow-lg">
        <SaveButton onClick={handleSave} />
        <p className="text-xs text-gray-400 text-center mt-2">
          You can edit house details anytime later
        </p>
      </div>

    </div>
  );
}

export default IndependentHouse;
