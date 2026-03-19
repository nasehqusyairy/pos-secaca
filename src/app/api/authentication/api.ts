import apiClientWithToken from "../apiClient";
import axios from "axios";
import { AuthParams } from "./type";
import { APIResponse } from "@/types/api_response";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export function login(param: AuthParams): Promise<APIResponse<any>> {
    return apiClient.post('/api/login', param);
}

export async function logout() {
    return await apiClientWithToken.post('/api/logout');

}