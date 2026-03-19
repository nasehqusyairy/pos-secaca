import { useQuery } from "@tanstack/react-query";
import { getEmployeeLocations } from "./api";


export function useGetEmpLocationsQuery(limit: number) {
    return useQuery({
        queryKey: ['employeeLocations'],
        queryFn: () => getEmployeeLocations(limit)
    })
}