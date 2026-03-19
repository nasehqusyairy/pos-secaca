import { useQuery } from "@tanstack/react-query";
import { getTaxes } from "./api";


export function useGetTaxesQuery(limit: number) {
    return useQuery({
        queryKey: ['taxes', limit],
        queryFn: () => getTaxes(limit)
    })
}