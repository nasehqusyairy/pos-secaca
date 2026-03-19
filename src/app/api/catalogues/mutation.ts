import { useMutation } from "@tanstack/react-query";
import { checkPromo, createSales, updateOrder } from "./api";
import { PaymentOrder } from "@/types/order";

export function useCreateSaleMutation() {
  return useMutation({
    mutationKey: ["create", "sales"],
    mutationFn: (orderData: PaymentOrder) => createSales(orderData),
  });
}

export function useUpdateOrderMutation() {
  return useMutation({
    mutationKey: ["update", "order"],
    mutationFn: (orderData: PaymentOrder) => updateOrder(orderData),
  });
}

export function useCheckPromoMutation() {
  return useMutation({
    mutationKey: ["check"],
    mutationFn: (promo: any) => checkPromo(promo)
  })
}
