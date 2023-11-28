export interface MessageBody {
    conversationId: string
    sender: string
    text: string
    image: string
}

export interface NewChatBody {
    senderId: string,
    receiverId: string
}
export interface NewGroupChatBody {
    members: [string]
}
export interface AddGroupMemberBody {
    members: [string]
}