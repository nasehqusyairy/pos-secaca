import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa"
import { formatDate, formatterOnlyDate } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { capitalizeWords } from "@/lib/helpers";
import { Promo } from "@/app/api/revenue-center/promo/type";

type PromoColumnProps = {
    onDetail: (data: Promo) => void | null,
    onEdit: (data: Promo) => void | null,
}

export const PromoColumnShow = {
    name: true,
    start_at: true,
    end_at: true,
    owner_location: true,
}

export const PromoColumns = (props: PromoColumnProps): ColumnDef<Promo>[] => {
    const t = useTranslations();

    return [
        {
            accessorKey: "name",
            header: t('promo_name')
        },
        {
            accessorKey: "start_at",
            header: t('start_at'),
            cell: ({ row }) => {
                return formatDate(new Date(row.original.start_at), formatterOnlyDate)
            }
        },
        {
            accessorKey: "end_at",
            header: t('end_at'),
            cell: ({ row }) => {
                if (!row.original.end_at) return '-'

                return formatDate(new Date(row.original.end_at), formatterOnlyDate)
            }
        },
        {
            accessorKey: "owner_location.name",
            header: t('location_name'),
            cell: ({ row }) => {
                if (!row.original.owner_location) return '-'

                return capitalizeWords(row.original.owner_location.name)
            }
        },
        {
            accessorKey: "action",
            header: "Action",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        <Button onClick={() => props.onDetail(row.original)} size="icon" variant="outline">
                            <FaEye className="w-4 h-4" />
                        </Button>
                        {/* <Button onClick={() => props.onEdit(row.original)} size="icon" variant="outline">
                            <FaPencil className="w-4 h-4" />
                        </Button> */}
                    </div>
                );
            },
        }
    ]
}