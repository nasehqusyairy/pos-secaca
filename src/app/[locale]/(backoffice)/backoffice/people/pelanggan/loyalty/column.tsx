import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa"
import { formatRupiah } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FaPencil } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Loyalties } from "@/app/api/people/pelanggan/loyalty/type";

type LoyaltyColumnProps = {
    onDetail: (data: Loyalties) => void | null,
    onEdit: (data: Loyalties) => void | null,
}

export const LoyaltyColumnShow = {
    name: true,
    miniminal_transaction_value: true,
    reward_point: true,
    status: true,
}

export const LoyaltyColumns = (props: LoyaltyColumnProps): ColumnDef<Loyalties>[] => {
    const t = useTranslations();

    return [
        {
            accessorKey: "name",
            header: t('loyalty')
        },
        {
            accessorKey: "miniminal_transaction_value",
            header: t('miniminal_transaction_value'),
            cell: ({ row }) => {
                return formatRupiah(row.original.miniminal_transaction_value,false,false)
            }
        },
        {
            accessorKey: "reward_point",
            header: t('reward_point')
        },
        {
            accessorKey: "status",
            header: t('status'),
            cell: ({ row }) => {
                return (
                    <Badge variant={ row.original.status == 'active' ? 'default': 'destructive'}>
                        {t(row.original.status)}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "action",
            header: "Aksi",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <Button onClick={() => props.onDetail(row.original)} size="icon" variant="outline">
                            <FaEye className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => props.onEdit(row.original)} size="icon" variant="outline">
                            <FaPencil className="w-4 h-4" />
                        </Button>
                    </div>
                );
            },
        }
    ]
}