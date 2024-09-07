import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/v1/api",
});

export { apiClient };
