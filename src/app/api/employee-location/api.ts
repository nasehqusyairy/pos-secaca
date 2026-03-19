import apiClientStore from "../apiClientStore";

export function getEmployeeLocations(limit: number) {
  return apiClientStore.get(`/api/kasir/employee_locations?limit=${limit}`);
}
