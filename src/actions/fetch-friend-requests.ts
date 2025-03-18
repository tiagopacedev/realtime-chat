'use server'

import { fetchRedis } from '@/lib/redis'

export async function fetchFriendRequests(userId: string) {
  const incomingSenderIds = (await fetchRedis(
    'smembers',
    `user:${userId}:incoming_friend_requests`,
  )) as string[]

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`)) as string
      const senderParsed = JSON.parse(sender) as User

      return {
        senderId,
        senderEmail: senderParsed.email,
      }
    }),
  )

  return incomingFriendRequests
}
