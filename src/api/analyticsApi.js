const BASE_URL = import.meta.env.VITE_API_URL;

export const recordView = async (propertyId) => {
  await fetch(`${BASE_URL}/view/${propertyId}`, {
    method: "POST"
  });
};

export const recordQrScan = async (propertyId) => {
  await fetch(`${BASE_URL}/scan/${propertyId}`, {
    method: "POST"
  });
};

export const getAnalyticsStats = async () => {
  const res = await fetch(`${BASE_URL}/stats`);
  return res.json();
};