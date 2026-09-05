import { getUrls } from "../config/urls";
const {backendUrl} = getUrls()

import axios from "axios";
export const api = axios.create({ baseURL: `${backendUrl}/api` });
