import { useQuery } from "@tanstack/react-query";
import { getOneSaleTransaction, getOneSaleTransactionAsPDF, getSaleTransaction } from "./api";
import { GetSaleTransactionRequest } from "./type";

export function useGetSaleTransactionQuery(params: GetSaleTransactionRequest) {
    return useQuery({
        queryKey: [
            ['limit', params.limit],
            ['page', params.page],
            // ['start_at', params.start_at],
            // ['end_at', params.end_at],
            // ['locs', params.locs],
            // ['select_all_location', params.select_all_location],
        ],
        queryFn: () => getSaleTransaction(params)
    });
}

export function useGetOneSaleTransactionQuery(id: string) {
    return useQuery({
        queryKey: ['saleTransaction', id],
        queryFn: () => getOneSaleTransaction(id),
        enabled: !!id
    })
}

export function useGetOneSaleTransactionAsPDFQuery(id: string) {
    return useQuery({
        queryKey: ['saleTransaction-as-pdf', id],
        queryFn: () => getOneSaleTransactionAsPDF(id),
        enabled: !!id
    })
}