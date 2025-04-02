import { notFound } from 'next/navigation'
import FriendRequests from '@/components/friend-requests'
import { getFriendRequests } from '@/actions/get-friend-requests'
import { getCurrentUser } from '@/lib/auth'
import BackButton from '@/components/back-button'

export default async function Page() {
  const user = await getCurrentUser()
  if (!user) notFound()

  const incomingFriendRequests = await getFriendRequests(user.id)

  return (
    <main className="h-full border bg-white p-6 md:rounded-md md:p-8">
      <div className="mb-8 flex items-center gap-2">
        <BackButton />
        <h1 className="text-xl font-bold">Requests</h1>
      </div>

      <div className="flex flex-col gap-4">
        <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={user.id} />
      </div>
    </main>
  )
}
