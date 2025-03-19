'use client'

import { addFriendSchema } from '@/lib/schemas/add-friend-schema'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { Button } from './ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from './ui/input'

type FormData = z.infer<typeof addFriendSchema>

export default function AddFriendForm() {
  const [showSuccessState, setShowSuccessState] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendSchema),
  })

  const handleAddFriend = async (email: string) => {
    setIsLoading(true)
    try {
      await axios.post('/api/friends/add', { email })
      setShowSuccessState(true)
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleError = (error: unknown) => {
    if (error instanceof z.ZodError) {
      setError('email', { message: error.message })
      return
    }

    if (error instanceof AxiosError) {
      setError('email', { message: error.response?.data ?? 'Something went wrong.' })
      return
    }

    setError('email', { message: 'Something went wrong.' })
  }

  const onSubmit = (data: FormData) => {
    handleAddFriend(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="md:max-w-sm">
      <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-900">
        Invite a friend via email
      </label>

      <div className="mt-2 flex flex-col gap-2 md:flex-row">
        <Input {...register('email')} type="email" placeholder="Enter email" className="w-full" />
        <Button type="submit" className="mt-2 w-full md:mt-0 md:w-auto" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>

      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>}
      {showSuccessState && <p className="mt-1 text-sm text-green-600">Friend invite sent!</p>}
    </form>
  )
}
