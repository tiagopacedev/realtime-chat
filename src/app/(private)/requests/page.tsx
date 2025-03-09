import FriendRequests from '@/components/friend-requests'
import { fetchRedis } from '@/lib/redis'
import { getCurrentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'

export default async function Page() {
  const user = await getCurrentUser()
  if (!user) notFound()

  const incomingSenderIds = (await fetchRedis(
    'smembers',
    `user:${user.id}:incoming_friend_requests`,
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
        <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={user.id} />
      </div>
    </main>
  )
}
