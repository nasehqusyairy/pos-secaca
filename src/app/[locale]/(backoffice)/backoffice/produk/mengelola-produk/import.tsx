"use client"

import { FC, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CustomUploadFileImport from "@/components/molecules/UploadFileImport";
import { fileUploadProductSchema } from "@/app/api/product/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useCreateProductImportMutation, useUploadFileProductMutation } from "@/app/api/product/mutation";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";

interface ImportProdukProps {
  onClose: () => void;
}

const ImportProduk: FC<ImportProdukProps> = ({
  onClose
}) => {
  const [fileUpload, setFileUpload] = useState('')
  const [errorFileUpload, setErrorFileUpload] = useState('')

  const createProductImport = useCreateProductImportMutation();
  const uploadFile = useUploadFileProductMutation();

  const form = useForm<z.infer<typeof fileUploadProductSchema>>({
    resolver: zodResolver(fileUploadProductSchema),
  });

  const handleFileChange = (file: string) => {
    if (uploadFile.isPending) {
      setErrorFileUpload('')
      return;
    }

    if (!form.getValues('file')) {
      setErrorFileUpload('File tidak ditemukan')
      return;
    }

    if (!file) {
      setErrorFileUpload('File tidak ditemukan')
      return;
    }

    const formFile = form.getValues('file');
    if (!formFile || formFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setErrorFileUpload('Format file harus xlsx')
      return;
    }

    const body = {
      file: formFile,
    }

    uploadFile.mutate(body, {
      onSuccess: ({data}) => {
        setFileUpload(data)
      },
      onError: (error) => {
        setErrorFileUpload(error.message)
      }
    })
  }

  const onSubmit = (val: z.infer<typeof fileUploadProductSchema>) => {
    if (createProductImport.isPending) return;

    if (form.getValues('file')) {
      const file = form.getValues('file');
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return;
      }

      const body = {
        file_url: fileUpload,
        extension: 'xlsx',
        note: 'Import Produk',
        auto_approve: true
      }

      createProductImport.mutate(body, {
        onSuccess: () => {
          showToastSuccess("Berhasil Import Product");
          // dialog close
          onClose();
        },
        onError: () => {
          showToastError("Gagal Import Product");
          // dialog close
          onClose();
        }
      })
    }
  };


  return (
    <DialogContent className="w-[500px] bg-white">
      <DialogHeader>
        <DialogTitle>Import Produk</DialogTitle>
        <DialogDescription>
          Menambahkan banyak data produk dengan lebih mudah.

          <br /><br />
          Silahkan 
          <a href="/templates/template-product.xlsx" download="Template">
            <Button variant="link" size={'sm'}>
              <span className="font-bold">Download Template</span>
            </Button>
          </a> 

          terlebih dahulu dan perhatikan untuk mengisi data sesuai ketentuan untuk memastikan data dapat dibaca dengan benar
        </DialogDescription>
      </DialogHeader>
      <div className="flex">
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CustomUploadFileImport form={form} name="file" uploadError={errorFileUpload} onFileChange={handleFileChange} />
            {errorFileUpload && <p className="text-red-500 mt-2">{errorFileUpload}</p>}
            <Button
              disabled={errorFileUpload != ''}
              className="w-full mt-4">
              {createProductImport.isPending ? 'Processing...' : 'Import Data'}
            </Button>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}

export default ImportProduk;