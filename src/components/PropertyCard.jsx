import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {

  // safe fallback
  const image =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://via.placeholder.com/300";

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden">

      {/* IMAGE */}
      <img
        src={image}
        alt={property.propertyType || "Property Image"}
        className="w-full h-48 object-cover"
      />

      {/* CONTENT */}
      <div className="p-4">

        {/* PRICE */}
        <h2 className="text-xl font-bold text-blue-600">
          ₹{property.rent || "N/A"}
        </h2>

        {/* TITLE */}
        <p className="text-md font-semibold mt-1">
          {property.propertyType || "Property"}
        </p>

        {/* LOCATION */}
        <p className="text-sm text-gray-600 mt-1">
          📍 {property.selectedArea || property.area}, {property.city}
        </p>

        {/* EXTRA INFO */}
        <div className="flex justify-between text-sm text-gray-500 mt-2">

          {property.bhk && <span>🏠 {property.bhk}</span>}

          {property.carpetArea && (
            <span>{property.carpetArea} sqft</span>
          )}

        </div>

        {/* BUTTON */}
        <Link
          to={`/property/${property.id}`}
          className="block text-center mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          View Details
        </Link>

      </div>
    </div>
  );
}