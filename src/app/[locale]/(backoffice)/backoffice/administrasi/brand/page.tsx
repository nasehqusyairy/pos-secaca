"use client"

import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import { brandColumnShow, brandsColumns } from "@/app/[locale]/(backoffice)/backoffice/administrasi/brand/column";
import { FC, useState } from "react";
import { BrandTable } from "./table";
import FormBrandPage from "./form";
import { Brand } from "@/app/api/brand/brand";

interface BrandPageProps {}
 
const BrandPage: FC<BrandPageProps> = () => {
    const [showForm, setShowForm] = useState(true);

    const data: Brand[] = [
        {
            id: 1,
            name: 'Brand 1',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Brand 2',
            status: 'Active',
        },
        {
            id: 1,
            name: 'Brand 1',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Brand 2',
            status: 'Active',
        },
    ]

    function handleEdit() {
        setShowForm(true);
    }

    function handleDelete() {
    }

    const columns = brandsColumns({ onEdit: handleEdit, onDelete: handleDelete });

    if (showForm) {
        return (
            <FormBrandPage />
        )
    }

    return ( 
        <>
            <div>
                <PageTitleSetting title="Brand" subtitle="Manage your brand here"></PageTitleSetting>
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
                <BrandTable columnShow={brandColumnShow} columns={columns} data={data}/>
            </div>
        </>
     );
}
 
export default BrandPage;