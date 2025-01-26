import { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { MessageCircleMore } from 'lucide-react'

import { authOptions } from '@/lib/auth'
import { Icons, type Icon } from '@/components/icons'

interface LayoutProps {
  children: ReactNode
}

export const metadata = {
  title: 'Chat | Dashboard',
  description: 'Your dashboard',
}

interface SidebarOption {
  id: number
  name: string
  href: string
  Icon: Icon
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus',
  },
]

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  return (
    <div className="flex h-screen w-full">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white p-6">
        <Link
          href="/dashboard"
          className="flex h-16 shrink-0 items-center gap-2 text-2xl font-semibold leading-6 text-indigo-600"
        >
          <MessageCircleMore className="h-8 w-auto text-indigo-600" />
          Talkie
        </Link>

        <div className="text-xs font-semibold leading-6 text-gray-400">Your chats</div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>{/* {Chat List} */}</li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">Overview</div>

              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon]
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  )
                })}

                <li>{/* {Friend Request} */}</li>
              </ul>
            </li>

            <li className="-mx-6 mt-auto flex items-center">{/* {Sign Out} */}</li>
          </ul>
        </nav>
      </div>

      <aside className="max-h-screen w-full">{children}</aside>
    </div>
  )
}

export default Layout
