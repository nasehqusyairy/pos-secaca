import apiClient from "../apiClient";
import apiClientDownload from "../apiClientDownload";
import apiClientV2 from "../apiClientV2";
import { GetProductStockOneQueryRequest, GetProductStockOpnameQueryRequest } from "./product-opname/type";
import { GetProductRequest, GetProductStockRequest, Product } from "./type";

export function uploadFileProduct(data: any) {
    return apiClient.post(`/api/backoffice/product_import_services/upload`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export function createProductImport(data: any) {
    return apiClient.post('/api/backoffice/product_import_services', data);
}

export function getProducts(limit: number) {
    return apiClient.get(`/api/backoffice/products?limit=${limit}`);
}

export function getProductsWithPaging(params: GetProductRequest) {
    return apiClientV2.get('/api/backoffice/products', { params });
}

export async function getProductByKeyword(limit: number, keyword: string) {
    return await apiClient.get(`/api/backoffice/products?limit=${limit}&search=${keyword}&keyword=${keyword}`);
}

export async function getProductByBarcode(limit: number, keyword: string) {
    const params = {
        limit,
        keyword,
        barcode_mode: true,
    }

    return await apiClient.get('/api/backoffice/products', { params });
}

export function createProduct(data: Product) {
    return apiClient.post(`/api/backoffice/products`, data);
}

export function updateProduct(data: Product) {
    return apiClient.put(`/api/backoffice/products/${data.id}`, data);
}

export function exportProduct(param: GetProductRequest) {
    const params = {
        ...param,
        file_name: `product_${new Date().getTime()}.csv`,
    }

    return apiClientDownload.get(`/api/backoffice/product-export`, { params });
}

export function getProductStocks(params: GetProductStockOpnameQueryRequest) {
    return apiClient.get(`/api/backoffice/product-stocks`, { params });
}

export function getProductStockOne(params: GetProductStockRequest) {
    return apiClient.get(`/api/backoffice/product-stocks`, { params });
}