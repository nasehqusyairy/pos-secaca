"use client"

import { Button } from "@/components/ui/button"
import { FC } from "react"
import { useRouter } from "next/navigation";

interface DetailSaleTransactionPageProps {
    params: {
        id: string
    }
}

const DetailSaleTransactionPage: FC<DetailSaleTransactionPageProps> = ({
    params
}) => {
    const id = params.id;

    const router = useRouter();
    const onCancel = () => {
        router.push('..')
    };

    const styles = {
        container: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        iframe: {
          width: 'auto',
          maxWidth: '100%',
          height: '600px',
          border: 'none',
        },
      };
    const pdfUrl = process.env.NEXT_PUBLIC_API_URL + `/api/sale_transactions/${id}/pdf`

    const handlePrint = (event: any) => {
        event.preventDefault();
        window.open(pdfUrl, "PRINT", "height=400,width=600");
    };

    return (
        <div>
            {/* <PageTitleSetting title={`Sales no: ${saleNo}`} subtitle={receiptNo}></PageTitleSetting> */}

            <div style={styles.container}>
                <iframe
                    title="pdf document"
                    id="print-file"
                    src={`${pdfUrl}`}
                    style={styles.iframe} />
            </div>
                
            <div className='flex gap-4'>
                <Button className="w-[100px]" onClick={handlePrint} variant="default" type='button'>Cetak</Button>
                <Button className="w-[100px]" onClick={onCancel} variant="outline" type='button'>Kembali</Button>
            </div>
        </div>
    )
}

export default DetailSaleTransactionPage;