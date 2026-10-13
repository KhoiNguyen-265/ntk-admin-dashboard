export interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  isMe: boolean
}

export interface Conversation {
  id: string
  name: string
  avatar: string
  role?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  online: boolean
  messages: Message[]
}
