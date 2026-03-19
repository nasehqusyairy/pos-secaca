import { useQuery } from "@tanstack/react-query";
import { getOnePromo, getPromos } from "./api";
import { GetPromoRequest } from "./type";

export function useGetPromosQuery(params: GetPromoRequest) {
    return useQuery({
        queryKey: [
            ['limit', params.limit],
            ['page', params.page],
        ],
        queryFn: () => getPromos(params)
    });
}

export function useGetOnePromoQuery(id: string) {
    return useQuery({
        queryKey: ['promo', id],
        queryFn: () => getOnePromo(id),
        enabled: !!id
    })
}