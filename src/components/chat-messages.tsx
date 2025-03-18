'use client'

import { useEffect, useState } from 'react'
import { cn, toPusherKey } from '@/lib/utils'
import { Message } from '@/lib/schemas/message-schema'
import { pusherClient } from '@/lib/pusher'
import dayjs from 'dayjs'

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

// ChatMessage Component - Handles individual messages
interface ChatMessageProps {
  message: Message
  isCurrentUser: boolean
  hasNextMessageFromSameUser: boolean
}

function ChatMessage({ message, isCurrentUser, hasNextMessageFromSameUser }: ChatMessageProps) {
  return (
    <div className="chat-message">
      <div className={cn('flex items-end', { 'justify-end': isCurrentUser })}>
        <div
          className={cn('mx-2 flex max-w-xs flex-col space-y-2 text-base', {
            'order-1 items-end': isCurrentUser,
            'order-2 items-start': !isCurrentUser,
          })}
        >
          <span
            className={cn('inline-block rounded-lg px-4 py-2', {
              'bg-zinc-800 text-white': isCurrentUser,
              'bg-zinc-100 text-zinc-900': !isCurrentUser,
              'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
              'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser,
            })}
          >
            {message.text}{' '}
            <span className="ml-2 text-xs text-zinc-400">
              {dayjs(message.timestamp).format('h:mm A')}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
