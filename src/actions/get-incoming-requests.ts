'use server'

import { fetchRedis } from '@/lib/redis'

export async function getIncomingRequests(userId: string): Promise<User[]> {
  return (await fetchRedis('smembers', `user:${userId}:incoming_friend_requests`)) as User[]
}
