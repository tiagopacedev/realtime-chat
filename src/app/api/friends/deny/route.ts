import { z } from 'zod'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const user = await getCurrentUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Extract and validate the user ID to deny the friend request
    const { id: idToDeny } = z.object({ id: z.string() }).parse(body)

    // Remove the incoming friend request from the database
    await db.srem(`user:${user.id}:incoming_friend_requests`, idToDeny)

    // Trigger a Pusher event to update the sidebar in real time
    await pusherServer.trigger(
      toPusherKey(`user:${user.id}:incoming_friend_requests`),
      'deny_request',
      {
        id: idToDeny,
      },
    )

    return new Response('OK')
  } catch (error) {
    console.log(error)

    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 })
    }

    return new Response('Invalid request', { status: 400 })
  }
}
