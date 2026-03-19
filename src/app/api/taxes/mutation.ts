import { useMutation } from "@tanstack/react-query";
import { createTaxes, updateTaxes } from "./api";
import { Taxes } from "./type";

export function useCreateTaxesMutation() {
    return useMutation({
        mutationKey: ['add', 'taxes'],
        mutationFn: (data: Taxes) => createTaxes(data)
    });
}

export function useUpdateTaxesMutation() {
    return useMutation({
        mutationKey: ['update', 'Taxes'],
        mutationFn: (data: Taxes) => updateTaxes(data)
    });
}