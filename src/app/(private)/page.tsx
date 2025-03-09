import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'

import { fetchRedis } from '@/helpers/redis'
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'

import { chatHrefConstructor } from '@/lib/utils'

import { notFound } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth'

export default async function Page({}) {
  const user = await getCurrentUser()
  if (!user) notFound()

  const friends = await getFriendsByUserId(user.id)

  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        'zrange',
        `chat:${chatHrefConstructor(user.id, friend.id)}:messages`,
        -1,
        -1,
      )) as string[]

      const lastMessage = JSON.parse(lastMessageRaw) as Message

      return {
        ...friend,
        lastMessage,
      }
    }),
  )

  return (
    <div className="p-8">
      <h1 className="mb-8 text-3xl font-bold">Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            className="relative mb-4 rounded-md border border-zinc-200 p-3 hover:bg-zinc-50"
          >
            <Link
              href={`/chat/${chatHrefConstructor(user.id, friend.id)}`}
              className="flex items-center gap-4"
            >
              <div className="flex-shrink-0">
                <div className="relative h-12 w-12">
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg">{friend.name}</h4>
                <p className="max-w-md text-zinc-400">
                  <span>{friend.lastMessage.senderId === user.id ? 'You: ' : ''}</span>
                  {friend.lastMessage.text}
                </p>
              </div>

              <p className="absolute right-0 top-0 p-3 text-sm text-zinc-400">
                {dayjs(friend.lastMessage.timestamp).format('dddd')}
              </p>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}
