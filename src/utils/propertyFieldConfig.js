export const PROPERTY_FIELD_CONFIG = {
  PG: [
    {
      title: "PG Information",
      icon: "🏠",
      keys: ["pgName", "pgType", "occupancyType"],
    },
    {
      title: "Pricing",
      icon: "💰",
      keys: ["rent", "deposit", "electricityCharges"],
    },
    {
      title: "Food Details",
      icon: "🍽️",
      keys: ["foodProvided", "foodType", "foodTimings"],
    },
    {
      title: "Facilities",
      icon: "🛏️",
      keys: ["facilities"],
    },
    {
      title: "Contact",
      icon: "📞",
      keys: ["contactName", "mobile", "email", "preferredContact"],
    },
  ],

  Apartment: [
    {
      title: "Apartment Details",
      icon: "🏢",
      keys: ["apartmentName", "towerName", "bhk", "floor", "totalFloors", "builtUpArea"],
    },
    {
      title: "Pricing",
      icon: "💰",
      keys: ["rent", "deposit", "maintenanceAmount"],
    },
    {
      title: "Society Features",
      icon: "✨",
      keys: ["lift", "parking", "powerBackup", "waterSupply", "security"],
    },
    {
      title: "Amenities",
      icon: "🏊",
      keys: ["amenities"],
    },
    {
      title: "Availability",
      icon: "📅",
      keys: ["availableFrom", "preferredTenants"],
    },
    {
      title: "Contact",
      icon: "📞",
      keys: ["ownerName", "mobile", "email", "preferredContact"],
    },
  ],

  Shop: [
    {
      title: "Shop Details",
      icon: "🏪",
      keys: ["shopName", "area", "floor", "facing"],
    },
    {
      title: "Pricing",
      icon: "💰",
      keys: ["rent", "deposit"],
    },
    {
      title: "Contact",
      icon: "📞",
      keys: ["ownerName", "mobile"],
    },
  ],

  // You can add Office, Flat, Others same way
};
