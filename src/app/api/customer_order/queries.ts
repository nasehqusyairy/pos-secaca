import { useQuery } from "@tanstack/react-query";
import { getCustomerOrder } from "./api";
import { GetCustomerOrderQuery } from "./type";

export function useGetCustomerOrderQuery(param: GetCustomerOrderQuery) {
    return useQuery({
        queryKey: ["customer-order", param.cursor],
        queryFn: () => getCustomerOrder(param),
    })
}