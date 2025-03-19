'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { Button } from './ui/button'

interface FriendRequestsButtonProps {
  sessionId: string
  initialUnseenRequestCount: number
}

export default function FriendRequestsButton({
  sessionId,
  initialUnseenRequestCount,
}: FriendRequestsButtonProps) {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(initialUnseenRequestCount)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1)
    }

    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1)
    }

    const denyRequestHandler = () => {
      setUnseenRequestCount((prev) => (prev > 0 ? prev - 1 : 0))
    }

    pusherClient.bind('incoming_friend_requests', friendRequestHandler)
    pusherClient.bind('new_friend', addedFriendHandler)
    pusherClient.bind('deny_request', denyRequestHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

      pusherClient.unbind('new_friend', addedFriendHandler)
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
      pusherClient.unbind('deny_request', denyRequestHandler)
    }
  }, [sessionId])

  return (
    <Link href="/requests">
      <Button variant="ghost" size="icon" className="relative flex items-center">
        {unseenRequestCount > 0 && (
          <div className="absolute right-0 top-0 h-4 w-4 rounded-full bg-emerald-500 text-center text-xs text-white">
            {unseenRequestCount}
          </div>
        )}
        <Bell />
      </Button>
    </Link>
  )
}
