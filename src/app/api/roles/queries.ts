import { useQuery } from "@tanstack/react-query";
import { getRoles, getParentRoles } from "./api";
import { GetRoleRequest } from "./type";

export function useGetRolesQuery(params: GetRoleRequest | null = null) {
    return useQuery({
        queryKey: ['roles'],
        queryFn: () => getRoles(params)
    })
}

export function useGetParentRolesQuery() {
    return useQuery({
        queryKey: ['parent-roles'],
        queryFn: () => getParentRoles()
    })
}