'use client'

import { useEffect, useState } from 'react'
import { toPusherKey } from '@/lib/utils'
import { Message } from '@/lib/schemas/message-schema'
import { pusherClient } from '@/lib/pusher'
import { ChatMessage } from './chat-message'

interface ChatMessagesProps {
  initialMessages: Message[]
  sessionId: string
  chatId: string
}

export default function ChatMessages({ initialMessages, sessionId, chatId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`))

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [message, ...prev])
    }

    pusherClient.bind('incoming-message', handleNewMessage)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
      pusherClient.unbind('incoming-message', handleNewMessage)
    }
  }, [chatId])

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-4 md:p-8"
    >
      {messages.map((message, index) => (
        <ChatMessage
          key={`${message.id}-${message.timestamp}`}
          message={message}
          isCurrentUser={message.senderId === sessionId}
          hasNextMessageFromSameUser={messages[index - 1]?.senderId === message.senderId}
        />
      ))}
    </div>
  )
}
