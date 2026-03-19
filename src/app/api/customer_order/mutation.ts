import { useMutation } from "@tanstack/react-query";
import { createOrder, updateOrder } from "./api";
import { PaymentOrder } from "@/types/order";

export function useCreateOrderMutation() {
    return useMutation({
        mutationKey: ["create", 'order'],
        mutationFn: (param: PaymentOrder) => createOrder(param)
    })
}

export function useUpdateOrderMutation() {
    return useMutation({
        mutationKey: ["create", 'update'],
        mutationFn: (param: PaymentOrder) => updateOrder(param)
    })
}
