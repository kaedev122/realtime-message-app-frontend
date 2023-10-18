import axios from "axios"
import {MessageBody, NewChatBody, NewGroupChatBody} from "./interfaces/IMessage"

const BASE_URL = 'https://realtime-message-app-backend.vercel.app/api';

export const getAllConversationApi = () => {
    return axios({
        method: "GET",
        url: BASE_URL.concat(`/chat/c`),
    })
}

export const getConversationByIdApi = (id1: string, id2: string) => {
    return axios({
        method: "GET",
        url: BASE_URL.concat(`/chat/c/${id1}/${id2}`),
    })
}

export const getMessageOfConversationApi = (id: string) => {
    return axios({
        method: "GET",
        url: BASE_URL.concat(`/chat/m/${id}`)
    })
}

export const sendMessageAPI = ({ sender, text, conversationId }: MessageBody) => {
    return axios({
        method: "POST",
        url: BASE_URL.concat(`/chat/m/`),
        data: {
            conversationId: conversationId,
            sender: sender,
            text: text,
        },
    })
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