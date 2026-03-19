import { useMutation } from "@tanstack/react-query";
import { createPromo } from "./api";
import { Promo } from "./type";

// Product
export function useCreatePromoMutation() {
    return useMutation({
        mutationKey: ['add', 'promo'],
        mutationFn: (params: Promo) => createPromo(params)
    })
}
