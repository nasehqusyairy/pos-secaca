import { useQuery } from "@tanstack/react-query";
import { getReportStockCard } from "./api";
import { ReportStockCardRequest } from "./type";

export function useGetReportStockCardQuery(params: ReportStockCardRequest) {
    return useQuery({
        queryKey: [
            ['limit', params.limit],
            ['page', params.page],
        ],
        queryFn: () => getReportStockCard(params)
    });
}