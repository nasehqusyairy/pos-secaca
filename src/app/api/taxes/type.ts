export type Taxes = {
    id: number | null,
    entity_id: number | null,
    name: string,
    rate: number,
    status: string, // enum
}