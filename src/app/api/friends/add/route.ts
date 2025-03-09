import { fetchRedis } from '@/lib/redis'
import { getCurrentUser } from '@/lib/auth'

import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { addFriendValidator } from '@/lib/validations/add-friend'

import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email: emailToAdd } = addFriendValidator.parse(body)

    const idToAdd = (await fetchRedis('get', `user:email:${emailToAdd}`)) as string

    // If no user exists with the provided email, return an error
    if (!idToAdd) {
      return new Response('This person does not exist.', { status: 400 })
    }

    const user = await getCurrentUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Prevent the user from adding themselves as a friend
    if (idToAdd === user.id) {
      return new Response('You cannot add yourself as a friend', {
        status: 400,
      })
    }

    // Check if the user has already sent a friend request to the person
    const isAlreadyAdded = (await fetchRedis(
      'sismember',
      `user:${idToAdd}:incoming_friend_requests`,
      user.id,
    )) as 0 | 1

    if (isAlreadyAdded) {
      return new Response('Already added this user', { status: 400 })
    }

    // Check if the two users are already friends
    const isAlreadyFriends = (await fetchRedis('sismember', `user:${user.id}:friends`, idToAdd)) as
      | 0
      | 1

    if (isAlreadyFriends) {
      return new Response('Already friends with this user', { status: 400 })
    }

    // Send a notification about the incoming friend request
    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      'incoming_friend_requests',
      {
        senderId: user.id,
        senderEmail: user.email,
      },
    )

    // Store the friend request in Redis for the recipient user
    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, user.id)

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 })
    }

    return new Response('Invalid request', { status: 400 })
  }
}
