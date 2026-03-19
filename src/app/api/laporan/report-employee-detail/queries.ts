import { useQuery } from "@tanstack/react-query";
import { getReportEmployeeDetail } from "./api";
import { ReportEmployeeDetailRequest } from "./type";

export function useGetReportEmployeeDetailQuery(params: ReportEmployeeDetailRequest) {
    return useQuery({
        queryKey: [
            ['limit', params.limit],
            ['page', params.page],
        ],
        queryFn: () => getReportEmployeeDetail(params)
    });
}