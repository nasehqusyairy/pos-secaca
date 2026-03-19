import { Entity } from "../entity/type"

export type Brand = {
    id?: number,
    entity_id?: number,
    entity?: Entity,
    name?: string,
    image_url?: string,
    icon_image_url?: string,
    code?: string,
    initial?: string,
    status?: string,
    action?: string
}