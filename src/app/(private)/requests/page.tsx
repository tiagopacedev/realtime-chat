import { notFound } from 'next/navigation'
import FriendRequests from '@/components/friend-requests'
import { fetchFriendRequests } from '@/actions/fetch-friend-requests'
import { getCurrentUser } from '@/lib/auth'

export default async function Page() {
  const user = await getCurrentUser()
  if (!user) notFound()

  const incomingFriendRequests = await fetchFriendRequests(user.id)

  return (
    <main className="h-full rounded-md border bg-white p-8 md:ml-4">
      <h1 className="mb-8 text-xl font-bold">Requests</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={user.id} />
      </div>
    </main>
  )
}
