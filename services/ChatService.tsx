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