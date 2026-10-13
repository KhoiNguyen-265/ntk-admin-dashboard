import React, { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/common/Card'
import { SearchInput } from '@/components/common/SearchInput'
import { useMessageStore } from '@/store/useMessageStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import {
  Send,
  User,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Smile,
  Paperclip,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function MessagesPage() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    searchQuery,
    setSearchQuery,
    getActiveConversation,
  } = useMessageStore()
  const { t } = useLanguageStore()

  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = getActiveConversation() || conversations[0]

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !activeConversation) return
    sendMessage(activeConversation.id, inputMessage)
    setInputMessage('')
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.messages.title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.messages.subtitle}
        </p>
      </div>

      {/* Chat Container */}
      <Card noPadding className="flex-1 flex overflow-hidden border border-slate-200/80 dark:border-slate-800">
        {/* Left Sidebar: Conversations List */}
        <div className="w-full sm:w-80 md:w-96 border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 flex-shrink-0">
          {/* Search Header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t.messages.searchPlaceholder}
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={cn(
                    'p-3.5 flex items-start gap-3 cursor-pointer transition-colors relative',
                    isActive
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  )}
                >
                  {/* Avatar + Online Indicator */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={cn(
                          'text-xs sm:text-sm font-semibold truncate',
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-900 dark:text-white'
                        )}
                      >
                        {conv.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 flex-shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {conv.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Pane: Active Chat */}
        {activeConversation ? (
          <div className="hidden sm:flex flex-1 flex-col bg-slate-50/50 dark:bg-slate-950/40">
            {/* Chat Top Bar */}
            <div className="h-16 px-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {activeConversation.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {activeConversation.name}
                    {activeConversation.role && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {activeConversation.role}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeConversation.online ? (
                      <span className="text-emerald-500 font-medium">{t.messages.activeNow}</span>
                    ) : (
                      t.messages.offline
                    )}
                  </p>
                </div>
              </div>

              {/* Action icons */}
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {activeConversation.messages.map((msg) => {
                const isMe = msg.isMe
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex items-end gap-2 max-w-lg',
                      isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    )}
                  >
                    {!isMe && (
                      <img
                        src={activeConversation.avatar}
                        alt={activeConversation.name}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div
                      className={cn(
                        'p-3.5 rounded-2xl text-xs sm:text-sm shadow-sm leading-relaxed',
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80'
                      )}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={cn(
                          'flex items-center gap-1 text-[10px] mt-1',
                          isMe ? 'text-indigo-200 justify-end' : 'text-slate-400'
                        )}
                      >
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2"
            >
              <button
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Smile className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t.messages.typeMessage}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-150"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center text-slate-400 text-sm">
            {t.messages.selectToChat}
          </div>
        )}
      </Card>
    </div>
  )
}
