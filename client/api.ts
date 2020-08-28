import axios from "axios";

const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL: isServer
    ? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api"
    : "/api",
});

export default api;
