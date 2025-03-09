'use client'

import { Bell, MessageCircleMore, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BottomNavigation = () => {
  const pathname = usePathname()

  if (pathname.startsWith('/chat/')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white">
      <div className="flex items-center justify-around">
        <Link href="/" className="p-5 text-gray-700 hover:text-indigo-600">
          <MessageCircleMore />
        </Link>

        <Link href="/add" className="p-5 text-gray-700 hover:text-indigo-600">
          <Plus />
        </Link>

        <Link href="/requests" className="p-5 text-gray-700 hover:text-indigo-600">
          <Bell />
        </Link>
      </div>
    </nav>
  )
}

export default BottomNavigation
