import { auth } from '@/auth'
import { fetchRedis } from '@/helpers/redis'

import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { Message, messageValidator } from '@/lib/validations/message'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json()
    const session = await auth()

    if (!session) return new Response('Unauthorized', { status: 401 })

    // Split the chatId to retrieve the two userIds and verify the participants of the chat
    const [userId1, userId2] = chatId.split('--')

    // Ensure that the current user is one of the chat participants
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Determine the other participant's ID (friendId)
    const friendId = session.user.id === userId1 ? userId2 : userId1

    // Get the current user's friend list and verify if the other participant is a friend
    const friendList = (await fetchRedis('smembers', `user:${session.user.id}:friends`)) as string[]
    const isFriend = friendList.includes(friendId)

    if (!isFriend) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Fetch the sender's details
    const rawSender = (await fetchRedis('get', `user:${session.user.id}`)) as string
    const sender = JSON.parse(rawSender) as User

    const timestamp = Date.now()

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    }

    const message = messageValidator.parse(messageData)

    // Notify all users in the chat about the new incoming message
    await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message)

    // Notify the friend about the new message
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

    return new Response('OK')
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
