import { useMutation } from "@tanstack/react-query";
import { createOrderType, updateOrderType } from "./api";
import { OrderTypes } from "./type";

export function useCreateOrderTypeMutation() {
    return useMutation({
        mutationKey: ['add', 'orderType'],
        mutationFn: (data: OrderTypes) => createOrderType(data)
    });
}

export function useUpdateOrderTypeMutation() {
    return useMutation({
        mutationKey: ['update', 'orderType'],
        mutationFn: (data: OrderTypes) => updateOrderType(data)
    });
}