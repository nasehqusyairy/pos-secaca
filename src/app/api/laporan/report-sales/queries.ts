import { useQuery } from "@tanstack/react-query";
import { getReportSales } from "./api";
import { ReportSalesRequest } from "./type";

export function useGetReportSalesQuery(params: ReportSalesRequest) {
    return useQuery({
        queryKey: [
            ['limit', params.limit],
            ['page', params.page],
        ],
        queryFn: () => getReportSales(params)
    });
}