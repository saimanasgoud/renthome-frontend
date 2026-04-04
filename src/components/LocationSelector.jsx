import { useState, useEffect } from "react";
import { State, City } from "country-state-city";

export default function LocationSelector({ formData, setFormData }) {

  const countryCode = "IN";

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setStates(State.getStatesOfCountry(countryCode));
  }, []);

  useEffect(() => {
    if (selectedStateCode) {
      setCities(City.getCitiesOfState(countryCode, selectedStateCode));
    }
  }, [selectedStateCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrorMsg("");

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    const stateObj = states.find((s) => s.name === value);

    setSelectedStateCode(stateObj?.isoCode || "");

    setFormData((prev) => ({
      ...prev,
      state: value,
      stateCode: stateObj?.isoCode, // ✅ ADD THIS
      city: ""
    }));
  };

  const handleAddLocation = () => {

    if (!formData.selectedArea) {
      return setErrorMsg("Please select area from list");
    }

    setErrorMsg("");
    setLocationStatus("success");
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value;

    setLocationStatus(""); // reset
    setErrorMsg("");
    setAreas([]);

    if (/^\d{0,6}$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        pincode: value
      }));
    }
  };

  const handleSearchLocation = async () => {

    setErrorMsg("");
    setAreas([]);

    if (!formData.state || !formData.city) {
      return setErrorMsg("Please select state and city.");
    }

    if (!formData.pincode || formData.pincode.length !== 6) {
      return setErrorMsg("Enter valid 6 digit pincode");
    }

    try {
      setLoadingAreas(true);

      const res = await fetch(
        `https://api.postalpincode.in/pincode/${formData.pincode}`
      );

      const data = await res.json();

      if (data[0].Status === "Success") {

        const postOffices = data[0].PostOffice;

        const isMatch = postOffices.some((po) => {
          return (
            po.State.toLowerCase().trim() === formData.state?.toLowerCase().trim()
          );
        });

        if (!isMatch) {
          const firstPO = postOffices[0];

          setFormData(prev => ({
            ...prev,
            city: firstPO.District,
            state: firstPO.State
          }));

          setErrorMsg(`Pincode belongs to ${firstPO.District}, updated automatically`);
        } else {
          setErrorMsg("");
        }

        setAreas(postOffices);
        setLocationStatus("pincode_valid");
      }


    } catch (err) {
      setErrorMsg("Failed to fetch areas");
    } finally {
      setLoadingAreas(false);
    }
  };

  const fullAddress = `${formData.area || ""}, ${formData.selectedArea || ""}, ${formData.city || ""}, ${formData.state || ""}, ${formData.pincode || ""}, India`;
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border mt-6">

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        📍 Property Location
      </h2>
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded text-sm mb-3">
        ℹ Enter correct <span className="font-semibold">address details</span> to help users find nearby homes easily
        by using <strong>pincode, BHK type</strong>, and other filters.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Country */}

        {/* Country */}
        <div className="grid grid-cols-3 items-center">
          <label className="text-gray-600 font-medium">Country</label>
          <input
            type="text"
            value="India"
            disabled
            className="col-span-2 border p-2 rounded bg-gray-100"
          />
        </div>

        {/* State */}
        <div className="grid grid-cols-3 items-center">
          <label className="text-gray-600 font-medium">State *</label>
          <select
            name="state"
            value={formData.state || ""}
            onChange={handleStateChange}
            className="col-span-2 border p-2 rounded"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="grid grid-cols-3 items-center">
          <label className="text-gray-600 font-medium">City *</label>
          <select
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            className="col-span-2 border p-2 rounded"
          >
            <option value="">Select City</option>
            {cities.map((c, i) => (
              <option key={i}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Area */}
        <div className="grid grid-cols-3 items-center">
          <label className="text-gray-600 font-medium">House No / Area *</label>
          <input
            type="text"
            name="area"
            value={formData.area || ""}
            onChange={handleChange}
            placeholder="Enter address"
            className="col-span-2 border p-2 rounded"
          />
        </div>

      </div>

      {/* PINCODE SECTION */}
      <div className="mt-2 border-t pt-4 space-y-3">

        <div className="grid grid-cols-3 items-center">
          <label className="text-gray-600 font-medium">Pincode *</label>

          <div className="col-span-2 flex gap-3">
            <input
              type="text"
              name="pincode"
              value={formData.pincode || ""}
              onChange={handlePincodeChange}
              maxLength="6"
              className="border p-2 rounded w-24"
            />


            <button
              onClick={handleSearchLocation}
              disabled={loadingAreas || formData.pincode?.length !== 6}
              className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded flex items-center gap-2"
            >
              {loadingAreas ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Fetching Locations...
                </>
              ) : (
                "Search Pincode"
              )}
            </button>

          </div>
        </div>
        {/* {locationStatus === "pincode_valid" && (
            <p className="text-green-600 text-sm mt-1">
              ✔ Pincode matches selected location
            </p>
          )} */}

        {/* Info */}
        <p className="text-sm text-blue-600 col-span-3">
          ℹ Helps users find nearby homes
        </p>

        {/* Error */}
        {errorMsg && (
          <p className="text-red-500 text-sm">{errorMsg}</p>
        )}

      </div>

      {areas.length > 0 && (
        <div className="mt-4 grid grid-cols-3 items-center">

          <label className="text-gray-600 font-medium">
            Select Area *
          </label>

          <select
            name="selectedArea"
            value={formData.selectedArea || ""}
            onChange={handleChange}
            className="col-span-2 border p-2 rounded"
          >
            <option value="">Select Area</option>

            {areas.map((a, i) => (
              <option key={i} value={a.Name}>
                {a.Name}
              </option>
            ))}
          </select>

        </div>
      )}

      {areas.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAddLocation}
            disabled={!formData.selectedArea}
            className={`px-4 py-2 rounded text-white ${formData.selectedArea
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Add Location
          </button>
        </div>
      )}

      {/* MAP
      {showMap && (
        <div className="mt-6">

          <iframe
            title="map"
            width="100%"
            height="250"
            className="rounded-lg border"
            src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
          />

          <button
            onClick={handleAddLocation}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Location
          </button>
        </div>
      )} */}

      {/* SUCCESS */}
      {locationStatus === "success" && (
        <div className="mt-6 p-4 bg-green-50 border rounded">

          <p className="text-green-700 font-semibold">
            ✔ Location Added Successfully
          </p>

          <p className="text-sm mt-4">{fullAddress}</p>

          {/* <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            className="text-blue-600 underline text-sm mt-2 inline-block"
          >
            Open in Google Maps
          </a>

          <iframe
            title="map"
            width="100%"
            height="250"
            className="rounded-lg border mt-3"
            src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
          />*/}

        </div>
      )}

    </div>
  );
}