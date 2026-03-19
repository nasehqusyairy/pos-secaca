import { useQuery } from "@tanstack/react-query";
import { getReportEmployeeSummary } from "./api";
import { ReportEmployeeSummaryRequest } from "./type";

export function useGetReportEmployeeSummaryQuery(params: ReportEmployeeSummaryRequest) {
    return useQuery({
        queryKey: [
            ['limit', params.limit],
            ['page', params.page],
        ],
        queryFn: () => getReportEmployeeSummary(params)
    });
}