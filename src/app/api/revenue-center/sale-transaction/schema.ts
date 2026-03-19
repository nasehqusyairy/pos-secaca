import { z } from 'zod';

export const formVoidSaleTransactionSchema = z.object({
    reason: z.string().nonempty("Alasan harus di isi"),
    notes: z.string().nonempty("Catatan harus di isi"),
})