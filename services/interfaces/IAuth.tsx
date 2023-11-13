export interface RegisterBody {
    email: string
    username: string
    password: string
}

export interface LoginBody {
    email: string
    password: string
    device_token: string
}