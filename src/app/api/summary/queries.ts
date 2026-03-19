import { useQuery } from "@tanstack/react-query";
import { getSummary } from "./api";

export function useGetSummaryQuery(loc_id: number) {
    return useQuery({
        queryKey: ['get', 'summary'],
        queryFn: async () => {
            const response = await getSummary(loc_id);
            if (!response) {
                return null;
            }

            return response.data;
        },
        enabled: !!loc_id
    })
}