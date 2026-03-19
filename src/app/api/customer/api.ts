// kasir customer

import { Customer } from "@/types/order";
import apiClientStore from "../apiClientStore";

export async function getCustomer(keyword: string) {
    try {
        const returnData = await apiClientStore.get(`/api/kasir/customers?limit=1&keyword=${keyword}`);

        if (returnData.data) {
            return returnData.data
        }

        return []
    } catch (error) {
        console.error(error)
        return []
    }
}

export function addCustomer(data: Customer) {
    return apiClientStore.post("/api/kasir/customers", data)
}

// Employee kasir
