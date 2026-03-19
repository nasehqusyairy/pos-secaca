import { useMutation } from "@tanstack/react-query";
import { createRole, deleteRole, updateRole } from "./api";
import { RequestRoles } from "./type";

export function useCreateRolesMutation() {
    return useMutation({
        mutationKey: ['add', 'roles'],
        mutationFn: (params: RequestRoles) => createRole(params)
    })
}

export function useUpdateRolesMutation() {
    return useMutation({
        mutationKey: ['update', 'roles'],
        mutationFn: (params: RequestRoles) => updateRole(params)
    })
}

export function useDeleteRolesMutation() {
    return useMutation({
        mutationKey: ['delete', 'roles'],
        mutationFn: (params: number) => deleteRole(params)
    })
}