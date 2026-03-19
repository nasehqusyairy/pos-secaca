import { Roles } from "../roles/type";

export type LocationEmployee = {
    location_id: number;
    role_id: number;
    entity_permission: any; // Adjust according to the actual structure
    location_permission: any; // Adjust according to the actual structure
};

export type EmployeeRequest = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    select_all_location: boolean;
    role_id: number;
    locations: LocationEmployee[];
};

export type Employee = {
    id?: number;
    first_name: string;
    last_name: string;
    name?: string;
    email: string;
    role_id: number;
    role: Roles;
    locations: any[];
    status: string;
}