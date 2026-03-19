"use client"

import { useGetProductCategoryQuery } from "@/app/api/product/queries";
import React, { FC, useState } from "react";
import { ProductCategoryColumns, productCategoryColumnShow } from "./column";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";
import { ProductCategoryTable } from "./table";
import { useCreateProductCategoryMutation, useUpdateProductCategoryMutation } from "@/app/api/product/mutation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductCategoryFormSchema } from "@/app/api/product/product-category/schema";
import { showConfirmationDeleteAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCategories } from "@/app/api/catalogues/type";

interface ProdukKategoriPageProps {
    
}
 
const ProdukKategoriPage: FC<ProdukKategoriPageProps> = () => {
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
    
    const {data, isPending, refetch} = useGetProductCategoryQuery(100);
    const addProductCategory = useCreateProductCategoryMutation();
    const updateProductCategory = useUpdateProductCategoryMutation();

    const form = useForm<z.infer<typeof ProductCategoryFormSchema>>({
        resolver: zodResolver(ProductCategoryFormSchema)
    });


    function handleEdit(row: ProductCategories) {
        if (row.id !== undefined) {
            setEditingRowId(row.id);
        }
        form.setValue('name', row.name)
        form.setValue('id', row.id)
    }

    function handleDelete(row: ProductCategories) {
        showConfirmationDeleteAlert(row.name, row.status, () => {
            const values = {
                id: row.id,
                status: row.status === 'active' ? 'archived' : 'active'
            }

            updateProductCategory.mutate(values as ProductCategories, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Kategori");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Update Kategori");
                    setEditingRowId(null);
                    form.reset();
                }
            });
        })
    }

    function onSubmit(values: z.infer<typeof ProductCategoryFormSchema>) {
        if (addProductCategory.isPending || updateProductCategory.isPending) return;

        if(editingRowId == 'tambah'){
            addProductCategory.mutate(values as ProductCategories, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Create Kategori");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Create Kategori");
                    setEditingRowId(null);
                    form.reset();
                }
            });
        } else {
            updateProductCategory.mutate(values as ProductCategories, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Kategori");
                    refetch();
                    form.reset();
                    setEditingRowId(null);
                },
                onError: () => {
                    showToastError("Gagal Update Kategori");
                    setEditingRowId(null);
                    form.reset();
                }
            });
        }
    }

    function onCancel(){
        setEditingRowId(null)
        form.reset()
    }

    function onAdd() {
        setEditingRowId("tambah")
    }

    const columns = ProductCategoryColumns({ onEdit: handleEdit, onDelete: handleDelete });

    if (isPending) {
        return  (
        <div>
                <PageTitleSetting title="Kategori" subtitle="Atur Kategori"></PageTitleSetting>
                <SkeletonDataTable />
            </div>);
    }

    return ( 
        <>
            <div>
                <PageTitleSetting title="Kategori" subtitle="Atur Kategori"></PageTitleSetting>
                {/* <BreadCrumSetting data={[
                    {
                        title: 'Administrasi',
                        link: '#',
                    },
                    {
                        title: 'Brand',
                        link: '#',
                    }
                ]} /> */}
            </div>

            
            <div className="container mx-auto py-10">
                <ProductCategoryTable columnShow={productCategoryColumnShow} columns={columns} data={data?.data} editingRowId={editingRowId} onAdd={onAdd}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nama</FormLabel>
									<FormControl>
										<Input
											className="w-[450px]"
											placeholder="Masukkan nama"
											{...field}
                                            value={field.value || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
                        <div className='flex gap-4'>
						    <Button className='w-[150px]'>
                                {addProductCategory.isPending || updateProductCategory.isPending ? 'Processing...' : editingRowId == 'tambah' ? 'Tambah' : 'Update'}
                            </Button>
                            <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Batal</Button>
                        </div>
                    </form>
                </Form>
                </ProductCategoryTable>
            </div>
        </>
    )
}
 
export default ProdukKategoriPage;