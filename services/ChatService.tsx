import axios from "axios"
import { MessageBody, NewChatBody, NewGroupChatBody } from "./interfaces/IMessage"

const BASE_URL = 'https://realtime-chat-app-server-88535f0d324c.herokuapp.com/api';

const getAllConversationApi = () => {
    const conversations = axios({
        method: "GET",
        url: BASE_URL.concat(`/chat/c`),
    })
    return conversations
}

const getConversationOf2UserAPI = (userId, friendId) => {
    return axios({
        method: "GET",
        url: BASE_URL.concat(`/chat/c/${userId}/${friendId}`),
    })
}

const getMessageOfConversationApi = (id: string) => {
    return axios({
        method: "GET",
        url: BASE_URL.concat(`/chat/m/${id}`)
    })
}

const sendMessageAPI = (formData) => {
    return axios.post(
        BASE_URL.concat(`/chat/m/`),
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
}

const createNewChat = ({ senderId, receiverId }: NewChatBody) => {
    return axios({
        method: "POST",
        url: BASE_URL.concat("/chat/c"),
        data: {
            senderId: senderId,
            receiverId: receiverId
        },
    })
}
const createNewGroupChat = ({ members }: NewGroupChatBody) => {
    return axios({
        method: "POST",
        url: BASE_URL.concat("/chat/c/group"),
        data: {
            members: members
        },
    })
}
const updateConversation = (id: string, formData) => {
    return axios.put(
        BASE_URL.concat(`/chat/c/group/${id}`),
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
}
const updateWatched = (id: string) => {
    return axios.put(
        BASE_URL.concat(`/chat/c/${id}`),
    )
}
export {
    getAllConversationApi,
    getMessageOfConversationApi,
    sendMessageAPI,
    createNewChat,
    createNewGroupChat,
    updateConversation,
    updateWatched,
    getConversationOf2UserAPI
}