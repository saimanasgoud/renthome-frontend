import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";

function Properties() {
  const location = useLocation();
  const [properties, setProperties] = useState([]);

  const searchData = location.state;

    const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (searchData) {
      fetchProperties(searchData);
    }
  }, [searchData]);

const fetchProperties = async (filters) => {
  const query = new URLSearchParams(filters).toString();

  const res = await fetch(
    `${API_BASE_URL}/api/forms/search/filter?${query}`
  );

  const data = await res.json();

  // 🔥 IMPORTANT (your backend uses formJson)
  const parsed = data.map((p) => ({
    ...p,
    ...JSON.parse(p.formJson || "{}")
  }));

  setProperties(parsed);
};

  return (
    <div className="grid grid-cols-3 gap-4 p-5">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}

export default Properties;