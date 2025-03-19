'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { pusherClient } from '@/lib/pusher'
import UnseenChatToast from './unseen-chat-toast'
import toast, { type Toast } from 'react-hot-toast'
import ChatListItem from './chat-list-item'

interface ChatListProps {
  friends: User[]
  sessionId: string
}

interface ExtendedMessage extends Message {
  senderImg: string
  senderName: string
}

export default function ChatList({ friends, sessionId }: ChatListProps) {
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const [activeChats, setActiveChats] = useState<User[]>(friends)

  useEffect(() => {
    const chatChannel = toPusherKey(`user:${sessionId}:chats`)
    const friendsChannel = toPusherKey(`user:${sessionId}:friends`)

    pusherClient.subscribe(chatChannel)
    pusherClient.subscribe(friendsChannel)

    const handleNewFriend = (newFriend: User) => {
      setActiveChats((prev) => [...prev, newFriend])
    }

    const handleNewMessage = (message: ExtendedMessage) => {
      const isChatOpen = pathname === `/chat/${chatHrefConstructor(sessionId, message.senderId)}`
      if (isChatOpen) return

      toast.custom((t: Toast) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ))

      setUnseenMessages((prev) => [...prev, message])
    }

    pusherClient.bind('new_message', handleNewMessage)
    pusherClient.bind('new_friend', handleNewFriend)

    return () => {
      pusherClient.unsubscribe(chatChannel)
      pusherClient.unsubscribe(friendsChannel)

      pusherClient.unbind('new_message', handleNewMessage)
      pusherClient.unbind('new_friend', handleNewFriend)
    }
  }, [pathname, sessionId])

  useEffect(() => {
    setUnseenMessages((prev) =>
      pathname?.includes('chat') ? prev.filter((msg) => !pathname.includes(msg.senderId)) : prev,
    )
  }, [pathname])

  return (
    <ul role="list" className="-mx-2 max-h-[28rem] space-y-1 overflow-y-auto">
      {activeChats.sort().map((friend) => (
        <ChatListItem
          key={friend.id}
          friend={friend}
          sessionId={sessionId}
          pathname={pathname}
          unseenMessages={unseenMessages}
        />
      ))}
    </ul>
  )
}
