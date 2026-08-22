import { useQuery, keepPreviousData  } from "@tanstack/react-query";
import { getInvoice, getInvoiceWithCursor, getInvoiceDetail } from "./api";
import { GetInvoicesQueryParams } from "@/types/invoice";

export function useGetInvoicesQuery(limit: number = 10, locations: number[], refundAmount: number, excludeIds?: number[]) {
    return useQuery({
        queryKey: ["invoices"],
        queryFn: async () => {
            const response = await getInvoice(limit, locations, refundAmount, excludeIds);

            if (!response) {
                return []
            }

            return response.data.map((item: any) => ({
                ...item,
            }));
        },
        enabled: locations[0] !== 0
    });
}

export function useGetInvoicesQueryWithCursor(param: GetInvoicesQueryParams) {
    return useQuery({
        queryKey: ["invoices-with-cursor", param],
        queryFn: async () => {
            const response = await getInvoiceWithCursor(param);
            if (!response || !response.data) {
                return null;
            }
            return response.data;
        },
        enabled: param.locs.length > 0 && param.locs[0] !== 0,
        placeholderData: keepPreviousData, // ← tahan data halaman lama selama fetch halaman baru
    });
}

export function useGetInvoicesQueryWithCursorV2(param: GetInvoicesQueryParams) {
    return useQuery({
        queryKey: ["invoices-with-cursor"],
        queryFn: async () => getInvoiceWithCursor(param),
        enabled: param.locs.length > 0 && param.locs[0] !== 0
    });
}

export function useGetInvoiceDetailQuery(id: number) {
    return useQuery({
        queryKey: ["invoice", id],
        queryFn: async () => {
            if (id === 0) {
                return null;
            }

            const response = await getInvoiceDetail(id);

            return response.data;
        },
        enabled: !!id
    });
}
