import { Section, Input, Select, Upload, SaveButton } from "../components/FormUI";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";
import LocationSelector from "../components/LocationSelector";
import { useState, useEffect } from "react";
import { validateProperty } from "../utils/validation";

function Flat() {

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!propertyId;

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

useEffect(() => {
  if (!propertyId) return;

  const token = localStorage.getItem("token"); // ✅ ADD THIS

  fetch(`${API_BASE_URL}/api/forms/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

      .then(res => res.json())
      .then(data => {
        const parsed = data.formJson ? JSON.parse(data.formJson) : {};
        setFormData(parsed);
        setImages(parsed.images || []);
      });
  }, [propertyId]);

  useEffect(() => {
    if (isEditMode) return;

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("❌ No token found");
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then(user => {

        if (user && user.name) {
          setFormData(prev => ({
            ...prev,
            ownerName: user.name,
            mobile: user.mobile || prev.mobile,
            email: user.email || prev.email
          }));
        }

      })
      .catch(err => {
        console.error("User fetch error:", err);
      });

  }, [isEditMode]);

  const handleImages = async (files) => {

    const uploadedUrls = [];
    setUploading(true);

    for (let file of files) {

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "renthome_upload");

      const res = await fetch("https://api.cloudinary.com/v1_1/djy0vmtbb/image/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.secure_url) {
        uploadedUrls.push(data.secure_url);
      }
    }

    setImages(prev => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

    const requiredFields = [
    "flatName",
    "ownerName",
    "mobile",
    "bhk",
    "floor",
    "rent",
    "availableFrom",
  ];
  
  const handleSave = async () => {

    const validationErrors = validateProperty(dataToSave, requiredFields);

    if (saving) return;
    setSaving(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      setSaving(false);
      return;
    }

    const dataToSave = {
      ...formData,
      images
    };

    if (!formData.immediate && !formData.availableFrom) {
  validationErrors.availableFrom = "Available date is required";
}

    if (images.length === 0) {
      validationErrors.images = "At least 1 image required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSaving(false);
      return;
    }

    const url = isEditMode
      ? `${API_BASE_URL}/api/forms/${propertyId}`
      : `${API_BASE_URL}/api/forms/save`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          formJson: JSON.stringify(dataToSave),
          propertyType: "Flat"
        })
      });

      const saved = await res.json();

      navigate(`/generate-qr/${saved.id}`);

    } catch (err) {
      alert("Error saving");
      setSaving(false);
    }
  };

  if (saving) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin h-16 w-16 border-b-4 border-blue-600 rounded-full"></div>
        <p className="mt-4 text-blue-600 font-semibold">
          {propertyId ? "Updating Flat..." : "Saving Flat..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* OWNER DETAILS */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 shadow-sm">
        <Section title={<span className="text-rose-700 font-semibold">👤 Owner Contact Details</span>} />

<p className="text-xs text-right italic text-gray-500">
  Auto-filled from your profile
</p>
        <Input
          id="ownerName"
          label="Owner Name *"
          value={formData.ownerName || ""}
          readOnly
        />
        {errors.ownerName && <p className="text-red-500 text-sm text-right mb-4">{errors.ownerName}</p>}

        <Input
          id="mobile"
          label="Mobile Number *"
          value={formData.mobile || ""}
          onChange={(e) => handleChange("mobile", e.target.value)}
        />
        {errors.mobile && <p className="text-red-500 text-sm text-right mb-4">{errors.mobile}</p>}

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
          onChange={(e) => handleChange("preferredContact", e.target.value)}
        />
      </div>

      {/* BASIC DETAILS */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm">
        <Section title={<span className="text-blue-700 font-semibold">🏠 Basic Flat Details</span>} />

        <Input
          id="flatName"
          label="Flat / Property Name *"
          value={formData.flatName || ""}
          onChange={(e) => handleChange("flatName", e.target.value)}
        />
        {errors.flatName && (
          <p className="text-red-500 text-sm text-right -mt-3">{errors.flatName}</p>
        )}

        <Select
          id="bhk"
          label="BHK *"
          options={["1 BHK", "2 BHK", "3 BHK", "4 BHK"]}
          value={formData.bhk || ""}
          onChange={(e) => handleChange("bhk", e.target.value)}
        />
        {errors.bhk && <p className="text-red-500 text-sm text-right -mt-3">{errors.bhk}</p>}

        <Input
          id="floor"
          label="Floor Number *"
          value={formData.floor || ""}
          onChange={(e) => handleChange("floor", e.target.value)}
        />
        {errors.floor && <p className="text-red-500 text-sm text-right -mt-3">{errors.floor}</p>}


        <Input
          id="totalFloors"
          label="Total Floors in Building *"
          value={formData.totalFloors || ""}
          onChange={(e) => handleChange("totalFloors", e.target.value)}
        />
        {errors.totalFloors && <p className="text-red-500 text-sm text-right -mt-3">{errors.totalFloors}</p>}


        <Input
          id="builtUpArea"
          label="Built-up Area (sq ft) *"
          value={formData.builtUpArea || ""}
          onChange={(e) => handleChange("builtUpArea", e.target.value)}
        />
      </div>

      {/* RENT DETAILS */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-5 shadow-sm">
        <Section title={<span className="text-green-700 font-semibold">💰 Rent & Payment Details</span>} />

        <Input
          id="rent"
          label="Monthly Rent (₹)"
          type="number"
          value={formData.rent || ""}
          onChange={(e) => handleChange("rent", e.target.value)}
        />
        {errors.rent && <p className="text-red-500 text-sm text-right -mt-3">{errors.rent}</p>}

        <Select
          id="maintenanceType"
          label="Maintenance Charges"
          options={[
            "Included in Rent",
            "Extra (Owner will mention amount)",
          ]}
          value={formData.maintenanceType || ""}
          onChange={(e) => handleChange("maintenanceType", e.target.value)}
        />

        <Input
          id="maintenanceAmount"
          label="Maintenance Amount (₹) (Optional)"
          value={formData.maintenanceAmount || ""}
          onChange={(e) => handleChange("maintenanceAmount", e.target.value)}
        />
      </div>

      {/* PROPERTY FEATURES */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 shadow-sm">
        <Section title={<span className="text-purple-700 font-semibold">✨ Property Features</span>} />

        <Select
          id="lift"
          label="Lift Available?"
          options={["Yes", "No"]}
          value={formData.lift || ""}
          onChange={(e) => handleChange("lift", e.target.value)}
        />

        <Select
          id="parking"
          label="Parking Available?"
          options={["Bike", "Car", "Both", "None"]}
          value={formData.parking || ""}
          onChange={(e) => handleChange("parking", e.target.value)}
        />

        <Select
          id="waterSupply"
          label="Water Supply"
          options={["Municipal", "Borewell", "Both"]}
          value={formData.waterSupply || ""}
          onChange={(e) => handleChange("waterSupply", e.target.value)}
        />

        <Select
          id="powerBackup"
          label="Power Backup"
          options={["Yes", "No"]}
          value={formData.powerBackup || ""}
          onChange={(e) => handleChange("powerBackup", e.target.value)}
        />
      </div>

      {/* AVAILABILITY */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 shadow-sm">
        <Section title={<span className="text-yellow-700 font-semibold">📅 Availability Details</span>} />

        {/* AVAILABLE IMMEDIATELY */}
<div className="flex items-center gap-3 mb-3">
  <input
    type="checkbox"
    checked={formData.immediate || false}
    onChange={(e) => {
      const isChecked = e.target.checked;
      const today = new Date().toISOString().split("T")[0];

      setFormData(prev => ({
        ...prev,
        immediate: isChecked,
        availableFrom: isChecked ? today : ""
      }));

      // clear error
      setErrors(prev => ({
        ...prev,
        availableFrom: ""
      }));
    }}
  />
  <label className="text-sm text-gray-700">
    Available Immediately
  </label>
</div>

{/* DATE INPUT */}
<Input
  id="availableFrom"
  label="Available From *"
  type="date"
  min={new Date().toISOString().split("T")[0]}
  disabled={formData.immediate}
  value={formData.availableFrom || ""}
  onChange={(e) => {
    const value = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (value < today) {
      setErrors(prev => ({
        ...prev,
        availableFrom: "Past date not allowed"
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        availableFrom: ""
      }));
      handleChange("availableFrom", value);
    }
  }}
/>

{errors.availableFrom && (
  <p className="text-red-500 text-sm mb-2">
    {errors.availableFrom}
  </p>
)}

        <Select
          id="preferredTenants"
          label="Preferred Tenants"
          options={["Family", "Bachelors", "Anyone"]}
          value={formData.preferredTenants || ""}
          onChange={(e) => handleChange("preferredTenants", e.target.value)}
        />
      </div>

      <LocationSelector formData={formData} setFormData={setFormData} />

      {/* MEDIA */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
        <Section title={<span className="text-gray-700 font-semibold">📸 Property Media (Optional)</span>} />

        <Upload
          label="Upload Flat Images"
          multiple
          onChange={(e) => handleImages(e.target.files)}
        />

        {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}

        {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}

      </div>

      {images.length > 0 && (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
    
    {images.map((img, i) => (
      <div
        key={i}
        className="relative bg-white rounded-xl shadow border overflow-hidden"
      >
        <img
          src={img}
          alt="flat"
          className="w-full h-auto object-cover"
        />

        {/* REMOVE BUTTON (optional but recommended) */}
        <button
          onClick={() =>
            setImages(images.filter((_, index) => index !== i))
          }
          className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow"
        >
          ✕
        </button>

      </div>
    ))}

  </div>
)}

      {/* SAVE */}
      <div className="sticky bottom-4 bg-white border rounded-xl p-4 shadow-lg">
        <SaveButton onClick={handleSave} />
        <p className="text-xs text-gray-400 text-center mt-2">
          You can edit these details anytime later
        </p>
      </div>

    </div>
  );
}

export default Flat;
