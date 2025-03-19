import { ReactNode } from 'react'
import Sidebar from '@/components/sidebar'

interface LayoutProps {
  children: ReactNode
}

export const metadata = {
  title: 'Chats',
  description: 'Your chats',
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-zinc-50 md:justify-center md:gap-4 md:p-12 lg:p-28">
      <Sidebar />

      <aside className="sm max-h-screen w-full lg:w-1/2">{children}</aside>
    </div>
  )
}
