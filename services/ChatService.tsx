import axios from "axios"
import { MessageBody, NewChatBody } from "./interfaces/IMessage"

const BASE_URL = 'https://realtime-message-app-backend.vercel.app/api';

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

export const sendMessageAPI = ({ sender, text, conversationId }: MessageBody) => {
    const res = axios({
        method: "POST",
        url: BASE_URL.concat(`/chat/m/`),
        data: {
            conversationId: conversationId,
            sender: sender,
            text: text,
        },
    })
    return res
}

export const loginApi = ({ senderId, receiverId }: NewChatBody) => {
    return axios({
        method: "POST",
        url: BASE_URL.concat("/chat/c"),
        data: {
            senderId: senderId,
            receiverId: receiverId
        },
    })
}