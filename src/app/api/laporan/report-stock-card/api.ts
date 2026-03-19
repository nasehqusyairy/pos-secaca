import apiClientV2 from "../../apiClientV2";
import { ReportStockCardRequest } from "./type";

export function getReportStockCard(params: ReportStockCardRequest) {
    return apiClientV2.get(`/api/backoffice/report/report_stock_card`, { params })
}