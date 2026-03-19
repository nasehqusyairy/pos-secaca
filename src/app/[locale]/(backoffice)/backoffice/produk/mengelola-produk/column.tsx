import { Product } from "@/app/api/product/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineArchive, MdOutlineUnarchive } from "react-icons/md";

type ProductColumnProps = {
	onEdit: (location: Product) => void
	onDelete: (location: Product, isArchive: boolean) => void
}

export const ProductColumnShow = {
	product_category_id: true,
	product_unit_id: true,
	name: true,
	code: true,
	sku: true,
	barcode: true,
	image_url: true,
	sell_price: true,
}

export const ProductColumns = ({ onEdit, onDelete }: ProductColumnProps): ColumnDef<Product>[] => [
	{
		accessorKey: "name",
		header: "Produk",
		cell: ({ row }) => {
			return (
				<div className="w-[300px]">
					<span>{row.original.name}</span>
				</div>
			)
		}
	},
	{
		accessorKey: "sku",
		header: "SKU",
		cell: ({ row }) => {
			return (
				<div className="w-[100px]">
					<span>{row.original.sku}</span>
				</div>
			)
		}
	},
	{
		accessorKey: "barcode",
		header: "Barcode",
		cell: ({ row }) => {
			return (
				<div className="w-[100px]">
					<span>{row.original.barcode}</span>
				</div>
			)
		}
	},
	{
		accessorKey: "product_category_id",
		header: "Kategori",
		cell: ({ row }) => {
			return (
				<div className="w-[100px]">
					<span>{row.original.product_category?.name}</span>
				</div>
			)
		}
	},
	//   {
	//     accessorKey: "code",
	//     header: "Kode",
	//     cell: ({ row }) => {
	//         return (
	//             <div className="w-[100px]">
	//                 <span>{row.original.code}</span>
	//             </div>
	//         )
	//     }
	//   },
	{
		accessorKey: "last_buying_price",
		header: "Harga Beli",
		cell: ({ row }) => {
			return (
				<div className="w-[100px]">
					<span>{formatRupiah(+row.original.last_buying_price)}</span>
				</div>
			)
		}
	},
	{
		accessorKey: "sell_price",
		header: "Harga",
		cell: ({ row }) => {
			return (
				<div className="w-[100px]">
					<span>{formatRupiah(+row.original.sell_price)}</span>
				</div>
			)
		}
	},
	{
		accessorKey: "product_location_stocks",
		header: "Stok",
		cell: ({ row }) => {
			let sum = 0;
			row.original.product_location_stocks?.forEach((v) => {
				sum += v.stock || 0
			})

			return (
				<span>
					{ sum }
				</span>
			)
		}
	},
	{
		accessorKey: "action",
		header: "Action",
		enableHiding: false,
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<Button onClick={() => onEdit(row.original)} size="icon" variant="outline">
						<FaPencilAlt className="w-4 h-4" />
					</Button>
					{
						row.original.status == 'active' ?
							<Button onClick={() => onDelete(row.original, false)} size="icon" variant="outline">
								<MdOutlineArchive className="w-4 h-4" style={{ color: 'red' }} />
							</Button>
							:
							<Button onClick={() => onDelete(row.original, true)} size="icon" variant="outline">
								<MdOutlineUnarchive className="w-4 h-4" style={{ color: 'green' }} />
							</Button>
					}
				</div>
			);
		},
	},
];
