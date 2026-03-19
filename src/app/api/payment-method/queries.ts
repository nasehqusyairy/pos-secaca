import { useQuery } from "@tanstack/react-query";
import { getPaymentMethod } from "./api";


export function useGetPaymentMethodQuery(limit: number = 100, statuses?: string[]) {
    return useQuery({
        queryKey: ['paymentMethod'],
        queryFn: () => getPaymentMethod(limit, statuses)
    });
}