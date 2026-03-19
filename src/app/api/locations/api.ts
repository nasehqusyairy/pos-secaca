import apiClient from "../apiClient";
import { Locations } from "./type";

export function getLocations(limit: number = 100) {
    return apiClient.get(`/api/backoffice/locations?limit=${limit}`);
}

export function updateLocation(data: Locations) {
    return apiClient.put(`/api/backoffice/locations/${data.id}`, data);
}

export function createLocation(data: Locations) {
    return apiClient.post(`/api/backoffice/locations`, data);
}