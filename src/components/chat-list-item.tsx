'use client'

import { chatHrefConstructor, cn, formatTimestamp } from '@/lib/utils'
import Image from 'next/image'

interface ChatListItemProps {
  friend: User
  sessionId: string
  pathname: string
  unseenMessages: Message[]
}

export default function ChatListItem({
  friend,
  sessionId,
  pathname,
  unseenMessages,
}: ChatListItemProps) {
  const chatHref = `/chat/${chatHrefConstructor(sessionId, friend.id)}`
  const unseenMessagesForFriend = unseenMessages.filter((msg) => msg.senderId === friend.id)

  // Get the latest unseen message
  const latestMessage = unseenMessagesForFriend.sort((a, b) => b.timestamp - a.timestamp)[0]
  const unseenCount = unseenMessagesForFriend.length
  const isActive = pathname.includes(chatHref)

  return (
    <li>
      <a
        href={chatHref}
        className={cn(
          'group flex items-center gap-3 rounded-md p-4 text-sm leading-6',
          isActive ? 'bg-zinc-50' : 'text-zinc-700 hover:bg-zinc-50',
        )}
      >
        {/* Avatar */}
        <div className="relative size-10 flex-shrink-0">
          <Image
            src={friend.image || '/placeholder.svg'}
            alt={friend.name}
            fill
            referrerPolicy="no-referrer"
            className="rounded-full"
          />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-baseline justify-between">
            <h3 className="truncate text-base font-medium text-zinc-900">{friend.name}</h3>
            <span className="whitespace-nowrap text-xs text-zinc-500">
              {latestMessage ? formatTimestamp(latestMessage.timestamp) : ''}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="max-w-[85%] truncate text-sm text-zinc-500">
              {latestMessage?.text || ''}
            </p>

            {unseenCount > 0 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white">
                {unseenCount}
              </div>
            )}
          </div>
        </div>
      </a>
    </li>
  )
}
