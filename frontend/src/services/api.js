import axios from "axios";

const api = axios.create({
  baseURL: "https://hiremind-ai-r2pu.onrender.com/api/v1",
});

export default api;