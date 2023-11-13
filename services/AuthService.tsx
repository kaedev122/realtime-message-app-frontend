import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { RegisterBody, LoginBody } from './interfaces/IAuth';

const BASE_URL = 'https://realtime-chat-app-server-88535f0d324c.herokuapp.com/api';

export const registerApi = ({ email, username, password }: RegisterBody) => {
    const registerRequest = axios({
        method: "POST",
        url: BASE_URL.concat("/auth/signup"),
        data: { email: email, username: username, password: password },
    })
    return registerRequest
}

export const loginApi = ({ email, password, device_token }: LoginBody) => {
    return axios({
        method: "POST",
        url: BASE_URL.concat("/auth/login"),
        data: { 
            email: email, 
            password: password,
            device_token: device_token
        },
    })
}

export const logoutApi = () => {
    return axios({
        method: "POST",
        url: BASE_URL.concat("/auth/logout"),
    })
}