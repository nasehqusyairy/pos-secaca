import apiClientV2 from "../../apiClientV2";
import { ReportSalesRequest } from "./type";

export function getReportSales(params: ReportSalesRequest) {
    return apiClientV2.get(`/api/backoffice/report/report_sales`, { params })
}