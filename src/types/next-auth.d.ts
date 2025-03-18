/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { type DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  id: string
  name: string
  email: string
  image: string
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
