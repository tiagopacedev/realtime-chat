'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { Button } from './ui/button'

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[]
  sessionId: string
}

export default function FriendRequests({ incomingFriendRequests, sessionId }: FriendRequestsProps) {
  const router = useRouter()
  const [friendRequests, setFriendRequests] =
    useState<IncomingFriendRequest[]>(incomingFriendRequests)

  useEffect(() => {
    const channel = toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    pusherClient.subscribe(channel)

    const handleIncomingRequest = (request: IncomingFriendRequest) => {
      setFriendRequests((prev) => [...prev, request])
    }

    pusherClient.bind('incoming_friend_requests', handleIncomingRequest)

    return () => {
      pusherClient.unsubscribe(channel)
      pusherClient.unbind('incoming_friend_requests', handleIncomingRequest)
    }
  }, [sessionId])

  const handleFriendRequest = async (senderId: string, action: 'accept' | 'deny') => {
    await axios.post(`/api/friends/${action}`, { id: senderId })
    setFriendRequests((prev) => prev.filter((req) => req.senderId !== senderId))
    router.refresh()
  }

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Your friend requests will appear here.</p>
      ) : (
        friendRequests.map((request) => (
          <FriendRequestItem
            key={request.senderId}
            request={request}
            onAccept={() => handleFriendRequest(request.senderId, 'accept')}
            onDeny={() => handleFriendRequest(request.senderId, 'deny')}
          />
        ))
      )}
    </>
  )
}

// Extracted FriendRequestItem component
interface FriendRequestItemProps {
  request: IncomingFriendRequest
  onAccept: () => void
  onDeny: () => void
}

function FriendRequestItem({ request, onAccept, onDeny }: FriendRequestItemProps) {
  return (
    <div className="flex items-center gap-3">
      <UserPlus />
      <p className="text-lg font-medium">{request.senderEmail}</p>
      <Button onClick={onAccept} size="icon" variant="success" className="size-8">
        <Check className="font-semibold text-white" />
      </Button>
      <Button onClick={onDeny} size="icon" variant="destructive" className="size-8">
        <X className="font-semibold text-white" />
      </Button>
    </div>
  )
}
