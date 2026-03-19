"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface PreviewStrukProps {
    isTriggerOpen: boolean;
    url: string;
    urlRedirect: string;
}
 
const PreviewStruk: FC<PreviewStrukProps> = (props) => {
    const { isTriggerOpen, url, urlRedirect } = props

    const router = useRouter()

    const pdfUrl = `${url}#toolbar=0&navpanes=0&scrollbar=0`
    const styles = {
        container: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        iframe: {
          width: '100%',
          height: '600px',
          border: 'none',
        },
      };

    const onCetak = () => {
        window.open(url, '_blank');
        router.push(urlRedirect);

    }

    const onSubmit = () => {
        router.push(urlRedirect);
    }
    
    return ( 
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 ${isTriggerOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-lg w-[32rem] p-6 relative">
            {/* Popup Header */}
            <p className="text-lg md:text-2xl font-semibold">Struk</p>
            {/* <p className="text-sm text-muted-foreground mt-2">Masukkan kasir yang sedang melakukan transaksi.</p> */}

            {/* Popup Body */}
            <div className="flex flex-col items-center gap-6 mt-6">
                <div style={styles.container}>
                    <iframe src={`${pdfUrl}`} style={styles.iframe} />
                </div>

                <div className="flex gap-2">
                    <Button variant="default" onClick={onCetak} className="text-xs md:text-base">Cetak</Button>
                    <Button variant="secondary" onClick={onSubmit} className="text-xs md:text-base">Selesai</Button>
                </div>
            </div>
            </div>
        </div>
     );
}
 
export default PreviewStruk;