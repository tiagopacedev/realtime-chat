'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'

import { Button, ButtonProps } from './ui/button'

export default function SignOutButton(props: ButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } catch {
      toast.error('Failed to sign out. Please try again.')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Button {...props} variant="ghost" onClick={handleSignOut} disabled={isSigningOut}>
      {isSigningOut ? <Loader2 className="animate-spin" /> : <LogOut />}
    </Button>
  )
}
