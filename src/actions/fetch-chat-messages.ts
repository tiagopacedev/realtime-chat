'use server'

import { fetchRedis } from '@/lib/redis'
import { messageArraySchema, Message } from '@/lib/schemas/message-schema'

export async function fetchChatMessages(chatId: string): Promise<Message[]> {
  try {
    const results: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1)
    const dbMessages = results.map((message) => JSON.parse(message))
    const reversedDbMessages = dbMessages.reverse()
    const messages = messageArraySchema.parse(reversedDbMessages)

    return messages
  } catch {
    throw new Error('Failed to fetch messages')
  }
}
