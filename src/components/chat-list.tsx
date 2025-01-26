'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { chatHrefConstructor } from '@/lib/utils'

interface ChatListProps {
  friends: User[]
  sessionId: string
}

export default function ChatList({ friends, sessionId }: ChatListProps) {
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return (
    <ul role="list" className="-mx-2 max-h-[25rem] space-y-1 overflow-y-auto">
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id
        }).length

        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
              className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              {friend.name}
              {unseenMessagesCount > 0 && (
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white">
                  {unseenMessagesCount}
                </div>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
