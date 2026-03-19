import { useMutation } from "@tanstack/react-query";
import { createLocation, updateLocation } from "./api";
import { Locations } from "./type";

export function useCreateLocationMutation() {
    return useMutation({
        mutationKey: ['add', 'location'],
        mutationFn: (data: Locations) => createLocation(data)
    })
}

export function useUpdateLocationMutation() {
    return useMutation({
        mutationKey: ['update', 'location'],
        mutationFn: (data: Locations) => updateLocation(data)
    })
}