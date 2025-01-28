'use client'

import { Loader2, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useState } from 'react'

import { Button } from './ui/button'

export default function SignOutButton({ ...props }) {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false)
  return (
    <Button
      {...props}
      variant="ghost"
      className="mr-6 h-full w-12"
      onClick={async () => {
        setIsSigningOut(true)
        try {
          await signOut()
        } catch (error) {
          toast.error('There was a problem signing out')
        } finally {
          setIsSigningOut(false)
        }
      }}
    >
      {isSigningOut ? <Loader2 className="animate-spin" /> : <LogOut />}
    </Button>
  )
}
