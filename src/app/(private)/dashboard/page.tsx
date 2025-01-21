import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

export default async function Page() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <h1>Dashboard</h1>
      {JSON.stringify(session)}
    </div>
  )
}
