import NextAuth from 'next-auth'

import authConfig from './auth.config'
import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter'
import { db } from './lib/db'
import { fetchRedis } from './lib/redis'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as string | null

      if (!dbUserResult) {
        if (user) {
          token.id = user!.id
        }

        return token
      }

      const dbUser = JSON.parse(dbUserResult) as User

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
      }

      return session
    },
  },
  ...authConfig,
})
