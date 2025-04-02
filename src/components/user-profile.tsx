import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex flex-1 items-center gap-x-3 px-6 py-2 text-sm font-semibold leading-6 text-zinc-900">
      <Avatar className="size-10">
        <AvatarImage src={user.image} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>

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
