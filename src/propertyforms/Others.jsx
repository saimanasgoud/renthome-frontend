import { Section, Input, Select, Upload, SaveButton } from "../components/FormUI";
import { useState } from "react";
import { validateProperty } from "../utils/validation";
import { API_BASE_URL } from "../utils/config";

function Others({ onSave }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
const [images, setImages] = useState([]);
const [uploading, setUploading] = useState(false);
const [documents, setDocuments] = useState([]);

  /* ---------- REQUIRED FIELDS ---------- */
  const requiredFields = [
    "usageType",
    "area",
    "description",
    "rent",
    "availableFrom",
    "contactName",
    "mobile",
  ];

  /* ---------- CHANGE HANDLER ---------- */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------- IMAGE HANDLER ---------- */
 
  const handleImages = async (files) => {

  if (images.length + files.length > 5) {
    setErrors(prev => ({
      ...prev,
      images: "Maximum 5 images allowed"
    }));
    return;
  }

  setUploading(true);
  const uploadedUrls = [];

  for (let file of files) {

    // ✅ FILE SIZE LIMIT
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        images: "Each image must be less than 2MB"
      }));
      continue;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "renthome_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/djy0vmtbb/image/upload",
      {
        method: "POST",
        body: data
      }
    );

    const result = await res.json();

    if (result.secure_url) {
      uploadedUrls.push(result.secure_url);
    }
  }

  setImages(prev => [...prev, ...uploadedUrls]);
  setUploading(false);
};

const handleDocuments = async (files) => {

  const uploadedDocs = [];

  for (let file of files) {

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "renthome_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/djy0vmtbb/raw/upload",
      {
        method: "POST",
        body: data
      }
    );

    const result = await res.json();

    uploadedDocs.push(result.secure_url);
  }

  setDocuments((prev) => [...prev, ...uploadedDocs]);
};

  /* ---------- SAVE ---------- */
const handleSave = async () => {

  if (uploading) {
    setErrors(prev => ({
      ...prev,
      images: "Please wait until images finish uploading"
    }));
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  const dataToSave = {
    ...formData,
    images,
    documents
  };

  const validationErrors = validateProperty(dataToSave, requiredFields);
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
        formJson: JSON.stringify(dataToSave),
        propertyType: "Others",
      }),
    });

    const savedData = await res.json();

    window.location.href = `/generate-qr/${savedData.id}`;

  } catch (err) {
    console.error(err);
    alert("Error saving property");
  }
};

  return (
    <div className="space-y-8 animate-fadeIn max-w-xl mx-auto">

      {/* PROPERTY OVERVIEW */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-slate-700 font-semibold">🧩 Property Overview</span>} />

        <div>
          <Input
            id="title"
            label="Property Title / Name *"
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          {errors.title && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <Select
            id="usageType"
            label="Property Usage Type *"
            options={[
              "Warehouse / Godown",
              "Open Land / Plot",
              "Farm House",
              "Guest House",
              "Event Hall",
              "Storage Space",
              "Other",
            ]}
            value={formData.usageType || ""}
            onChange={(v) => handleChange("usageType", v.target.value)}
          />
          {errors.usageType && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.usageType}
            </p>
          )}
        </div>

        <div>
          <Input
            id="area"
            label="Property Area / Size (sq ft / sq yards) *"
            value={formData.area || ""}
            onChange={(e) => handleChange("area", e.target.value)}
          />
          {errors.area && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.area}
            </p>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-gray-700 font-semibold">📝 Property Description</span>} />

        <div>
          <Input
            id="description"
            label="Brief Description *"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          {errors.description && (
            <p className="text-red-500 text-right -mt-3 text-sm">
              {errors.description}
            </p>
          )}
        </div>

        <Input
          id="notes"
          label="Special Notes / Conditions (Optional)"
          value={formData.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
        />      </div>

      {/* RENT & TERMS */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-emerald-700 font-semibold">💰 Rent & Terms</span>} />

        <div>
          <Input
            id="rent"
            label="Expected Rent (₹) *"
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
        <Select
          id="leaseType"
          label="Lease Type"
          options={["Short Term", "Long Term", "Negotiable"]}
          value={formData.leaseType || ""}
          onChange={(v) => handleChange("leaseType", v.target.value)}
        />

        <Select
          id="maintenanceCharges"
          label="Maintenance Charges"
          options={["Not Applicable", "Included", "Extra"]}
          value={formData.maintenanceCharges || ""}
          onChange={(v) => handleChange("maintenanceCharges", v.target.value)}
        />
      </div>

      {/* ACCESS & UTILITIES */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-indigo-700 font-semibold">⚙️ Access & Utilities</span>} />

        <Select
          id="electricity"
          label="Electricity Available?"
          options={["Yes", "No"]}
          value={formData.electricity || ""}
          onChange={(v) => handleChange("electricity", v.target.value)}
        />

        <Select
          id="water"
          label="Water Connection?"
          options={["Yes", "No"]}
          value={formData.water || ""}
          onChange={(v) => handleChange("water", v.target.value)}
        />

        <Select
          id="roadAccess"
          label="Road Access Type"
          options={["Main Road", "Inner Road", "Private Road"]}
          value={formData.roadAccess || ""}
          onChange={(v) => handleChange("roadAccess", v.target.value)}
        />
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
  <Section title={<span className="text-gray-700 font-semibold">📸 Property Media</span>} />

  <div id="images">
    <Upload
      label="Upload Property Images (Max 5)"
      multiple
      onChange={(e) => handleImages(e.target.files)}
    />

    {uploading && (
      <p className="text-blue-500 text-sm mt-2">
        Uploading images... please wait
      </p>
    )}

    {errors.images && (
      <p className="text-red-500 text-sm mt-2">
        {errors.images}
      </p>
    )}

    {/* ✅ IMAGE PREVIEW */}
    {images.length > 0 && (
      <div className="flex gap-2 mt-3 flex-wrap">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img
              src={img}
              className="w-20 h-20 rounded object-cover border"
            />

            {/* ❌ REMOVE BUTTON */}
            <button
              onClick={() =>
                setImages(images.filter((_, index) => index !== i))
              }
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

      {/* SAVE */}
      <div className="sticky bottom-4 bg-white border rounded-xl p-4 shadow-lg">
        <SaveButton onClick={handleSave} loading={uploading} />
        <p className="text-xs text-gray-400 text-center mt-2">
          You can update property details anytime later
        </p>
      </div>

    </div>
  );
}

export default Others;
