"use client"

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { IoMdAdd, IoMdClose, IoMdSave } from "react-icons/io";
import { Employee, LocationEmployee } from "@/app/api/karyawan/type";
import { Locations } from "@/app/api/locations/type";
import { Roles } from "@/app/api/roles/type";


const LOCATION_COLUMNS = ["Location", "Role"];

interface FieldLocationProps {
    form: any;
    locations: Locations[];
    roles: Roles[];
    data: Employee | null;
}
 
const FieldLocation: FC<FieldLocationProps> = ({
    form,
    locations,
    roles,
    data
}) => {
    const [values, setValues] = useState<LocationEmployee[]>([])
    const [locationData, setLocationData] = useState<Locations[]>(locations);
    const [editingRowId, setEditingRowId] = useState<number | string | null>(null);
    const [locationValue, setLocationValue] = useState("");
    const [roleValue, setRoleValue] = useState("");

    const handleSelectLocation = (value: string) => {
        setLocationValue(value);
    };

    const handleSelectRole = (value: string) => {
        setRoleValue(value);
    }
    
	const handleSaveValue = () => {
		if (!locationValue || !roleValue) {
			return;
		}

		const newValue: any = [...values, {
            location_id: +locationValue,
            role_id: +roleValue,
            entity_permission: {},
            location_permission: {}
        }];

		setValues(newValue);

		form.setValue("locations", newValue);

        setLocationData((prev) => prev.filter((item) => item.id != +locationValue));
        
        // Reset value
        setLocationValue("");
        setRoleValue("");
        setEditingRowId(null);
	};
    
    const handleDelete = (index: number) => {
        const newValue = values.filter((_, i) => i !== index);
        setValues(newValue);
        form.setValue("locations", newValue);
    }

    const onAdd = () => {
        setEditingRowId("tambah");
    }

    const onCancel = () => {
        setEditingRowId(null);
    }

    useEffect(() => {
		const val = form.getValues("locations");

		if (val && val.length > 0) {
            setValueLocations(val, form);
		} else if (data) {
            setValueLocations(data.locations, form);
        }

	}, [form, data]);

    const setValueLocations = (data: any, form: any) => {
        const value = data && data.map((item: any) => {
            return {
                location_id: item.location_id.toString(),
                role_id: item.role_id.toString(),
                entity_permission: item.entity_permission,
                location_permission: item.location_permission
            }
        })
        form.setValue("locations", value);
        
    }
    
    return ( 
        <div>
            <FormLabel className="block">Locations</FormLabel>
            <Button variant="secondary" className="ml-auto mt-4" onClick={() => onAdd()} type="button">
                <IoMdAdd  className="mr-2"/> Tambah Location
            </Button>

            <Table className="border rounded-xl mt-4">
                <TableHeader>
                    <TableRow>
                        {LOCATION_COLUMNS.map(
                            (item: string, i: number) => (
                                <TableHead key={item + i}>{item}</TableHead>
                            )
                        )}
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        editingRowId === "tambah" && (
                            <TableRow>
                                <TableCell>
                                    <FormItem>
                                        <Select value={locationValue} onValueChange={handleSelectLocation}>
                                            <SelectTrigger className="w-[180px]" >
                                            <SelectValue placeholder="Select a location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            <SelectGroup>
                                                {
                                                    locationData?.map((item: Locations, i: number) => (
                                                        <SelectItem key={i} value={item.id?.toString() || ''}>{item.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                </TableCell>
                                <TableCell>
                                <FormItem>
                                    <Select value={roleValue} onValueChange={handleSelectRole}>
                                        <SelectTrigger className="w-[180px]" >
                                        <SelectValue placeholder="Select a roles" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectGroup>
                                            {
                                                roles?.map((item: Roles, i: number) => (
                                                    <SelectItem key={i} value={item.id?.toString() || ''}>{item.name}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button onClick={handleSaveValue}>
                                            <IoMdSave className="w-4 h-4" />
                                        </Button>
                                        <Button onClick={onCancel} variant="secondary">
                                            <IoMdClose className="w-4 h-4" style={{ color: 'red'}}/>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    }
                    {values.map((item: LocationEmployee, i: number) => {
                        const locName = locations.find((location) => location.id == item.location_id)?.name;
                        const roleName = roles.find((role) => role.id == item.role_id)?.name;
                        
                        return (
                            <TableRow key={i}>
                            <TableCell>{locName}</TableCell>
                            <TableCell>{roleName}</TableCell>
                            <TableCell  className={cn("w-[150px]")}>
                                <Button size="icon" variant="outline" onClick={() => handleDelete(i)}>
                                        <Trash className="w-4 h-4" style={{ color: 'red'}}/>
                                </Button>
                            </TableCell>
                            
                        </TableRow>
                        )
                    }
                    )}
                </TableBody>
            </Table>

            <FormField
			control={form.control}
			name="locations"
			render={() => (
				<FormItem>
					<FormMessage />
				</FormItem>
            )}
            />
        </div>
     );
}
 
export default FieldLocation;