import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { MessagesSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getFriendsByUserId } from '@/actions/get-friends-by-user-id'

export default async function Page() {
  const user = await getCurrentUser()
  if (!user) return notFound()

  const friends = await getFriendsByUserId(user.id)
  const hasFriends = friends && friends.length > 0

  return (
    <div className="h-full border bg-white p-8 md:ml-4">
      <div className="flex h-full flex-col items-center justify-center gap-4 p-10">
        {hasFriends ? (
          <>
            <MessagesSquare className="size-10 text-zinc-400" />
            <h1 className="text-center text-zinc-400">Select a chat to start a conversation.</h1>
          </>
        ) : (
          <>
            <h1 className="w-64 text-center text-zinc-400">
              You don&#39;t have any contacts yet. Invite your friends to start chatting.
            </h1>
            <Link href="/add">
              <Button variant="secondary">Invite a friend</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
