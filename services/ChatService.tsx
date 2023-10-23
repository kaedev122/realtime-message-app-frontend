import axios from "axios"
import { MessageBody, NewChatBody, NewGroupChatBody } from "./interfaces/IMessage"

const BASE_URL = 'https://realtime-chat-app-server-88535f0d324c.herokuapp.com/api';

export const getAllConversationApi = () => {
    const conversations = axios({
        method: "GET",
        url: BASE_URL.concat(`/chat/c`),
    })
    return conversations
}

export const getMessageOfConversationApi = (id: string) => {
    return axios({
        method: "GET",
        url: BASE_URL.concat(`/chat/m/${id}`)
    })
}


export const sendMessageAPI = (formData) => {
    return axios.post(
        BASE_URL.concat(`/chat/m/`),
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
}

export const createNewChat = ({ senderId, receiverId }: NewChatBody) => {
    return axios({
        method: "POST",
        url: BASE_URL.concat("/chat/c"),
        data: {
            senderId: senderId,
            receiverId: receiverId
        },
    })
}
export const createNewGroupChat = ({ members }: NewGroupChatBody) => {
    return axios({
        method: "POST",
        url: BASE_URL.concat("/chat/c/group"),
        data: {
            members: members
        },
    })
}
export const updateConversation = (id: string, formData) => {
    return axios.put(
        BASE_URL.concat(`/chat/c/group/${id}`),
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
}