
// ===============================
// CHECK LOGIN STATUS
// ===============================
export const isOwnerLoggedIn = () => {
  return !!localStorage.getItem("token") && localStorage.getItem("role") === "OWNER";
};

// ===============================
// LOGOUT
// ===============================
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("ownerId");
  localStorage.removeItem("role");
};

export const isAdmin = () => {
  return localStorage.getItem("role") === "ADMIN";
};