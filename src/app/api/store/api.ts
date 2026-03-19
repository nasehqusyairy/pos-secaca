import apiClient from "../apiClient";
import { AuthStore } from "./type";

export function authStore(data: AuthStore) {
    return apiClient.post(`/api/kasir/auth`, data);
}
