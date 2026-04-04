import { Section, Input, Select, Upload, SaveButton } from "../components/FormUI";
import { useState } from "react";
import { validateProperty } from "../utils/validation";
import { API_BASE_URL } from "../utils/config";

function Shop({ onSave }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  /* ---------- REQUIRED FIELDS ---------- */
  const requiredFields = [
    "shopName",
    "carpetArea",
    "shopType",
    "businessAllowed",
    "rent",
    "availableFrom",
    "ownerName",
    "mobile",
  ];

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

  try {
    const res = await fetch(`${API_BASE_URL}/api/forms/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        formJson: JSON.stringify(formData),
        propertyType: "Shop",
      }),
    });

    const savedData = await res.json();

    window.location.href = `/generate-qr/${savedData.id}`;

  } catch (err) {
    console.error(err);
    alert("Error saving shop");
  }
};

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* SHOP DETAILS */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-orange-700 font-semibold">🏪 Shop Details</span>} />

        <Input
          id="shopName"
          label="Shop Name *"
          value={formData.shopName || ""}
          onChange={(e) => handleChange("shopName", e.target.value)}
        />
        <div>
          <Input
            id="carpetArea"
            label="Carpet Area (sq ft) *"
            value={formData.carpetArea || ""}
            onChange={(e) => handleChange("carpetArea", e.target.value)}
          />
          {errors.carpetArea && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.carpetArea}
            </p>
          )}
        </div>

        <div>
          <Select
            id="shopType"
            label="Shop Type *"
            options={[
              "Retail Shop",
              "Showroom",
              "Medical Store",
              "Food Outlet",
              "Salon / Spa",
              "Other",
            ]}
            value={formData.shopType || ""}
            onChange={(v) => handleChange("shopType", v.target.value)}
          />
          {errors.shopType && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.shopType}
            </p>
          )}
        </div>

        <Select
          id="roadType"
          label="Facing Road Type"
          options={[
            "Main Road",
            "Inner Road",
            "Commercial Complex",
            "Market Area",
          ]}
          value={formData.roadType || ""}
          onChange={(v) => handleChange("roadType", v.target.value)}
        />

        <Select
          id="shutterType"
          label="Shutter Type"
          options={[
            "Single Shutter",
            "Double Shutter",
            "Glass Front",
          ]}
          value={formData.shutterType || ""}
          onChange={(v) => handleChange("shutterType", v.target.value)}
        />
      </div>

      {/* RENT & PAYMENT */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-amber-700 font-semibold">💰 Rent & Payment Details</span>} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              id="rent"
              label="Monthly Rent (₹) *"
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
            id="deposit"
            label="Security Deposit (₹) *"
            value={formData.deposit || ""}
            onChange={(e) => handleChange("deposit", e.target.value)}
          />
        </div>

        <Select
          id="maintenanceCharges"
          label="Maintenance Charges"
          options={[
            "Included in Rent",
            "Extra (Owner will specify)",
            "Paid to Association",
          ]}
          value={formData.maintenanceCharges || ""}
          onChange={(v) => handleChange("maintenanceCharges", v.target.value)}
        />

        <Input
          id="maintenanceAmount"
          label="Maintenance Amount (₹) (Optional)"
          value={formData.maintenanceAmount || ""}
          onChange={(e) => handleChange("maintenanceAmount", e.target.value)}
        />      </div>

      {/* COMMERCIAL FEATURES */}
      <div className="bg-lime-50 border border-lime-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-lime-700 font-semibold">⚙️ Commercial Features</span>} />

        <Select
          id="powerLoad"
          label="Electric Power Load"
          options={["Single Phase", "Three Phase"]}
          value={formData.powerLoad || ""}
          onChange={(v) => handleChange("powerLoad", v.target.value)}
        />

        <Select
          id="washroom"
          label="Washroom Available?"
          options={["Yes", "No"]}
          value={formData.washroom || ""}
          onChange={(v) => handleChange("washroom", v.target.value)}
        />

        <Select
          id="waterConnection"
          label="Water Connection?"
          options={["Yes", "No"]}
          value={formData.waterConnection || ""}
          onChange={(v) => handleChange("waterConnection", v.target.value)}
        />

        <Select
          id="parking"
          label="Parking Space"
          options={[
            "Customer Parking",
            "Owner Parking",
            "No Parking",
          ]}
          value={formData.parking || ""}
          onChange={(v) => handleChange("parking", v.target.value)}
        />

        <div>
          <Select
            id="businessAllowed"
            label="Business Allowed *"
            options={[
              "Any Business",
              "Retail Only",
              "Food Business",
              "Office Use",
              "Specific (Owner approval)",
            ]}
            value={formData.businessAllowed || ""}
            onChange={(v) => handleChange("businessAllowed", v.target.value)}
          />
          {errors.businessAllowed && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.businessAllowed}
            </p>
          )}
        </div>
      </div>

      {/* AVAILABILITY */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-yellow-700 font-semibold">📅 Availability</span>} />

        <div>
          <Input
            id="availableFrom"
            label="Available From *"
            type="date"
            value={formData.availableFrom || ""}
            onChange={(e) => handleChange("availableFrom", e.target.value)}
          />
          {errors.availableFrom && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.availableFrom}
            </p>
          )}
        </div>

      <Select
        id="leaseDuration"
        label="Lease Duration Preference"
        options={["11 Months", "1–3 Years", "Long Term"]}
        value={formData.leaseDuration || ""}
        onChange={(v) => handleChange("leaseDuration", v.target.value)}
      />
      </div>

      {/* OWNER DETAILS */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-rose-700 font-semibold">👤 Owner Contact Details</span>} />

        <div>
          <Input
            id="ownerName"
            label="Owner Name *"
            value={formData.ownerName || ""}
            onChange={(e) => handleChange("ownerName", e.target.value)}
          />
          {errors.ownerName && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.ownerName}
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

        <Input
          id="alternateContact"
          label="Alternate Contact (Optional)"
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
          id="preferredContact"
          label="Preferred Contact Method"
          options={["Call", "WhatsApp", "Both"]}
          value={formData.preferredContact || ""}
          onChange={(v) => handleChange("preferredContact", v.target.value)}
        />
      </div>

      {/* MEDIA */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
        <Section title={<span className="text-gray-700 font-semibold">📸 Shop Media (Optional)</span>} />
        <Upload label="Shop Images (Optional)" />
        <Upload label="Shop Front / Road View (Optional)" />
      </div>

      {/* SAVE */}
      <div className="sticky bottom-4 bg-white border rounded-xl p-4 shadow-lg">
        <SaveButton onClick={handleSave} />
        <p className="text-xs text-gray-400 text-center mt-2">
          You can edit shop details anytime later
        </p>
      </div>

    </div>
  );
}

export default Shop;
