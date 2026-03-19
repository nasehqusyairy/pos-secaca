import apiClientV2 from "../../apiClientV2";
import { ReportSalesByProductRequest } from "./type";

export function getReportSalesByProduct(params: ReportSalesByProductRequest) {
    return apiClientV2.get(`/api/backoffice/report/report_by_products`, { params })
}