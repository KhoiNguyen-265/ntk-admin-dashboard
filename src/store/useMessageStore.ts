import { create } from 'zustand'
import type { Conversation, Message } from '@/types/message'
import { initialConversations } from '@/data/mockMessages'

interface MessageState {
  conversations: Conversation[]
  activeConversationId: string
  searchQuery: string
  setSearchQuery: (query: string) => void
  setActiveConversationId: (id: string) => void
  sendMessage: (conversationId: string, text: string) => void
  markAsRead: (conversationId: string) => void
  getActiveConversation: () => Conversation | undefined
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: initialConversations,
  activeConversationId: 'conv-1',
  searchQuery: '',

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setActiveConversationId: (id) => {
    set({ activeConversationId: id })
    get().markAsRead(id)
  },

  sendMessage: (conversationId, text) => {
    if (!text.trim()) return

    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'admin',
      text: text.trim(),
      timestamp: timeString,
      isMe: true,
    }

    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id !== conversationId) return conv
        return {
          ...conv,
          lastMessage: text.trim(),
          lastMessageTime: timeString,
          messages: [...conv.messages, newMessage],
        }
      }),
    }))

    // Optional simulated reply after 1.5 seconds for realistic interactivity
    setTimeout(() => {
      const replies = [
        'Got it, thanks for the update!',
        'Appreciate the quick response!',
        'Perfect, will check it out right away.',
        'Thank you very much for your support!',
      ]
      const randomReply = replies[Math.floor(Math.random() * replies.length)]
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const autoReply: Message = {
        id: `msg-${Date.now()}-reply`,
        senderId: 'contact',
        text: randomReply,
        timestamp: replyTime,
        isMe: false,
      }

      set((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv.id !== conversationId) return conv
          return {
            ...conv,
            lastMessage: randomReply,
            lastMessageTime: replyTime,
            messages: [...conv.messages, autoReply],
          }
        }),
      }))
    }, 1500)
  },

  markAsRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
    }))
  },

  getActiveConversation: () => {
    const { conversations, activeConversationId } = get()
    return conversations.find((c) => c.id === activeConversationId)
  },
}))
