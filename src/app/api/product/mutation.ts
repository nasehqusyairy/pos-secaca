import { useMutation } from "@tanstack/react-query";
import { createProductUnit, updateProductUnit } from "./product-unit/api";
import { createProductCategory, updateProductCategory } from "./product-category/api";
import { createProduct, createProductImport, exportProduct, updateProduct, uploadFileProduct } from "./api";
import { approveProductTransfer, createProductTransfer, rejectProductTransfer, updateProductTransfer } from "./product-transfers/api";
import { createProductOpname, deleteProductOpname, newUpdateProductOpname, updateProductOpname } from "./product-opname/api";
import { ProductUnits } from "./product-unit/type";
import { ProductCategories } from "./product-category/type";
import { GetProductRequest, Product } from "./type";
import { TransferProductRequest } from "./product-transfers/type";
import { ParamsProductOpname, ProductOpnameRequest } from "./product-opname/type";
import { createProductAdjustmentStock, deleteProductAdjustmentStock, updateProductAdjustmentStock } from "./product-adjustment-stock/api";
import { ProductAdjustmentStockRequest } from "./product-adjustment-stock/type";

// Product unit
export function useCreateProductUnitMutation() {
    return useMutation({
        mutationKey: ['add', 'productUnit'],
        mutationFn: (params: ProductUnits) => createProductUnit(params)
    })
}

export function useUpdateProductUnitMutation() {
    return useMutation({
        mutationKey: ['update', 'productUnit'],
        mutationFn: (params: ProductUnits) => updateProductUnit(params)
    })
}

// Product Category
export function useCreateProductCategoryMutation() {
    return useMutation({
        mutationKey: ['add', 'productCategory'],
        mutationFn: (params: ProductCategories) => createProductCategory(params)
    })
}

export function useUpdateProductCategoryMutation() {
    return useMutation({
        mutationKey: ['update', 'productCategory'],
        mutationFn: (params: ProductCategories) => updateProductCategory(params)
    })
}

// Product Import
export function useUploadFileProductMutation() {
    return useMutation({
        mutationKey: ['upload', 'product'],
        mutationFn: (data: any) => uploadFileProduct(data)
    })
}

// Create Product Import
export function useCreateProductImportMutation() {
    return useMutation({
        mutationKey: ['product-import', 'create'],
        mutationFn: (data: any) => createProductImport(data)
    })
}

// Product
export function useCreateProductMutation() {
    return useMutation({
        mutationKey: ['add', 'product'],
        mutationFn: (params: Product) => createProduct(params)
    })
}

export function useUpdateProductMutation() {
    return useMutation({
        mutationKey: ['update', 'product'],
        mutationFn: (params: Product) => updateProduct(params)
    })
}

export function useExportProductMutation() {
    return useMutation({
        mutationKey: ['export', 'product'],
        mutationFn: (params: GetProductRequest) => exportProduct(params)
    })
}

// Product Transfer
export function useUpdateProductTransferMutation() {
    return useMutation({
        mutationKey: ['update', 'productTransfer'],
        mutationFn: (params: TransferProductRequest) => updateProductTransfer(params)
    })
}

export function useCreateProductTransferMutation() {
    return useMutation({
        mutationKey: ['add', 'productTransfer'],
        mutationFn: (params: TransferProductRequest) => createProductTransfer(params)
    })
}

export function useApproveProductTransferMutation() {
    return useMutation({
        mutationKey: ['approve', 'productTransfer'],
        mutationFn: (params: { id: number, notes: string }) => approveProductTransfer(params.id, params.notes)
    })
}

export function useRejectProductTransferMutation() {
    return useMutation({
        mutationKey: ['reject', 'productTransfer'],
        mutationFn: (params: { id: number, notes: string }) => rejectProductTransfer(params.id, params.notes)
    })
}

// Product Opname
export function useUpdateProductTOpnameMutation() {
    return useMutation({
        mutationKey: ['update', 'productOpname'],
        mutationFn: (params: ParamsProductOpname) => updateProductOpname(params)
    })
}

export function useUpdateProductOpnameMutation() {
    return useMutation({
        mutationKey: ['update-new', 'productOpname'],
        mutationFn: (params: ProductOpnameRequest) => newUpdateProductOpname(params)
    })
}

export function useCreateProductOpnameMutation() {
    return useMutation({
        mutationKey: ['add', 'productOpname'],
        mutationFn: (params: ProductOpnameRequest) => createProductOpname(params)
    })
}

export function useDeleteProductOpnameMutation() {
    return useMutation({
        mutationKey: ['delete', 'productOpname'],
        mutationFn: (id: number) => deleteProductOpname(id)
    })
}

// Product adjustment stock
export function useUpdateProductAdjustmentStockMutation() {
    return useMutation({
        mutationKey: ['update', 'productAdjustmentStock'],
        mutationFn: (params: ParamsProductOpname) => updateProductAdjustmentStock(params)
    })
}

export function useCreateProductAdjustmentStockMutation() {
    return useMutation({
        mutationKey: ['add', 'productAdjustmentStock'],
        mutationFn: (params: ProductAdjustmentStockRequest) => createProductAdjustmentStock(params)
    })
}

export function useDeleteProductAdjustmentStockMutation() {
    return useMutation({
        mutationKey: ['delete', 'productAdjustmentStock'],
        mutationFn: (id: number) => deleteProductAdjustmentStock(id)
    })
}