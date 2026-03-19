import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getLocations, getCustomerCategories, getProducts, getEmployees, getProductCategories } from "./api";
import { EmployeeDropdownGetQuery } from "./type";

export function useGetDropdownLocationQuery(limit: number, keyword: string) {
    type props = {
        pageParam: any
    }

    const query = (params: props) => {
        return getLocations(limit, params.pageParam, keyword)
    }

    return useInfiniteQuery({
        // queryKey: ['limit', limit],
        queryKey: ['locations'],
        initialPageParam: '',
        getNextPageParam: (lastPage, pages) => lastPage?.data.nextCursor,
        queryFn: query
    });
}

export function useGetDropdownCustomerCategoryQuery(limit: number, keyword: string) {
    type props = {
        pageParam: any
    }

    const query = (params: props) => {
        return getCustomerCategories(limit, params.pageParam, keyword)
    }

    return useInfiniteQuery({
        // queryKey: ['limit', limit],
        queryKey: ['customer-category'],
        initialPageParam: '',
        getNextPageParam: (lastPage, pages) => lastPage?.data.nextCursor,
        queryFn: query
    });
}

export function useGetDropdownProductQuery(limit: number, keyword: string, exclude_ids: number[]) {
    type props = {
        pageParam: any
    }

    const query = (params: props) => {
        return getProducts(limit, params.pageParam, keyword, exclude_ids)
    }

    return useInfiniteQuery({
        // queryKey: ['limit', limit],
        queryKey: ['products'],
        initialPageParam: '',
        getNextPageParam: (lastPage, pages) => lastPage?.data.nextCursor,
        queryFn: query
    });
}

export function useGetDropdownProductWithoutLoadMoreQuery(limit: number, keyword: string, exclude_ids: number[]) {
    return useQuery({
        queryKey: ['products-dropdown-without-load-more'],
        queryFn: () => getProducts(limit, '', keyword, exclude_ids)
    })
}

export function useGetDropdownEmployeeQuery(param: EmployeeDropdownGetQuery) {
    type props = {
        pageParam: any
    }

    const query = (prop: props) => {
        const params = {
            ...param,
            cursor: prop.pageParam
        } as unknown as EmployeeDropdownGetQuery

        return getEmployees(params)
    }

    return useInfiniteQuery({
        // queryKey: ['limit', limit],
        queryKey: ['employees'],
        initialPageParam: '',
        getNextPageParam: (lastPage, pages) => lastPage?.data.nextCursor,
        queryFn: query
    });
}

export function useGetDropdownProductCategoryQuery(limit: number, keyword: string, exclude_ids: number[]) {
    type props = {
        pageParam: any
    }

    const query = (params: props) => {
        return getProductCategories(limit, params.pageParam, keyword, exclude_ids)
    }

    return useInfiniteQuery({
        // queryKey: ['limit', limit],
        queryKey: ['product-categories'],
        initialPageParam: '',
        getNextPageParam: (lastPage, pages) => lastPage?.data.nextCursor,
        queryFn: query
    });
}