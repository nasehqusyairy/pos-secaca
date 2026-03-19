export type PaymentMethods = {
    id: number | null,
    entity_id: number | null,
    name: string,
    status: string, // enum
    kind: string, // enum
    icon_image_url: string | null,
    fixed_fee: number,
    variable_fee: number
}