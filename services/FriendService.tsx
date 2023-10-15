import axios from "axios"

const BASE_URL = 'https://realtime-message-app-backend.vercel.app/api';

export const getAllFriendApi = () => {
    return axios({
        method: "GET",
        url: BASE_URL.concat("/friend/listfriends"),
    });
};

export const getRandomFriendApi = () => {
    return axios({
        method: "GET",
        url: BASE_URL.concat("/friend/random"),
    });
};

export const getFriendByNameApi = (username: string) => {
    console.log(username)
    const input = {'username': username }
    return  axios({
        method: "GET",
        url: BASE_URL.concat("/friend/find"),
        data:  input,
    });
};

