import { useQuery } from "@tanstack/react-query";
import { getLocations } from "./api";

export function useGetLocationQuery(limit: number) {
    return useQuery({
        queryKey: ['entity', limit],
        queryFn: () => getLocations(limit)
    });
}