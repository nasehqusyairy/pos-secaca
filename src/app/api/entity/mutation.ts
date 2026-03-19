import { useMutation } from "@tanstack/react-query";
import { updateEntity } from "./api";
import { Entity } from "./type";

export function useUpdateEntityMutation() {
    return useMutation({
        mutationKey: ['udpate', 'entity'],
        mutationFn: (params: Entity) => updateEntity(params)
    })
}