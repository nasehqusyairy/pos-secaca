"use client"

import { useDeleteEmployeeMutation } from "@/app/api/karyawan/mutation";
import { useGetEmployeesQuery } from "@/app/api/karyawan/queries";
import { showConfirmationDeletePermanentAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { FC, useState } from "react";
import { EmployeeColumns, EmployeeColumnShow } from "./column";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";
import { EmployeeTable } from "./table";
import FormEmployeePage from "./form";
import { Employee } from "@/app/api/karyawan/type";

interface PenggunaPageProps {}
 
const PenggunaPage: FC<PenggunaPageProps> = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingData, setEditingData] = useState<Employee | null>(null);
    
    const {data, isPending, refetch} = useGetEmployeesQuery()
    const deleteEmployee = useDeleteEmployeeMutation();

    function handleEdit(row: Employee) {
        setEditingData(row);
        setShowForm(true);
    }

    function handleDelete(row: Employee) {
        const name = `${row.first_name} ${row.last_name}`;
        showConfirmationDeletePermanentAlert(name, () => {
            const id = row.id ?? 0;

            deleteEmployee.mutate(id, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Delete Karyawan");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Delete Karyawan");
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

    const columns = EmployeeColumns({ onEdit: handleEdit, onDelete: handleDelete });

    if (isPending) {
        return  (
        <div>
                <PageTitleSetting title="Karyawan" subtitle="Atur Karyawan"></PageTitleSetting>
                <SkeletonDataTable />
            </div>);
    }


    if (showForm) {
        return (
            <>
                <div className="mb-20">
                    <PageTitleSetting title="Form Karyawan" subtitle="Atur Karyawan"></PageTitleSetting>
                </div>
                <FormEmployeePage data={editingData} refetch={refetch} onHiddenForm={onCloseShowForm}/>
            </>)
    }

    const dataEmploye = data?.data ?? []
    
    return ( 
        <>
            <div>
                <PageTitleSetting title="Karyawan" subtitle="Atur Karyawan"></PageTitleSetting>
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
                <EmployeeTable columnShow={EmployeeColumnShow} columns={columns} data={dataEmploye} onAdd={onOpenShowForm}/>
            </div>
            
        </>
     );
}
 
export default PenggunaPage;