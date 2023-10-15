import axios from "axios"
import {FriendBody} from "./interfaces/IFriend";

const BASE_URL = 'https://realtime-message-app-backend.vercel.app/api';

export const getAllFriendApi = () => {
    const getAllFriendRequest = axios({
        method: "GET",
        url: BASE_URL.concat("/friend/listfriends"),
    });
    return getAllFriendRequest;
};

export const getRandomFriendApi = () => {
    const getRandomFriendRequest = axios({
        method: "GET",
        url: BASE_URL.concat("/friend/random"),
    });
    return getRandomFriendRequest;
};
