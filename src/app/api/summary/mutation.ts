import { useMutation } from "@tanstack/react-query";
import { createSummary } from "./api";
import { SaleDataRequest } from "./type";

export function useCreateSummaryMutation() {
    return useMutation({
        mutationKey: ['add', 'summary'],
        mutationFn: (params: SaleDataRequest) => createSummary(params)
    })
}