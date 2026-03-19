import { useMutation } from "@tanstack/react-query";
import { logout } from "./api";

export function useLogoutMutation() {
    return useMutation({
        mutationKey: ["logout"],
        mutationFn: () => logout()
    })
}