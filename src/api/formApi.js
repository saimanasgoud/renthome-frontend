import axios from "axios";

const API = axios.create({
  baseURL: "http://192.16.1.5.8081/api/forms",
  headers: {
    "Content-Type": "application/json",
  },
});

export const saveForm = (data) => API.post("/save", data);
export const getAllForms = () => API.get("/all");
export const getFormById = (id) => API.get(`/${id}`);
export const updateForm = (id, data) =>
  API.put(`/update/${id}`, data);
