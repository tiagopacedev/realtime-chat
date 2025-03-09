import { auth } from '@/auth'
import FriendRequests from '@/components/friend-requests'
import { fetchRedis } from '@/helpers/redis'
import { notFound } from 'next/navigation'

export default async function Page() {
  const session = await auth()
  if (!session) notFound()

  const incomingSenderIds = (await fetchRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`,
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

  return (
    <main className="p-8">
      <h1 className="mb-8 text-3xl font-bold">Requests</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  )
}
