"use client"

import { useGetRolesQuery } from "@/app/api/roles/queries";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";
import React, { FC, useState } from "react";
import { RolesColumns, RolesColumnShow } from "./column";
import { RolesTable } from "./table";
import RolesFormPage from "./form";
import { useDeleteRolesMutation } from "@/app/api/roles/mutation";
import { showConfirmationDeletePermanentAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { Roles } from "@/app/api/roles/type";

interface RolePageProps {}
 
const RolePage: FC<RolePageProps> = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingData, setEditingData] = useState<Roles | null>(null);
    
    const {data, isPending, refetch} = useGetRolesQuery()
    const deleteRole = useDeleteRolesMutation();

    function handleEdit(row: Roles) {
        setEditingData(row);
        setShowForm(true);
    }

    function handleDelete(row: Roles) {
        showConfirmationDeletePermanentAlert(row.name, () => {
            deleteRole.mutate(row.id, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Hapus Role");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Hapus Role");
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

    const columns = RolesColumns({ onEdit: handleEdit, onDelete: handleDelete });

    if (isPending) {
        return  (
        <div>
                <PageTitleSetting title="Role" subtitle="Atur Role"></PageTitleSetting>
                <SkeletonDataTable />
            </div>);
    }


    if (showForm) {
        return (
            <>
                <div className="mb-20">
                    <PageTitleSetting title="Form Role" subtitle="Atur Role"></PageTitleSetting>
                </div>
                <RolesFormPage data={editingData} refetch={refetch} onHiddenForm={onCloseShowForm}/>
            </>)
    }

    return ( 
        <>
            <div>
                <PageTitleSetting title="Role" subtitle="Atur Role"></PageTitleSetting>
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
                <RolesTable columnShow={RolesColumnShow} columns={columns} data={data?.data} onAdd={onOpenShowForm}/>
            </div>
            
        </>
     );
}
 
export default RolePage;