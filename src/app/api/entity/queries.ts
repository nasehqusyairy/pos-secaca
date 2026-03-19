import { useQuery } from "@tanstack/react-query";
import { getEntity } from "./api";

export function useGetEntityQuery(id: number) {
    return useQuery({
        queryKey: ['entity'],
        queryFn: () => getEntity(id),
        enabled: !!id
    });
}