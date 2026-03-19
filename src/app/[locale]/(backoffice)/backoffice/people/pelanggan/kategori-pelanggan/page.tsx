"use client"

import { useGetCustomerCategoriesQuery } from "@/app/api/people/pelanggan/kategori-pelanggan/queries";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { FC, useState } from "react";
import { CustomerCategoryColumns, CustomerCategoryColumnShow } from "./column";
import { CustomerCategoryTable } from "./table";
import { useRouter } from 'next/navigation'
import { useActivateCustomerCategoryMutation, useArchiveCustomerCategoryMutation } from "@/app/api/people/pelanggan/kategori-pelanggan/mutation";
import { showConfirmationDeleteAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { Button } from "@/components/ui/button"
import HeaderTable from "@/components/organisms/HeaderTable"
import { Input } from "@/components/ui/input"
import { IoMdAdd } from "react-icons/io"
import FooterTableServer from "@/components/organisms/FooterTableServer";
import SkeletonSimple from "@/components/organisms/Skeleton/SkeletonSimple";
import { CustomerCategories } from "@/app/api/people/pelanggan/kategori-pelanggan/type";

interface CustomerKategoriPageProps {}

const CustomerKategoriPage: FC<CustomerKategoriPageProps> = <TData, TValue>() => {
    const router = useRouter();

    const [keyword, seKeyword] = useState<string>('');
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const { data, isFetching, refetch } = useGetCustomerCategoriesQuery({ search: keyword, limit: limit, page: page });

    const activateCustomerCategory = useActivateCustomerCategoryMutation();
    const archiveCustomerCategory = useArchiveCustomerCategoryMutation();

    const handleEdit = function (data: CustomerCategories) {
        // TODO: Change later
        router.replace(`/id/backoffice//people/pelanggan/kategori-pelanggan/${data.id}`, {})
        // router.push(`/id/backoffice//people/pelanggan/kategori-pelanggan/${data.id}`)
    }

    const handleArchive = function (data: CustomerCategories) {
        showConfirmationDeleteAlert(data.name, data.status || '', () => {
            archiveCustomerCategory.mutate(data.id, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Archive kategori pelanggan");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Archive kategori pelanggan");
                }
            });
        })
    }

    const handleActivate = function (data: CustomerCategories) {
        showConfirmationDeleteAlert(data.name, data.status || '', () => {
            activateCustomerCategory.mutate(data.id, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Activate kategori pelanggan");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Activate kategori pelanggan");
                }
            });
        })
    }

    const handleAdd = function () {
        // TODO: Change later
        router.push('/id/backoffice//people/pelanggan/kategori-pelanggan/create')
    }

    const columns = CustomerCategoryColumns({ onEdit: handleEdit, onArchive: handleArchive, onActivate: handleActivate })

    return (
        <>
            <div>
                <PageTitleSetting title="Kategori pelanggan" subtitle="Atur kategori pelanggan"></PageTitleSetting>
            </div>
            <div className="container mx-auto py-10">
                <HeaderTable url={''}>
                    <Input
                        placeholder="Filter name..."
                        // value={keyword}
                        onBlur={(event) => seKeyword(event.target.value)}
                        className="max-w-sm"
                    />
                </HeaderTable>

                <div className="my-4 flex justify-between">
                    <Button variant="default" onClick={handleAdd}>
                        <IoMdAdd className="mr-2" /> Tambah
                    </Button>
                </div>

                {
                    isFetching ?
                        <SkeletonSimple />
                        :
                        <CustomerCategoryTable
                            columnShow={CustomerCategoryColumnShow}
                            columns={columns}
                            data={data?.data.data}
                            isFetching={isFetching}
                            rowCount={data?.data.total}
                            setPageSize={setLimit}
                        />
                }
                <FooterTableServer
                    rowCount={data?.data.total}
                    currentPage={data?.data.currentPage}
                    lastPage={data?.data.lastPage}
                    hasPrev={data?.data.hasPrev}
                    hasNext={data?.data.hasNext}
                    setPageSize={setLimit}
                    setPage={setPage}
                />
            </div>
        </>
    );
}

export default CustomerKategoriPage;