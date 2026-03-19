import { GetInvoicesQueryParams } from "@/types/invoice";
import apiClientStore from "../apiClientStore";
import apiClientStoreV2 from "../apiClientStoreV2";

export async function getInvoice(limit: number, locations: number[], refundAmount: number, excludeIds?: number[]) {
    const param = {
        exclude_ids: excludeIds,
        refund_amount: refundAmount,
        limit: limit,
        locs: locations
    }

    return await apiClientStore.get('/api/kasir/sale_transactions', { params: param });
}

export async function getInvoiceWithCursor(param: GetInvoicesQueryParams) {
    return await apiClientStoreV2.get('/api/kasir/sale_transactions', { params: param });
}

export async function getInvoiceDetail(id: number) {
    return await apiClientStore.get(`/api/kasir/sale_transactions/${id}`);
}

export async function createRefund(id: number, data: any) {
    return await apiClientStore.post(`/api/kasir/sale_transactions/${id}/refund`, data);
}