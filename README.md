# Real-Time Chat

![Capture-2025-03-19-105045](https://github.com/user-attachments/assets/821a7df5-8cb2-48c0-92c3-d05a73128645)

A simple real-time chat app to send messages and invite friends.

## Architecture

- TypeScript
- Next.js
- TailwindCSS
- Auth.js
- Upstash (Redis)
- Pusher

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure `.env` file with:

```env
NEXTAUTH_SECRET=supersecret
NEXTAUTH_URL=http://localhost:3000
UPSTASH_REDIS_URL=your-upstash-redis-url
UPSTASH_REDIS_TOKEN=your-upstash-redis-token
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PUSHER_APP_ID=your-pusher-app-id
NEXT_PUBLIC_PUSHER_APP_KEY=your-pusher-app-key
PUSHER_APP_SECRET=your-pusher-app-secret
```

3. Run the app:

```bash
npm run dev
```

___

&#8594; View [Demo](https://realtime-chat-ahu8zlv4d-tiagopacedevs-projects.vercel.app)
