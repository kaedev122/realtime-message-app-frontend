import axios from "axios"

const BASE_URL = 'https://realtime-chat-app-server-88535f0d324c.herokuapp.com/api';

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

export const getFriendByNameApi = (input: { username: string }) => {
    return  axios({
        method: "GET",
        url: BASE_URL.concat("/friend/find"),
        data: {username:input},
    });
};

export const addFriendApi = (id: string) => {
    return axios({
        method: "PUT",
        url: BASE_URL.concat(`/friend/${id}/addfriend`),
    });
};



