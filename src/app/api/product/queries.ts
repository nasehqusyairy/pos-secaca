
import { useQuery } from "@tanstack/react-query";
import { getProductUnit } from "./product-unit/api";
import { getProductCategory } from "./product-category/api";
import { getProductByBarcode, getProductByKeyword, getProducts, getProductStockOne, getProductStocks, getProductsWithPaging } from "./api";
import { getProductTransfer, getProductTransfers } from "./product-transfers/api";
import { getProductOpname, getProductOpnameDetail, getProductOpnamePreview } from "./product-opname/api";
import { getAllCashierProduct, getCashierProduct } from "./kasir-product/api";
import { GetProductAdjustmentStockQueryRequest, GetProductRequest, GetProductStockRequest } from "./type";
import { getProductAdjustmentStock, getProductAdjustmentStockDetail } from "./product-adjustment-stock/api";
import { GetTransferProductRequest } from "./product-transfers/type";
import { GetProductOpnamePreviewRequest, GetProductStockOpnameQueryRequest } from "./product-opname/type";

// Product unit
export function useGetProductUnitQuery(limit: number) {
    return useQuery({
        queryKey: ['productUnit', limit],
        queryFn: () => getProductUnit(limit)
    })
}

// Product Category
export function useGetProductCategoryQuery(limit: number) {
    return useQuery({
        queryKey: ['productCategory', limit],
        queryFn: () => getProductCategory(limit)
    })
}

// Products
export function useGetProductsQuery(limit: number) {
    return useQuery({
        queryKey: ['products-index'],
        queryFn: () => getProducts(limit)
    })
}

export function useGetProductsQueryWithPaging(params: GetProductRequest) {
    return useQuery({
        queryKey: ['products-index-with-paging'],
        queryFn: () => getProductsWithPaging(params)
    })
}

export function useGetProductByKeywordQuery(limit: number, keyword: string) {
    return useQuery({
        queryKey: ['products', keyword],
        queryFn: () => getProductByKeyword(limit, keyword),
        enabled: !!keyword
    })
}

export function useGetProductByBarcodeQuery(limit: number, keyword: string) {
    return useQuery({
        queryKey: ['products-by-barcode', keyword],
        queryFn: () => getProductByBarcode(limit, keyword),
        enabled: !!keyword
    })
}

// Product Transfer
export function useGetProductTransfersQuery(param: GetTransferProductRequest) {
    return useQuery({
        queryKey: ['productTransfers'],
        queryFn: () => getProductTransfers(param)
    })
}

export function useGetProductTransferQuery(id: string) {
    return useQuery({
        queryKey: ['productTransfer', id],
        queryFn: () => getProductTransfer(id),
        enabled: !!id
    })
}

// Product Opname
export function useGetProductOpnameQuery(param: GetProductStockOpnameQueryRequest) {
    return useQuery({
        queryKey: [
            'productOpname',
            ['page', param.page],
        ],
        queryFn: () => getProductOpname(param)
    })
}

export function useGetProductOpnameDetailQuery(id: string) {
    return useQuery({
        queryKey: ['getProductOpname', id],
        queryFn: () => getProductOpnameDetail(id)
    })
}

export function useGetProductOpnamePreviewQuery(param: GetProductOpnamePreviewRequest) {
    return useQuery({
        queryKey: [['getProductOpnamePreview', param.id], ['page', param.page]],
        enabled: !!param.id,
        queryFn: () => getProductOpnamePreview(param)
    })
}

// Product Stock Adjustment
export function useGetProductAdjustmentStockQuery(param: GetProductAdjustmentStockQueryRequest) {
    return useQuery({
        queryKey: [
            'productAdjustmentStock',
            ['page', param.page],
        ],
        queryFn: () => getProductAdjustmentStock(param)
    })
}

export function useGetProductAdjustmentStockDetailQuery(id: string) {
    return useQuery({
        queryKey: ['getProductOpname', id],
        queryFn: () => getProductAdjustmentStockDetail(id)
    })
}

// Products
export function useGetProductStockQuery(params: GetProductStockRequest) {
    return useQuery({
        queryKey: [['product', params.product], ['product_unit', params.product_unit], ['location', params.location]],
        retry: false,
        queryFn: () => getProductStockOne(params),
        enabled: !!params.product
    })
}

// Cashier - Product
export function useGetCashierProductQuery(limit: number, loc_id: number) {
    return useQuery({
        queryKey: ['cashierProduct', loc_id],
        queryFn: async () => {
            const response = await getAllCashierProduct(limit, loc_id);

            if (!response) {
                return []
            }

            return response?.data;
        },
        enabled: loc_id !== 0
    })
}

export function useGetCashierProductDetailQuery(id: number) {
    return useQuery({
        queryKey: ['cashierProductDetail', id],
        queryFn: async () => {
            const response = await getCashierProduct(id);

            if (!response) {
                return null;
            }

            return response.data;
        },
        enabled: id !== 0
    })
}

