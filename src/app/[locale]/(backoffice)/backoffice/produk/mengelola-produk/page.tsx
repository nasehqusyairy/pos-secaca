"use client"

import React, { FC, useEffect, useState } from "react";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { ProductColumns, ProductColumnShow } from "./column";
import { ProductTable } from "./table";
import { useGetProductsQueryWithPaging } from "@/app/api/product/queries";
import FormProductPage from "./form";
import { showConfirmationDeleteAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { useExportProductMutation, useUpdateProductMutation } from "@/app/api/product/mutation";
import { GetProductRequest, Product } from "@/app/api/product/type";

interface ManageProductsPageProps {}
 
const ManageProductsPage: FC<ManageProductsPageProps> = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingData, setEditingData] = useState<Product | null>(null);

    const [keyword, setKeyword] = useState<string>('');
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const [selectAllProductCategory, setSelectAllLocation] = useState<boolean>(true)
    const [productCategoryIds, setProductCategoryIds] = useState<number[]>([]);
    const [excludeProductCategoryIds, setExcludeProductCategoryIds] = useState<number[]>([]);
    const params = {
        limit,
        page,
        keyword,
        selectAllProductCategory,
        productCategoryIds,
        excludeProductCategoryIds,
    }

    const {data, isFetching, isPending, refetch} = useGetProductsQueryWithPaging(params)

    const updateProduct = useUpdateProductMutation();
    const exportProduct = useExportProductMutation();

    function handleEdit(row: Product) {
        setEditingData(row);
        setShowForm(true);
    }

    useEffect(() => {
        handleRefetch()
    }, [page, selectAllProductCategory, productCategoryIds, excludeProductCategoryIds])

    useEffect(() => {
        if (page > 1) {
            setPage(1)
        } else {
            handleRefetch()
        }
    }, [limit, keyword])

    function handleDelete(row: Product) {
        showConfirmationDeleteAlert(row.name, row.status, () => {
            const values = {
                ...row,
                id: row.id,
                status: row.status === 'active' ? 'archived' : 'active'
            } as unknown as Product;

            updateProduct.mutate(values, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Produk");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Update Produk");
                }
            });
        })
    }

    function onOpenShowForm() {
        setEditingData(null);
        setShowForm(true);
    }

    function onCloseShowForm() {
        setEditingData(null);
        setShowForm(false);
    }

    const handleRefetch = () => {
        refetch()
    }

    const handleExport = () => {
        if (exportProduct.isPending) return

        exportProduct.mutate(params)
    }

    const columns = ProductColumns({ onEdit: handleEdit, onDelete: handleDelete });
    if (showForm) {
        return (
            <>
                <div className="mb-20">
                    <PageTitleSetting title="Form Produk" subtitle="Atur Produk disini"></PageTitleSetting>
                </div>
                <FormProductPage data={editingData} refetch={refetch} onHiddenForm={onCloseShowForm}/>
            </>)
    }

    return ( 
        <>
            <div>
                <PageTitleSetting title="Produk" subtitle="Atur Produk disini"></PageTitleSetting>
            </div>
            <div className="container mx-auto">
                {
                    <ProductTable
                        detailData={data?.data}
                        onSetLimit={setLimit}
                        onSetPage={setPage}
                        isPending={isFetching || isPending}
                        columnShow={ProductColumnShow}
                        columns={columns}
                        data={data?.data.data}
                        onSetKeyword={setKeyword}
                        onAdd={onOpenShowForm}
                        onRefetch={handleRefetch}
                        onExport={handleExport}
                        onSetSelectAllProductCategory={setSelectAllLocation}
                        onSetProductCategoryIds={setProductCategoryIds}
                        onSetExcludeProductCategoryIds={setExcludeProductCategoryIds}
                    />
                }
            </div>
        </>
     );
}
 
export default ManageProductsPage;