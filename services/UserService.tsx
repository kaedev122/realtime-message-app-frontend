import axios from "axios"

const BASE_URL = 'https://realtime-message-app-backend.vercel.app/api';

export const getUserDataApi = () => {
    const userData = axios({
        method: "GET",
        url: BASE_URL.concat("/user/profile"),
    })
    return userData
}

export const getUserDataByIdApi = (id: string) => {
    const userData = axios({
        method: "GET",
        url: BASE_URL.concat(`/user/profile/${id}`),
    })
    return userData
}

export const updateUserByIdApi = (id: string, userData: { username: string; password: string }) => {
    const updateUserRequest = {
        username: userData.username,
        password: userData.password,
    };
    const options = {
        method: "PUT",
        url: BASE_URL.concat(`/user/profile/${id}`),
        data: updateUserRequest
    };
    return options;
}