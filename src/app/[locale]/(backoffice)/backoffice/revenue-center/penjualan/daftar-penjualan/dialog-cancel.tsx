import { useVoidSaleTransactionMutation } from "@/app/api/revenue-center/sale-transaction/mutation";
import { formVoidSaleTransactionSchema } from "@/app/api/revenue-center/sale-transaction/schema";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	Dialog,
	DialogTrigger,
} from "@/components/ui/dialog"
import { FC, useState } from "react";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showToastError, showToastSuccess } from "@/components/templates/SweetAlert";

interface DialogCancelProps {
	id: string
	salesNo: string
    onRefetch: () => void
}

const DialogCancel: FC<DialogCancelProps> = ({
	id,
	salesNo,
	onRefetch,
}) => {
	const voidSaleTransaction = useVoidSaleTransactionMutation();
	const [openVoid, setOpenVoid] = useState(false)

	const form = useForm<z.infer<typeof formVoidSaleTransactionSchema>>({
		resolver: zodResolver(formVoidSaleTransactionSchema)
	});

	const onClose = () => {
		setOpenVoid(false)
	}

	const onSubmit = (values: z.infer<typeof formVoidSaleTransactionSchema>) => {
		if (voidSaleTransaction.isPending) return;

		const formattedData = {
			...values,
			id,
		}

		voidSaleTransaction.mutate(formattedData, {
			onSuccess: () => {
				showToastSuccess("Berhasil Membatalkan Penjualan");
				form.reset();
				onRefetch();
				onClose();
			},
			onError: () => {
				showToastError("Gagal Membatalkan Penjualan");
			}
		});
	}

	return (
		<Dialog open={openVoid} onOpenChange={setOpenVoid}>
			<DialogTrigger asChild>
				<Button variant="destructive" type='button'>
					Batalkan
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[500px] bg-white">
				<DialogHeader>
					<DialogTitle>
						Batalkan Penjualan - {salesNo}
					</DialogTitle>
					<DialogDescription>
						Batalkan Penjualan yang tidak sesuai
					</DialogDescription>
				</DialogHeader>
				<div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6">
							<FormField
								control={form.control}
								name="reason"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Alasan</FormLabel>
										<FormControl>
											<Input
												placeholder="Masukkan alasan"
												{...field}
												value={field.value}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="notes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Catatan</FormLabel>
										<FormControl>
											<Input
												placeholder="Masukkan catatan"
												{...field}
												value={field.value}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => onClose()}>
						Tutup
					</Button>
					<Button variant="destructive">
						{voidSaleTransaction.isPending ? 'Memproses...' : 'Batakan'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default DialogCancel;