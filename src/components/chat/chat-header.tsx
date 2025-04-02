'use client'

import React from 'react'
import BackButton from '../back-button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface ChatHeaderProps {
  chatPartner: User
}

export function ChatHeader({ chatPartner }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4 md:py-4">
      <div className="relative flex items-center gap-2">
        <BackButton />

        <Avatar className="size-12">
          <AvatarImage src={chatPartner.image} />
          <AvatarFallback>{chatPartner.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col leading-tight">
          <div className="flex items-center">
            <span className="mr-3 font-medium">{chatPartner.name}</span>
            {/* Online status */}
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-sm text-zinc-400">{chatPartner.email}</span>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
