"use client"

import { useGetPaymentMethodQuery } from "@/app/api/payment-method/queries";
import React, { FC, useState } from "react";
import { PaymentMethodColumns, paymentMethodColumnShow } from "./column";
import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";
import { PaymentMethodTable } from "./table";
import FormPaymentMethodPage from "./form";
import { useUpdatePaymentMethodMutation } from "@/app/api/payment-method/mutation";
import { showConfirmationDeleteAlert, showToastError, showToastSuccess } from "@/components/templates/SweetAlert";
import { PaymentMethods } from "@/app/api/payment-method/type";

interface MetodePemabayaranPageProps {
    
}
 
const MetodePemabayaranPage: FC<MetodePemabayaranPageProps> = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingData, setEditingData] = useState<PaymentMethods | null>(null);
    
    const {data, isPending, refetch} = useGetPaymentMethodQuery()
    const updatePaymentMethod = useUpdatePaymentMethodMutation();

    function handleEdit(row: PaymentMethods) {
        setEditingData(row);
        setShowForm(true);
    }

    function handleDelete(row: PaymentMethods) {
        showConfirmationDeleteAlert(row.name, row.status, () => {
            const values = {
                id: row.id,
                status: row.status === 'active' ? 'archived' : 'active'
            } as PaymentMethods;

            updatePaymentMethod.mutate(values, {
                onSuccess: () => {
                    showToastSuccess("Berhasil Update Metode pembayaran");
                    refetch();
                },
                onError: () => {
                    showToastError("Gagal Update Metode pembayaran");
                }
            });
        })
    }

    function onOpenShowForm() {
        setShowForm(true);
    }

    function onCloseShowForm() {
        setShowForm(false);
    }

    const columns = PaymentMethodColumns({ onEdit: handleEdit, onDelete: handleDelete });

    if (isPending) {
        return  (
        <div>
                <PageTitleSetting title="Metode pembayaran" subtitle="Atur Metode pembayaran"></PageTitleSetting>
                <SkeletonDataTable />
            </div>);
    }


    if (showForm) {
        return (
            <>
                <div className="mb-20">
                    <PageTitleSetting title="Form Metode pembayaran" subtitle="Atur Metode pembayaran"></PageTitleSetting>
                </div>
                <FormPaymentMethodPage data={editingData} refetch={refetch} onHiddenForm={onCloseShowForm}/>
            </>)
    }

    return ( 
        <>
            <div>
                <PageTitleSetting title="Metode pembayaran" subtitle="Atur Metode pembayaran"></PageTitleSetting>
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
                <PaymentMethodTable columnShow={paymentMethodColumnShow} columns={columns} data={data?.data} onAdd={onOpenShowForm}/>
            </div>
            
        </>
     );
}
 
export default MetodePemabayaranPage;