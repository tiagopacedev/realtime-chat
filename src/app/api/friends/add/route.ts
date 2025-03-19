import { fetchRedis } from '@/lib/redis'
import { getCurrentUser } from '@/lib/auth'

import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { addFriendSchema } from '@/lib/schemas/add-friend-schema'

import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email: emailToAdd } = addFriendSchema.parse(body)

    const idToAdd = (await fetchRedis('get', `user:email:${emailToAdd}`)) as string

    // Check if the user exists
    if (!idToAdd) {
      return new Response('User not found.', { status: 400 })
    }

    const user = await getCurrentUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Prevent adding self as a friend
    if (idToAdd === user.id) {
      return new Response('You cannot add yourself as a friend.', { status: 400 })
    }

    // Check if the user has already sent a request
    const isAlreadyAdded = (await fetchRedis(
      'sismember',
      `user:${idToAdd}:incoming_friend_requests`,
      user.id,
    )) as 0 | 1

    if (isAlreadyAdded) {
      return new Response('Friend request already sent.', { status: 400 })
    }

    // Check if they are already friends
    const isAlreadyFriends = (await fetchRedis('sismember', `user:${user.id}:friends`, idToAdd)) as
      | 0
      | 1

    if (isAlreadyFriends) {
      return new Response('You are already friends.', { status: 400 })
    }

    // Send friend request notification
    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      'incoming_friend_requests',
      {
        senderId: user.id,
        senderEmail: user.email,
      },
    )

    // Save the friend request in the database
    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, user.id)

    return new Response('Friend request sent!', { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data.', { status: 422 })
    }

    return new Response('Something went wrong. Please try again.', { status: 400 })
  }
}
