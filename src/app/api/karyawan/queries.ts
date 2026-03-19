import { useQuery } from "@tanstack/react-query";
import { getCashierEmployee, getEmployee } from "./api";

export function useGetEmployeesQuery() {
    return useQuery({
        queryKey: ['get', 'employees'],
        queryFn: () => getEmployee()
    })
}

export function useGetCashierEmployeesQuery(limit: number, location_id: number, next_url: string | null) {
    return useQuery({
        queryKey: ['get', 'employees', location_id],
        queryFn: () => getCashierEmployee(limit, location_id, next_url)
    })
}