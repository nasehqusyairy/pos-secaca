export type Locations = {
    id: number
    entity_id: number
    image_url?: string
    icon_image_url?: string
    name: string
    code: string
    initial?: string
    backoffice_phone_number?: string
    backoffice_phone_number_country_code?: string
    backoffice_email?: string
    contact_phone_number?: string
    contact_phone_number_country_code?: string
    contact_email?: string
    kind: string
    warehouse?: string
    full_address?: string
    city?: string
    province?: string
    postal_code?: string
    country?: string
    timezone?: number
    allow_transfer_stock?: boolean
    allow_external_supplier?: boolean
    franchise?: boolean
    status: string
}