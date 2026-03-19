import apiClient from "../apiClient";
import { Entity } from "./type";

export async function getEntity(id: number) {
    return await apiClient.get(`/api/backoffice/entities/${id}`)
}

export async function updateEntity(param: Entity) {
    const id = param.id

    return await apiClient.put(`/api/backoffice/entities/${id}`, param)
}