import apiClient from './client'

export type UserResponse = {
    id: number
    username: string
    email: string
    totpEnabled: boolean
    createdAt: string
}

export type RegisterRequest = {
    username: string
    email: string
    password: string
}

export const authApi = {
    register: (data: RegisterRequest) =>
        apiClient.post<UserResponse>('/auth/register', data).then((r) => r.data),

    me: () =>
        apiClient.get<UserResponse>('/auth/me').then((r) => r.data),
}
