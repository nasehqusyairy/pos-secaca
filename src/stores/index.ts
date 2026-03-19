import { Customer } from "@/types/order";
import { create } from "zustand";
import { OrderState, SelectedProductsState } from "./type";

export const useCataloguesStore = create<SelectedProductsState>((set) => ({
  products: [],
  setSelectedProductsState: (products) => set({ products }),
}));

export const useOrderStore = create<OrderState>((set) => ({
  order: undefined,
  orderTypeId: undefined,
  amount: 0,
  customer: {} as Customer,
  employee_sales_id: 0,
  setOrder: (order, orderTypeId, amount, customer, employee_sales_id) =>
    set({ order, orderTypeId, amount, customer, employee_sales_id }),
}));