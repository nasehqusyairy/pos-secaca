import { useMutation } from "@tanstack/react-query";
import { authStore } from "./api";
import { AuthStore } from "./type";

export function useAuthStoreMutation() {
    return useMutation({
        mutationKey: ['auth', 'store'],
        mutationFn: (data: AuthStore) => authStore(data)
    })
}