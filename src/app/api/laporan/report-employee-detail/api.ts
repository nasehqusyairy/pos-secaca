import apiClientV2 from "../../apiClientV2";
import { ReportEmployeeDetailRequest } from "./type";
import { endOfDay, format, startOfDay } from "date-fns";

export function getReportEmployeeDetail(params: ReportEmployeeDetailRequest) {
    const param = {
        ...params,
        start_at: format(startOfDay(params.start_at ?? new Date), 'yyyy-MM-dd HH:mm:ss'),
        end_at: format(endOfDay(params.end_at ?? new Date), 'yyyy-MM-dd HH:mm:ss'),
    }

    return apiClientV2.get(`/api/backoffice/report/report_employee_detail`, { params: param })
}