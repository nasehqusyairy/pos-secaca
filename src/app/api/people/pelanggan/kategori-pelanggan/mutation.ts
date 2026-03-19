import { useMutation } from "@tanstack/react-query";
import { activateCustomerCategory, archiveCustomerCategory, createCustomerCategories, updateCustomerCategories } from "./api";
import { CustomerCategories } from "./type";

// CustomerCategories
export function useCreateCustomerCategoriesMutation() {
    return useMutation({
        mutationKey: ['add', 'customer-categories'],
        mutationFn: (params: CustomerCategories) => createCustomerCategories(params)
    })
}

export function useUpdateCustomerCategoriesMutation() {
    return useMutation({
        mutationKey: ['update', 'customer-categories'],
        mutationFn: (params: CustomerCategories) => updateCustomerCategories(params)
    })
}

export function useArchiveCustomerCategoryMutation() {
    return useMutation({
        mutationKey: ['archive', 'customer-categories'],
        mutationFn: (params: number) => archiveCustomerCategory(params)
    })
}

export function useActivateCustomerCategoryMutation() {
    return useMutation({
        mutationKey: ['activate', 'customer-categories'],
        mutationFn: (params: number) => activateCustomerCategory(params)
    })
}