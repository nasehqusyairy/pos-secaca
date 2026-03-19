import apiClientV2 from "../../apiClientV2";
import { ReportSalesByLocationRequest } from "./type";

export function getReportSalesByLocation(params: ReportSalesByLocationRequest) {
    return apiClientV2.get(`/api/backoffice/report/report_sales_by_location`, { params })
}