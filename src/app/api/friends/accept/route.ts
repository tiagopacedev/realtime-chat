import { z } from 'zod'

import { db } from '@/lib/db'
import { fetchRedis } from '@/lib/redis'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body)

    const user = await getCurrentUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Check if already friends
    const isAlreadyFriends = await fetchRedis('sismember', `user:${user.id}:friends`, idToAdd)

    if (isAlreadyFriends) {
      return new Response('You are already friends.', { status: 400 })
    }

    // Check for incoming friend request
    const hasFriendRequest = await fetchRedis(
      'sismember',
      `user:${user.id}:incoming_friend_requests`,
      idToAdd,
    )

    if (!hasFriendRequest) {
      return new Response('No friend request from this user.', { status: 400 })
    }

    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis('get', `user:${user.id}`),
      fetchRedis('get', `user:${idToAdd}`),
    ])) as [string, string]

    const currentUser = JSON.parse(userRaw) as User
    const friend = JSON.parse(friendRaw) as User

    // Add both users as friends and notify them
    await Promise.all([
      pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`), 'new_friend', currentUser),
      pusherServer.trigger(toPusherKey(`user:${user.id}:friends`), 'new_friend', friend),

      db.sadd(`user:${user.id}:friends`, idToAdd),
      db.sadd(`user:${idToAdd}:friends`, user.id),
      db.srem(`user:${user.id}:incoming_friend_requests`, idToAdd),
    ])

    return new Response('Friend request accepted!', { status: 200 })
  } catch (error) {
    console.log(error)

    if (error instanceof z.ZodError) {
      return new Response('Invalid data.', { status: 422 })
    }

    return new Response('Something went wrong. Please try again.', { status: 400 })
  }
}
