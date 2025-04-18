import { fetchRedis } from '@/lib/redis'
import { getCurrentUser } from '@/lib/auth'

import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { Message, messageSchema } from '@/lib/schemas/message-schema'

import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json()
    const user = await getCurrentUser()

    if (!user) return new Response('Unauthorized', { status: 401 })

    // Split the chatId to retrieve the two userIds and verify participants
    const [userId1, userId2] = chatId.split('--')

    // Ensure the current user is part of the chat
    if (user.id !== userId1 && user.id !== userId2) {
      return new Response('You are not part of this chat.', { status: 401 })
    }

    // Determine the other participant's ID (friendId)
    const friendId = user.id === userId1 ? userId2 : userId1

    // Verify if the other participant is a friend
    const friendList = (await fetchRedis('smembers', `user:${user.id}:friends`)) as string[]
    const isFriend = friendList.includes(friendId)

    if (!isFriend) {
      return new Response('You are not friends with this user.', { status: 401 })
    }

    // Fetch sender details
    const rawSender = (await fetchRedis('get', `user:${user.id}`)) as string
    const sender = JSON.parse(rawSender) as User

    const timestamp = Date.now()

    const messageData: Message = {
      id: nanoid(),
      senderId: user.id,
      text,
      timestamp,
    }

    const message = messageSchema.parse(messageData)

    // Notify all users in the chat about the new message
    await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message)

    // Notify the other participant about the new message
    await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
      ...message,
      senderImg: sender.image,
      senderName: sender.name,
    })

    // Save the message in the database
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    })

    return new Response('Message sent successfully!', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Internal server error, please try again.', { status: 500 })
  }
}
