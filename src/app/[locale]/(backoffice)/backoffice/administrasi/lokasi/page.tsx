"use client";

import PageTitleSetting from "@/components/molecules/settings/PageTitleSetting";
import {
  LocationColumns,
  locationColumnShow,
} from "@/app/[locale]/(backoffice)/backoffice/administrasi/lokasi/column";
import React, { FC, useState } from "react";
import { LocationTable } from "./table";
import FormLocationPage from "./form";
import { useGetLocationQuery } from "@/app/api/locations/queries";
import SkeletonDataTable from "@/components/organisms/Skeleton/SkeletonDataTable";
import { useUpdateLocationMutation } from "@/app/api/locations/mutation";
import {
  showConfirmationDeleteAlert,
  showToastError,
  showToastSuccess,
} from "@/components/templates/SweetAlert";
import { Locations } from "@/app/api/locations/type";

interface LokasiPageProps {}

const LokasiPage: FC<LokasiPageProps> = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<Locations | null>(null);

  const { data, isPending, refetch } = useGetLocationQuery(100);
  const updateLocation = useUpdateLocationMutation();

  function handleEdit(row: Locations) {
    setEditingData(row);
    setShowForm(true);
  }

  function handleDelete(row: Locations) {
    showConfirmationDeleteAlert(row.name, row.status, () => {
      const values = {
        id: row.id,
        status: row.status === "active" ? "archived" : "active",
      } as Locations;

      updateLocation.mutate(values, {
        onSuccess: () => {
          showToastSuccess("Berhasil Update Location");
          refetch();
        },
        onError: () => {
          showToastError("Gagal Update Location");
        },
      });
    });
  }

  function onOpenShowForm() {
    setShowForm(true);
    setEditingData(null);
  }

  function onCloseShowForm() {
    setShowForm(false);
    setEditingData(null);
  }

  const columns = LocationColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  if (isPending) {
    return (
      <div>
          <PageTitleSetting
            title="Location"
            subtitle="Atur Location"
          ></PageTitleSetting>
          <SkeletonDataTable />
        </div>
    );
  }

  if (showForm) {
    return (
      <>
        <div className="mb-20">
          <PageTitleSetting
            title="Form Location"
            subtitle="Atur Location"
          ></PageTitleSetting>
        </div>
        <FormLocationPage
          data={editingData}
          refetch={refetch}
          onHiddenForm={onCloseShowForm}
        />
      </>
    );
  }

  return (
    <>
      <div>
        <PageTitleSetting
          title="Location"
          subtitle="Atur Location"
        ></PageTitleSetting>
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
        <LocationTable
          columnShow={locationColumnShow}
          columns={columns}
          data={data?.data}
          onAdd={onOpenShowForm}
        />
      </div>
    </>
  );
};

export default LokasiPage;
