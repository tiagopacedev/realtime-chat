import Image from 'next/image'

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex flex-1 items-center gap-x-3 px-6 py-2 text-sm font-semibold leading-6 text-zinc-900">
      <div className="relative size-10">
        <Image
          fill
          referrerPolicy="no-referrer"
          className="rounded-full"
          src={user.image || ''}
          alt="Profile picture"
        />
      </div>

      <span className="sr-only">Your profile</span>
      <div className="flex flex-col">
        <span aria-hidden="true">{user.name}</span>
        <span
          className="max-w-[170px] overflow-hidden truncate text-xs text-zinc-400"
          aria-hidden="true"
        >
          {user.email}
        </span>
      </div>
    </div>
  )
}
