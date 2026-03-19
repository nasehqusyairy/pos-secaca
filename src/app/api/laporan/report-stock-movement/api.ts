import apiClientV2 from "../../apiClientV2";
import { ReportStockMovementRequest } from "./type";

export function getReportStockMovement(params: ReportStockMovementRequest) {
    return apiClientV2.get(`/api/backoffice/report/report_stock_movement`, { params })
}