export type APIResponse<T> = {
    data: T
    status: number
    message?: string
}

export type ErrorMessage = {
    message?: string
}