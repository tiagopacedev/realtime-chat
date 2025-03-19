import { MessagesSquare } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

interface MessagePlaceholderProps {
  hasFriends: boolean
}

export default function MessagePlaceholder({ hasFriends }: MessagePlaceholderProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-10">
      {hasFriends ? (
        <>
          <MessagesSquare className="size-10 text-zinc-400" />
          <h1 className="text-center text-zinc-400">Select a chat to start messaging.</h1>
        </>
      ) : (
        <>
          <h1 className="text-center text-zinc-400">Invite your friends to start messaging.</h1>
          <Link href="/add">
            <Button variant="secondary">Invite a friend</Button>
          </Link>
        </>
      )}
    </div>
  )
}
