import apiClientV2 from "../apiClientV2";
import { EmployeeDropdownGetQuery } from "./type";

export function getLocations(limit: number, pageParam: string, keyword: string) {
  const params = {
    limit: limit,
    cursor: pageParam,
    keyword: keyword,
  }

  return apiClientV2.get(`/api/backoffice/locations-dropdown`, { params });
}

export function getCustomerCategories(limit: number, pageParam: string, keyword: string) {
  const params = {
    limit: limit,
    cursor: pageParam,
    keyword: keyword,
  }

  return apiClientV2.get(`/api/backoffice/customer_categories-dropdown`, { params });
}

export function getProducts(limit: number, pageParam: string, keyword: string, exclude_ids: number[]) {
  const params = {
    limit: limit,
    cursor: pageParam,
    keyword: keyword,
    selected_ids: exclude_ids,
  }

  return apiClientV2.get(`/api/backoffice/products-dropdown`, { params });
}

export function getEmployees(params: EmployeeDropdownGetQuery) {
  return apiClientV2.get(`/api/backoffice/employees-dropdown`, { params });
}

export function getProductCategories(limit: number, pageParam: string, keyword: string, exclude_ids: number[]) {
  const params = {
    limit: limit,
    cursor: pageParam,
    keyword: keyword,
    selected_ids: exclude_ids,
  }

  return apiClientV2.get(`/api/backoffice/product_categories-dropdown`, { params });
}
