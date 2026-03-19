import { useMutation } from "@tanstack/react-query";
import { createPaymentMethod, updatePaymentMethod } from "./api";
import { PaymentMethods } from "./type";


export function useCreatePaymentMethodMutation() {
    return useMutation({
        mutationKey: ['add', 'paymentMethod'],
        mutationFn: (data: PaymentMethods) => createPaymentMethod(data)
    })
}

export function useUpdatePaymentMethodMutation() {
    return useMutation({
        mutationKey: ['update', 'paymentMethod'],
        mutationFn: (data: PaymentMethods) => updatePaymentMethod(data)
    })
}