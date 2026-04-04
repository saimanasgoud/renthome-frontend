import { Section, Input, Select, Upload, SaveButton } from "../components/FormUI";
import { useState } from "react";
import { validateProperty } from "../utils/validation";
import { API_BASE_URL } from "../utils/config";

function Office({ onSave }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  /* ---------- REQUIRED FIELDS ---------- */
  const requiredFields = [
    "carpetArea",
    "officeType",
    "furnishingStatus",
    "idealFor",
    "rent",
    "availableFrom",
    "contactName",
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
        propertyType: "Office",
      }),
    });

    const savedData = await res.json();

    window.location.href = `/generate-qr/${savedData.id}`;

  } catch (err) {
    console.error(err);
    alert("Error saving office");
  }
};

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* OFFICE DETAILS */}
      <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-sky-700 font-semibold">🏢 Office Space Details</span>} />

<Input
  id="officeName"
  label="Office Name / Company Name (Optional)"
  value={formData.officeName || ""}
  onChange={(e) => handleChange("officeName", e.target.value)}
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
            id="officeType"
            label="Office Type *"
            options={[
              "IT / Corporate Office",
              "Co-working Space",
              "Consulting Office",
              "CA / Advocate Office",
              "Startup Office",
              "Other",
            ]}
            value={formData.officeType || ""}
            onChange={(v) => handleChange("officeType", v.target.value)}
          />
          {errors.officeType && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.officeType}
            </p>
          )}
        </div>

        <Select
          id="locatedIn"
          label="Located In"
          options={[
            "Standalone Building",
            "Commercial Complex",
            "IT Park",
            "Business Center",
          ]}
          value={formData.locatedIn || ""}
          onChange={(v) => handleChange("locatedIn", v.target.value)}
        />
      </div>

      {/* RENT & LEASE */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-emerald-700 font-semibold">💰 Rent & Lease Details</span>} />

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
            "Extra (Owner will mention)",
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
/>
        <Select
  id="leaseDuration"
  label="Preferred Lease Duration"
  options={["11 Months", "1–3 Years", "Long Term"]}
  value={formData.leaseDuration || ""}
  onChange={(v) => handleChange("leaseDuration", v.target.value)}
/>
      </div>

      {/* OFFICE FEATURES */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-indigo-700 font-semibold">⚙️ Office Features</span>} />

        <div>
          <Select
            id="furnishingStatus"
            label="Furnishing Status *"
            options={["Unfurnished", "Semi-Furnished", "Fully Furnished"]}
            value={formData.furnishingStatus || ""}
            onChange={(v) => handleChange("furnishingStatus", v.target.value)}
          />
          {errors.furnishingStatus && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.furnishingStatus}
            </p>
          )}
        </div>

        <Select
  id="cabins"
  label="Cabins / Workstations"
  options={["Open Workspace", "Cabins Available", "Both", "Customizable"]}
  value={formData.cabins || ""}
  onChange={(v) => handleChange("cabins", v.target.value)}
/>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="powerBackup"
            label="Power Backup"
            options={["Yes", "No"]}
            value={formData.powerBackup || ""}
            onChange={(v) => handleChange("powerBackup", v.target.value)}
          />
          <Select
            id="internetReady"
            label="Internet Ready?"
            options={["Yes", "No"]}
            value={formData.internetReady || ""}
            onChange={(v) => handleChange("internetReady", v.target.value)}
          />
        </div>

       <Select
  id="washroom"
  label="Washroom Facility"
  options={["Private", "Common", "Both", "Not Available"]}
  value={formData.washroom || ""}
  onChange={(v) => handleChange("washroom", v.target.value)}
/>

       <Select
  id="parking"
  label="Parking Facility"
  options={["Dedicated Parking", "Shared Parking", "No Parking"]}
  value={formData.parking || ""}
  onChange={(v) => handleChange("parking", v.target.value)}
/>
      </div>

      {/* BUSINESS SUITABILITY */}
      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-violet-700 font-semibold">🧠 Business Suitability</span>} />

        <div>
          <Select
            id="idealFor"
            label="Ideal For *"
            options={[
              "IT / Software",
              "Consulting",
              "Finance / CA / Legal",
              "Startup",
              "Any Business",
            ]}
            value={formData.idealFor || ""}
            onChange={(v) => handleChange("idealFor", v.target.value)}
          />
          {errors.idealFor && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.idealFor}
            </p>
          )}
        </div>

<Select
  id="clientVisit"
  label="Client Visit Allowed?"
  options={["Yes", "No"]}
  value={formData.clientVisit || ""}
  onChange={(v) => handleChange("clientVisit", v.target.value)}
/>
       <Select
  id="workingHours"
  label="Working Hours Restriction?"
  options={["No Restriction", "Daytime Only", "As Per Building Rules"]}
  value={formData.workingHours || ""}
  onChange={(v) => handleChange("workingHours", v.target.value)}
/>
      </div>

      {/* AVAILABILITY */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-amber-700 font-semibold">📅 Availability</span>} />

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
      </div>

      {/* OWNER DETAILS */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-rose-700 font-semibold">👤 Owner / Contact Details</span>} />

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

        <Input label="Alternate Contact (Optional)" />
        <Input label="Email (Optional)" />

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
        <Section title={<span className="text-gray-700 font-semibold">📸 Office Media (Optional)</span>} />
        <Upload label="Office Images (Optional)" />
        <Upload label="Office Walkthrough Video (Optional)" />
      </div>

      {/* SAVE */}
      <div className="sticky bottom-4 bg-white border rounded-xl p-4 shadow-lg">
        <SaveButton onClick={handleSave} />
        <p className="text-xs text-gray-400 text-center mt-2">
          You can edit office details anytime later
        </p>
      </div>

    </div>
  );
}

export default Office;
