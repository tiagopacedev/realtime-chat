import React from 'react'
import { notFound } from 'next/navigation'

import { fetchRedis } from '@/lib/redis'
import ChatInput from '@/components/chat/chat-input'
import ChatMessages from '@/components/chat/chat-messages'
import { getCurrentUser } from '@/lib/auth'
import { getChatMessages } from '@/actions/get-chat-messages'
import ChatHeader from '@/components/chat/chat-header'

interface ChatPageProps {
  params: Promise<{ chatId: string }>
}

export default async function Page({ params }: ChatPageProps) {
  const { chatId } = await params
  const user = await getCurrentUser()
  if (!user) notFound()

  // Construct url for chat partner
  const [userId1, userId2] = chatId.split('--')

  if (user.id !== userId1 && user.id !== userId2) {
    notFound()
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1

  const chatPartnerRaw = await fetchRedis('get', `user:${chatPartnerId}`)
  const chatPartner = JSON.parse(chatPartnerRaw) as User
  const initialMessages = await getChatMessages(chatId)

  return (
    <div className="flex h-full flex-1 flex-col justify-between border bg-white md:rounded-md">
      <ChatHeader chatPartner={chatPartner} />
      <ChatMessages chatId={chatId} sessionId={user.id} initialMessages={initialMessages} />
      <ChatInput chatId={chatId} />
    </div>
  )
}
