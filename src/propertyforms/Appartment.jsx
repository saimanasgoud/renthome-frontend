import { Section, Input, Select, Upload, SaveButton } from "../components/FormUI";
import { useState, useEffect } from "react";
import { validateProperty } from "../utils/validation";
import RadioYesNo from "../components/RadioYesNo";
import LocationSelector from "../components/LocationSelector";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";

function Apartment() {
  const [amenities, setAmenities] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!propertyId;
  const [saving, setSaving] = useState(false); // 🔥 add at top


  useEffect(() => {
    if (!propertyId) return;

    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/api/forms/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (!res.ok) {
        throw new Error("Unauthorized or failed");
      }
      return res.json();
    })
      .then(data => {

        let parsed = {};

        try {
          parsed = data.formJson
            ? JSON.parse(data.formJson)
            : {};
        } catch (e) {
          console.error("Invalid JSON", e);
        }

        // ✅ SET FORM DATA
        setFormData(parsed);

        // ✅ SET IMAGES
        if (parsed.images) {
          setImages(parsed.images);
        }

        // ✅ SET AMENITIES (convert string → array)
        if (parsed.amenities) {
          setAmenities(parsed.amenities.split(","));
        }

      })
      .catch(err => console.error(err));

  }, [propertyId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
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
        } else {
          console.log("❌ Name not found in user object");
        }
      })
      .catch(err => {
        console.error("❌ User fetch error:", err);
      });

  }, [isEditMode]);

  const handleImages = async (files) => {
    const uploadedUrls = [];

    if (images.length + files.length > 5) {
      setErrors(prev => ({
        ...prev,
        images: "Maximum 5 images allowed"
      }));
      return;
    }

    setUploading(true);

    for (let file of files) {

      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          images: "Each image must be less than 2MB"
        }));
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "renthome_upload");

      const res = await fetch("https://api.cloudinary.com/v1_1/djy0vmtbb/image/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("UPLOAD RESULT:", data); // ✅ debug

      if (data.secure_url) {
        uploadedUrls.push(data.secure_url);
      }
    }

    setImages(prev => [...prev, ...uploadedUrls]);
    setUploading(false);
  };


  const toggleAmenity = (item) => {
    setAmenities((prev) =>
      prev.includes(item)
        ? prev.filter((a) => a !== item)
        : [...prev, item]
    );
  };
  const handleSave = async () => {

    if (saving) return;
    setSaving(true);

    if (uploading) {
      setErrors(prev => ({
        ...prev,
        images: "Please wait until images finish uploading"
      }));
      setSaving(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first ❗");
      navigate("/login");
      setSaving(false);
      return;
    }

    const dataToSave = {
      ...formData,
      amenities: amenities.length ? amenities.join(",") : null,
      images: images
    };

    const requiredFields = [
      "apartmentName",
      "towerName",
      "bhk",
      "floor",
      "rent",
      "availableFrom",
      "ownerName",
      "mobile",
      "state",
      "city"
    ];

    const validationErrors = validateProperty(dataToSave, requiredFields);

    if (images.length === 0) {
      validationErrors.images = "At least 1 image is required";
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          formJson: JSON.stringify(dataToSave),
          propertyType: "Apartment",
        }),
      });

      if (!res.ok) throw new Error("Error saving property");

      const savedData = await res.json();

      // ✅ REDIRECT
      navigate(`/generate-qr/${savedData.id}`);

    } catch (err) {
      console.error(err);
      alert("Error saving property");
      setSaving(false);
    }
  };

  const amenityOptions = [
    "Gym",
    "Swimming Pool",
    "Children Play Area",
    "Club House",
    "Jogging Track",
    "Community Hall",
    "Indoor Games",
  ];


  if (saving) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>

        <p className="mt-4 text-lg font-semibold text-blue-600">
          {propertyId ? "Updating property..." : "Saving property..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">



      {/* form */}
      {/* APARTMENT DETAILS */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 shadow-sm">
        <Section title={<span className="text-teal-700 font-semibold">🏢 Apartment / Society Details</span>} />

        <Input
          id="apartmentName"
          label="Apartment / Society Name *"
          value={formData.apartmentName || ""}
          onChange={(e) => handleChange("apartmentName", e.target.value)}
        />
        {errors.apartmentName && (
          <p className="text-red-500 text-sm text-right -mt-3">{errors.apartmentName}</p>
        )}

        <Input
          id="towerName"
          label="Block / Tower Name *"
          value={formData.towerName || ""}
          onChange={(e) => handleChange("towerName", e.target.value)}
        />

        <Select
          id="bhk"
          label="BHK Configuration *"
          options={["1 BHK", "2 BHK", "3 BHK", "4 BHK"]}
          value={formData.bhk || ""}
          onChange={(e) => handleChange("bhk", e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            id="floor"
            label="Floor Number *"
            value={formData.floor || ""}
            onChange={(e) => handleChange("floor", e.target.value)}
          />

          <Input
            id="totalFloors"
            label="Total Floors in Tower"
            value={formData.totalFloors || ""}
            onChange={(e) => handleChange("totalFloors", e.target.value)}
          />
        </div>

        <Input
          id="builtUpArea"
          label="Built-up Area (sq ft)"
          value={formData.builtUpArea || ""}
          onChange={(e) => handleChange("builtUpArea", e.target.value)}
        />
      </div>

      {/* RENT DETAILS */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-emerald-700 font-semibold">💰 Rent & Charges</span>} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            id="rent"
            label="Monthly Rent (₹) *"
            type="number"
            value={formData.rent || ""}
            onChange={(e) => handleChange("rent", e.target.value)}
          />

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
            "Included in Rent",
            "Paid to Apartment Association",
            "Extra (Owner will mention)",
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

      {/* SOCIETY FEATURES */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-indigo-700 font-semibold">✨ Society Features</span>} />

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <RadioYesNo
            label="Lift Available?"
            value={formData.lift}
            onChange={(val) => handleChange("lift", val)}
          />

          <RadioYesNo
            label="Power Backup"
            value={formData.powerBackup}
            onChange={(val) => handleChange("powerBackup", val)}
          />

          <Select
            id="parking"
            label="Parking"
            options={["Car", "Bike", "Both", "None"]}
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
        </div>

        <Select
          id="security"
          label="Security System"
          options={["24/7 Security", "CCTV", "Security + CCTV", "None"]}
          value={formData.security || ""}
          onChange={(e) => handleChange("security", e.target.value)}
        />

      </div>

      {/* AMENITIES */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-indigo-700 font-semibold">🏊 Apartment Amenities</span>} />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {amenityOptions.map((item) => (
            <label
              key={item}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer
                ${amenities.includes(item)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-indigo-50"
                }`}
            >


              <input
                type="checkbox"
                className="hidden"
                checked={amenities.includes(item)}
                onChange={() => toggleAmenity(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* AVAILABILITY */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm">
        <Section title={<span className="text-amber-700 font-semibold">📅 Availability</span>} />
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

              // ✅ CLEAR ERROR when immediate selected
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

      <LocationSelector
        formData={formData}
        setFormData={setFormData}
      />

      {/* OWNER DETAILS */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm">
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

        <Input
          id="mobile"
          label="Mobile Number *"
          value={formData.mobile || ""}
          onChange={(e) => handleChange("mobile", e.target.value)}
        />

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

      {/* MEDIA */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
        <Section title={<span className="text-gray-700 font-semibold">📸 Property Media</span>} />

        <div id="images">
          <Upload
            label="Upload Apartment Images (Max 5)"
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

      {/* ✅ SHOW ALL FIELDS */}


      <div className="sticky bottom-4 bg-white border rounded-xl p-4 shadow-lg">
        <SaveButton
          onClick={handleSave}
          text={saving ? "Processing..." : (propertyId ? "Update Property" : "Save Property")}
        />
      </div>
    </div>
  );
}

export default Apartment;
