'use client'

import React from 'react'
import Image from 'next/image'

import BackButton from './back-button'

interface ChatHeaderProps {
  chatPartner: User
}

export function ChatHeader({ chatPartner }: ChatHeaderProps) {
  return (
    <div className="flex justify-between p-4 sm:items-center md:py-6">
      <div className="relative flex items-center space-x-4">
        <BackButton />

        <div className="relative size-10">
          <Image
            fill
            referrerPolicy="no-referrer"
            src={chatPartner.image}
            alt={`${chatPartner.name} profile picture`}
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col leading-tight">
          <div className="flex items-center">
            <span className="mr-3 font-medium">{chatPartner.name}</span>
            {/* Add online status or other indicators here */}
            <span className="h-2 w-2 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-zinc-400">{chatPartner.email}</span>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
