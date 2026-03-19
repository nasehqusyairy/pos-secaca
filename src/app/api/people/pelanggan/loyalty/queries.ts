import { useQuery } from "@tanstack/react-query";
import { getOneLoyalty, getLoyalties } from "./api";
import { GetLoyaltyRequest } from "./type";

export function useGetLoyaltiesQuery(params: GetLoyaltyRequest) {
    return useQuery({
        queryKey: [
            ['loyalty', 'index'],
            ['limit', params.limit],
            ['page', params.page],
        ],
        queryFn: () => getLoyalties(params)
    });
}

export function useGetOneLoyaltyQuery(id: string) {
    return useQuery({
        queryKey: ['loyalty', id],
        queryFn: () => getOneLoyalty(id),
        enabled: !!id
    })
}