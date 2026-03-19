import { useMutation } from "@tanstack/react-query";
import { createEmploye, deleteEmployee, updateEmployee } from "./api";
import { EmployeeRequest } from "./type";

export function useCreateEmployeeMutation() {
    return useMutation({
        mutationKey: ['add', 'employee'],
        mutationFn: (params: EmployeeRequest) => createEmploye(params)
    })
}

export function useUpdateEmployeeMutation() {
    return useMutation({
        mutationKey: ['update', 'employee'],
        mutationFn: (params: EmployeeRequest) => updateEmployee(params)
    })
}

export function useDeleteEmployeeMutation() {
    return useMutation({
        mutationKey: ['delete', 'employee'],
        mutationFn: (id: number) => deleteEmployee(id)
    })
}