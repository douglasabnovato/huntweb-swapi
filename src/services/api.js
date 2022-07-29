import axios from "axios";

const api = axios.create({
  baseURL: "http://swapi.dev/api/",
});

export default api;
