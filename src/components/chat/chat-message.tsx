import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { Message } from '@/lib/schemas/message-schema'

interface ChatMessageProps {
  message: Message
  isCurrentUser: boolean
  hasNextMessageFromSameUser: boolean
}

export function ChatMessage({
  message,
  isCurrentUser,
  hasNextMessageFromSameUser,
}: ChatMessageProps) {
  return (
    <div className="chat-message">
      <div
        className={cn('flex items-end', {
          'justify-end': isCurrentUser,
        })}
      >
        <div
          className={cn('mx-2 flex max-w-lg flex-col space-y-2 text-base', {
            'order-1 items-end': isCurrentUser,
            'order-2 items-start': !isCurrentUser,
          })}
        >
          <span
            className={cn('relative inline-block rounded-lg p-3', {
              'bg-emerald-500 text-white': isCurrentUser,
              'bg-zinc-100 text-zinc-900': !isCurrentUser,
              'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
              'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser,
            })}
          >
            <div className="pr-16">{message.text}</div>
            <span
              className={cn('absolute bottom-1 right-2 min-w-[65px] text-right text-xs', {
                'text-emerald-100': isCurrentUser,
                'text-zinc-600': !isCurrentUser,
              })}
            >
              {dayjs(message.timestamp).format('h:mm A')}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
