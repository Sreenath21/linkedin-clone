import axios from "axios";

const SITE_URL = "http://localhost:3000";

export const API = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
});
