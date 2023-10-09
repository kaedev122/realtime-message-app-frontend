import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { RegisterBody, LoginBody } from './interfaces/IAuth';

const BASE_URL = 'https://realtime-message-app-backend.vercel.app/api';

export const registerApi = ({ email, username, password }: RegisterBody) => {
    const registerRequest = axios({
        method: "POST",
        url: BASE_URL.concat("/auth/signup"),
        data: { email: email, username: username, password: password },
    })
    return registerRequest
}

export const loginApi = ({ email, password }: LoginBody) => {
    return axios({
        method: "POST",
        url: BASE_URL.concat("/auth/login"),
        data: { email: email, password: password },
    })
}

export const logoutApi = () => {
    return axios({
        method: "POST",
        url: BASE_URL.concat("/auth/logout"),
    })
}