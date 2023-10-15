export interface MessageBody {
    conversationId: string
    sender: string
    text: string
}

export interface NewChatBody {
    senderId: string,
    receiverId: string
}