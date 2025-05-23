import { chatHrefConstructor, cn } from '@/lib/utils'
import toast, { type Toast } from 'react-hot-toast'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface UnseenChatToastProps {
  t: Toast
  sessionId: string
  senderId: string
  senderImg: string
  senderName: string
  senderMessage: string
}

export default function UnseenChatToast({
  t,
  senderId,
  sessionId,
  senderImg,
  senderName,
  senderMessage,
}: UnseenChatToastProps) {
  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5',
        { 'animate-enter': t.visible, 'animate-leave': !t.visible },
      )}
    >
      <a
        onClick={() => toast.dismiss(t.id)}
        href={`/chat/${chatHrefConstructor(sessionId, senderId)}`}
        className="w-0 flex-1 p-4"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Avatar className="size-10">
              <AvatarImage src={senderImg} />
              <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-zinc-900">{senderName}</p>
            <p className="mt-1 text-sm text-zinc-500">{senderMessage}</p>
          </div>
        </div>
      </a>

      <div className="flex border-l border-zinc-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-emerald-600 hover:text-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Close
        </button>
      </div>
    </div>
  )
}
