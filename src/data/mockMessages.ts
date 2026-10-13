import type { Conversation } from '@/types/message'

export const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    role: 'VIP Customer',
    lastMessage: 'Thank you! The headphones sound incredible.',
    lastMessageTime: '10:45 AM',
    unreadCount: 1,
    online: true,
    messages: [
      {
        id: 'msg-1',
        senderId: 'cust-1',
        text: 'Hi support, has my AeroPulse Pro shipped yet?',
        timestamp: '10:30 AM',
        isMe: false,
      },
      {
        id: 'msg-2',
        senderId: 'admin',
        text: 'Hello Sarah! Yes, your order ORD-9842 has been delivered by FedEx today.',
        timestamp: '10:38 AM',
        isMe: true,
      },
      {
        id: 'msg-3',
        senderId: 'cust-1',
        text: 'Thank you! The headphones sound incredible.',
        timestamp: '10:45 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 'conv-2',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    role: 'Customer',
    lastMessage: 'Can I change the delivery address?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false,
    messages: [
      {
        id: 'msg-4',
        senderId: 'cust-2',
        text: 'Can I change the delivery address for order ORD-9841?',
        timestamp: 'Yesterday, 3:15 PM',
        isMe: false,
      },
      {
        id: 'msg-5',
        senderId: 'admin',
        text: 'Sure Marcus, please provide the updated address before 5 PM.',
        timestamp: 'Yesterday, 3:20 PM',
        isMe: true,
      },
    ],
  },
  {
    id: 'conv-3',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
    role: 'Wholesale Partner',
    lastMessage: 'We would love to place a bulk order of 50 units.',
    lastMessageTime: 'Oct 4',
    unreadCount: 2,
    online: true,
    messages: [
      {
        id: 'msg-6',
        senderId: 'cust-3',
        text: 'Hello team, do you offer discount tiers for 50+ units of Zenith 4K OLED monitor?',
        timestamp: 'Oct 4, 11:00 AM',
        isMe: false,
      },
      {
        id: 'msg-7',
        senderId: 'cust-3',
        text: 'We would love to place a bulk order of 50 units.',
        timestamp: 'Oct 4, 11:02 AM',
        isMe: false,
      },
    ],
  },
]
