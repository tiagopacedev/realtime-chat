import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getFriendsByUserId } from '@/actions/get-friends-by-user-id'
import MessagePlaceholder from '@/components/message-placeholder'
// import MobileNavigation from '@/components/mobile-navigation'

export default async function Page() {
  const user = await getCurrentUser()
  if (!user) return notFound()

  const friends = await getFriendsByUserId(user.id)
  const hasFriends = friends && friends.length > 0

  // TODO: Implement mobile responsiveness

  return (
    <div className="h-full border bg-white md:rounded-md">
      {/* <MobileNavigation friends={friends} user={user} /> */}
      <MessagePlaceholder hasFriends={hasFriends} />
    </div>
  )
}
