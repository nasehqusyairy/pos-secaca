import { useMutation } from "@tanstack/react-query";
import { createLoyalty, updateLoyalty } from "./api";
import { Loyalties } from "./type";

// Product
export function useCreateLoyaltyMutation() {
    return useMutation({
        mutationKey: ['add', 'loyalty'],
        mutationFn: (params: Loyalties) => createLoyalty(params)
    })
}

export function useUpdateLoyaltyMutation(id: string) {
    return useMutation({
        mutationKey: ['update', 'loyalty'],
        mutationFn: (params: Loyalties) => updateLoyalty(id, params)
    })
}