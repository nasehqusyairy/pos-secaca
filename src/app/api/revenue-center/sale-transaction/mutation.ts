import { useMutation } from "@tanstack/react-query";
import { VoidSaleTransactionParams } from "./type";
import { voidOneSaleTransaction } from "./api";

export function useVoidSaleTransactionMutation() {
    return useMutation({
        mutationKey: ['sale-transactiob', 'void'],
        mutationFn: (params: VoidSaleTransactionParams) => voidOneSaleTransaction(params)
    })
}