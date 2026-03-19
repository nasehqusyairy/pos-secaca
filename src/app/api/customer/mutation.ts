import { useMutation } from "@tanstack/react-query";
import { addCustomer } from "./api";
import { Customer } from "@/types/order";

export function useAddCustomerMutation() {
    return useMutation({
        mutationKey: ["check"],
        mutationFn: (promo: Customer) => addCustomer(promo)
    })
}
