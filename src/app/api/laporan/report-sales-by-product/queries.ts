import { useQuery } from "@tanstack/react-query";
import { getReportSalesByProduct } from "./api";
import { ReportSalesByProductRequest } from "./type";

export function useGetReportSalesByProductQuery(params: ReportSalesByProductRequest) {
    return useQuery({
        queryKey: [
            ['limit', params.limit],
            ['page', params.page],
        ],
        queryFn: () => getReportSalesByProduct(params)
    });
}