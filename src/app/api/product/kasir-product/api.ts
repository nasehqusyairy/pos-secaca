import apiClientStore from "../../apiClientStore";

export function getAllCashierProduct(limit: number, loc_id: number) {
    return apiClientStore.get(`/api/kasir/product_location_stocks?limit=${limit}&prod_id=${loc_id}`);
}

export function getCashierProduct(id: number) {
    return apiClientStore.get(`/api/kasir/product_location_stocks/${id}`);
}