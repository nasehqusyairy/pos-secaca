import { useQuery } from "@tanstack/react-query";
import { getCustomerCategories, getOneCustomerCategory } from "./api";
import { GetCustomerCategoryRequest } from "./type";

export function useGetCustomerCategoriesQuery(params: GetCustomerCategoryRequest) {
    return useQuery({
        queryKey: [['search', params.search], ['limit', params.limit], ['page', params.page]],
        queryFn: () => getCustomerCategories(params)
    });
}

export function useGetOneCustomerCategoryQuery(id: number) {
    return useQuery({
        queryKey: ['get-one-customer-category'],
        queryFn: () => getOneCustomerCategory(id)
    });
}