export type EmployeeDropdownGetQuery = {
    limit: number,
    cursor: string,
    keyword: string,
    exclude_ids?: number[],
    roles?: number[],
    loc_id?: number,
};