import { useQuery } from "@tanstack/react-query";
import { getCustomer } from "./api";

export function useGetCustomerByKeywordQuery(keyword: string,) {
    return useQuery({
        queryKey: ["customer", keyword],
        queryFn: () => getCustomer(keyword),
        enabled: !!keyword
    })
}