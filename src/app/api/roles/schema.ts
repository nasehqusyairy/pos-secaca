import { z } from 'zod';

export const formRoleSchema = z.object({
    name: z.string().nonempty(),
    parent_id: z.string().nullable().optional(),
    entity_permission:  z.record(z.any()).optional(),
    location_permission: z.record(z.any()).optional()
});