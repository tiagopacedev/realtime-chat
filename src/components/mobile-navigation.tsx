'use server'

import { fetchIncomingRequests } from '@/actions/fetch-incoming-requests'
import FriendRequestsButton from './friend-request-button'
import { Button } from './ui/button'
import { SquarePen } from 'lucide-react'
import ChatList from './chat/chat-list'
import SignOutButton from './sign-out-button'
import Link from 'next/link'
import UserProfile from './user-profile'

interface MobileNavigationProps {
  user: User
  friends: User[]
}

export default async function MobileNavigation({ user, friends }: MobileNavigationProps) {
  const unseenRequests = await fetchIncomingRequests(user.id)

  return (
    <nav className="relative flex h-full w-full grow flex-col gap-y-5 overflow-y-auto p-6 md:hidden">
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
