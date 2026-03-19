import { useQuery } from "@tanstack/react-query";
import { getOrderType } from "./api";


export function useGetOrderTypeQuery(limit: number = 100, status?: string) {
    return useQuery({
        queryKey: ['orderType', limit],
        queryFn: () => getOrderType(limit, status)
    })
}