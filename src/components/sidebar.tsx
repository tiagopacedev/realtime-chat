'use server'

import { fetchIncomingRequests } from '@/actions/fetch-incoming-requests'
import { getFriendsByUserId } from '@/actions/get-friends-by-user-id'
import { getCurrentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import FriendRequestsButton from './friend-request-button'
import { Button } from './ui/button'
import { SquarePen } from 'lucide-react'
import ChatList from './chat-list'
import SignOutButton from './sign-out-button'
import Link from 'next/link'
import UserProfile from './user-profile'

export default async function Sidebar() {
  const user = await getCurrentUser()

  if (!user) return notFound()

  const friends = await getFriendsByUserId(user.id)
  const unseenRequests = await fetchIncomingRequests(user.id)

  return (
    <nav className="relative hidden h-full w-full max-w-[22rem] grow flex-col gap-y-5 overflow-y-auto rounded-md border bg-white p-6 md:flex">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chats</h1>

        <div className="flex gap-1">
          <FriendRequestsButton
            sessionId={user.id}
            initialUnseenRequestCount={unseenRequests.length}
          />
          <Link href="/add">
            <Button variant="ghost" size="icon">
              <SquarePen />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-y-7">
          <ChatList friends={friends} sessionId={user.id} />

          <div className="-mx-6 mt-auto flex items-center">
            <UserProfile user={user} />
            <SignOutButton className="mr-6 h-full" />
          </div>
        </div>
      </div>
    </nav>
  )
}
