import { useQuery } from "@tanstack/react-query";
import { getReportStockMovement } from "./api";
import { ReportStockMovementRequest } from "./type";

export function useGetReportStockMovementQuery(params: ReportStockMovementRequest) {
    return useQuery({
        queryKey: [
            ['limit', params.limit],
            ['page', params.page],
        ],
        queryFn: () => getReportStockMovement(params)
    });
}