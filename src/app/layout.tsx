import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChatApp',
  description: 'A simple real-time chat application.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
