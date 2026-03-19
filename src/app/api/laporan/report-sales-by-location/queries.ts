import { useQuery } from "@tanstack/react-query";
import { getReportSalesByLocation } from "./api";
import { ReportSalesByLocationRequest } from "./type";

export function useGetReportSalesByLocationQuery(params: ReportSalesByLocationRequest) {
    return useQuery({
        queryKey: [
            ['limit', params.limit],
            ['page', params.page],
        ],
        queryFn: () => getReportSalesByLocation(params)
    });
}