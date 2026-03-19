import { Locations } from "@/app/api/locations/type";
import { Button } from "@/components/ui/button";
import { capitalizeWords } from "@/lib/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineArchive, MdOutlineUnarchive } from "react-icons/md";

type LocationColumnProps = {
  onEdit: (location: Locations) => void;
  onDelete: (location: Locations, isArchive: boolean) => void;
};

export const locationColumnShow = {
  name: true,
  code: false,
  kind: true,
  id: false,
  entity_id: false,
  image_url: false,
  icon_image_url: false,
  initial: true,
  backoffice_phone_number: false,
  backoffice_phone_number_country_code: false,
  backoffice_email: false,
  contact_phone_number: false,
  contact_phone_number_country_code: false,
  contact_email: false,
  warehouse: false,
  full_address: true,
  city: true,
  province: false,
  postal_code: false,
  country: false,
  timezone: false,
  allow_transfer_stock: false,
  allow_external_supplier: false,
  franchise: false,
  status: true,
};

export const LocationColumns = ({
  onEdit,
  onDelete,
}: LocationColumnProps): ColumnDef<Locations>[] => [
  {
    accessorKey: "initial",
    header: "Initial",
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "code",
    header: "Kode",
  },
  {
    accessorKey: "kind",
    header: "Jenis",
    cell: ({ row }) => {
      const data = row.original.kind ?? "";
      return <span>{capitalizeWords(data)}</span>;
    },
  },
  {
    accessorKey: "image_url",
    header: "Gambar",
  },
  // {
  //   accessorKey: "icon_image_url",
  //   header: "Icon Image URL",
  // },
  // {
  //   accessorKey: "backoffice_phone_number",
  //   header: "Backoffice Phone Number",
  // },
  // {
  //   accessorKey: "backoffice_phone_number_country_code",
  //   header: "Backoffice Phone Number Country Code",
  // },
  // {
  //   accessorKey: "backoffice_email",
  //   header: "Backoffice Email",
  // },
  // {
  //   accessorKey: "contact_phone_number",
  //   header: "Contact Phone Number",
  // },
  // {
  //   accessorKey: "contact_phone_number_country_code",
  //   header: "Contact Phone Number Country Code",
  // },
  // {
  //   accessorKey: "contact_email",
  //   header: "Contact Email",
  // },
  // {
  //   accessorKey: "warehouse",
  //   header: "Warehouse",
  // },
  {
    accessorKey: "full_address",
    header: "Alamat",
  },
  {
    accessorKey: "city",
    header: "Kota",
  },
  {
    accessorKey: "province",
    header: "Provinsi",
  },
  {
    accessorKey: "postal_code",
    header: "Kode pos",
  },
  {
    accessorKey: "country",
    header: "Negara",
  },
  // {
  //   accessorKey: "allow_transfer_stock",
  //   header: "Allow Transfer Stock",
  // },
  // {
  //   accessorKey: "allow_external_supplier",
  //   header: "Allow External Supplier",
  // },
  // {
  //   accessorKey: "franchise",
  //   header: "Franchise",
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const data = row.original.status ?? "";
      return <span>{capitalizeWords(data)}</span>;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Button
            onClick={() => onEdit(row.original)}
            size="icon"
            variant="outline"
          >
            <FaPencilAlt className="w-4 h-4" />
          </Button>
          {row.original.status == "active" ? (
            <Button
              onClick={() => onDelete(row.original, false)}
              size="icon"
              variant="outline"
            >
              <MdOutlineArchive className="w-4 h-4" style={{ color: "red" }} />
            </Button>
          ) : (
            <Button
              onClick={() => onDelete(row.original, true)}
              size="icon"
              variant="outline"
            >
              <MdOutlineUnarchive
                className="w-4 h-4"
                style={{ color: "green" }}
              />
            </Button>
          )}
        </div>
      );
    },
  },
];
