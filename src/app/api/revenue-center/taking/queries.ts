import { useQuery } from "@tanstack/react-query";
import { getOneDailySale, getDailySales } from "./api";
import { GetDailySaleRequest } from "./type";

export function useGetDailySalesQuery(params: GetDailySaleRequest) {
    return useQuery({
        queryKey: [
            ['limit', params.limit],
            ['page', params.page],
            // ['start_at', params.start_at],
            // ['end_at', params.end_at],
            // ['loc', params.loc],
        ],
        queryFn: () => getDailySales(params)
    });
}

export function useGetOneDailySaleQuery(id: string) {
    return useQuery({
        queryKey: ['dailySale', id],
        queryFn: () => getOneDailySale(id),
        enabled: !!id
    })
}