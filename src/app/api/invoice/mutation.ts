import { useMutation } from "@tanstack/react-query";
import { createRefund } from "./api";

export function useCreateRefundMutation() {
    return useMutation({
        mutationKey: ['create', 'refund'],
        mutationFn: ({ id, data }: { id: number, data: any }) => createRefund(id, data)
    })
}