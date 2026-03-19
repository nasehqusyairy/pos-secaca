import { z } from "zod";

// Define the Location schema
const locationSchema = z.object({
    location_id: z.number(),
    role_id: z.number(),
    entity_permission: z.record(z.any()), // Adjust based on actual structure
    location_permission: z.record(z.any()) // Adjust based on actual structure
});

// Define the User schema
export const formEmployeeSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    select_all_location: z.boolean().nullable().optional(),
    role_id: z.string(),
    locations: z.array(locationSchema)
});
