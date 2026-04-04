export const getProperties = () =>
  JSON.parse(localStorage.getItem("properties")) || [];

export const saveProperty = (property) => {
  const all = getProperties();
  all.push(property);
  localStorage.setItem("properties", JSON.stringify(all));
};

export const updateProperty = (updated) => {
  const all = getProperties().map((p) =>
    p.id === updated.id ? updated : p
  );
  localStorage.setItem("properties", JSON.stringify(all));
};
