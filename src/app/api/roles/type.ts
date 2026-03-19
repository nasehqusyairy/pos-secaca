
export type PermissionRole = {
    index: boolean;
    show: boolean;
    create: boolean;
    update: boolean;
    destroy: boolean;
    archive: boolean;
    activate: boolean;
};

type EntityPermissionRole = {
    brand: PermissionRole;
    location: PermissionRole;
    employee: PermissionRole;
};

type ParentRole = {
    id: number;
    name: string;
};

export type Roles = {
    id: number;
    entity_id: string;
    parent_id: string;
    name: string;
    tier: string;
    level: string;
    entity_permission: EntityPermissionRole;
    location_permission: any[]; // If this should have a specific structure, replace `any[]` accordingly
    allow_pos: boolean;
    allow_backoffice: boolean;
    parent_role: ParentRole;
};

export type RequestRoles = {
    id: number;
    name: string;
    parent_id: number;
    entity_permission: any;
    location_permission: any; // If location_permission has specific fields, you can define them instead of `any`
};

export type GetRoleRequest = {
    show_system: boolean;
};