

import apiClientStore from "../apiClientStore";
import { SaleDataRequest } from "./type";

export function getSummary(loc_id: number) {
    const params = {
        location_id: loc_id
    }

    return apiClientStore.get(`/api/kasir/takings`, { params })
}

export function createSummary(data: SaleDataRequest) {
    return apiClientStore.post(`/api/kasir/takings`, data);
}
