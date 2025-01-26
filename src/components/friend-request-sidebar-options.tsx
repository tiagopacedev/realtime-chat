'use client'

import Link from 'next/link'
import { User } from 'lucide-react'

interface FriendRequestSidebarOptionsProps {
  sessionId: string
  initialUnseenRequestCount: number
}

export default function FriendRequestSidebarOptions({
  initialUnseenRequestCount,
}: FriendRequestSidebarOptionsProps) {
  return (
    <Link
      href="/dashboard/requests"
      className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
        <User className="h-4 w-4" />
      </div>

      <p className="truncate">Friend requests</p>
      {initialUnseenRequestCount > 0 && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
          {initialUnseenRequestCount}
        </div>
      )}
    </Link>
  )
}
