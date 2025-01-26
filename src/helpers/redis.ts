const upstashRedisRestUrl = process.env.UPSTASH_REDIS_URL
const authToken = process.env.UPSTASH_REDIS_TOKEN

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(command: Command, ...args: (string | number)[]) {
  console.log('Upstash Redis URL:', upstashRedisRestUrl)
  console.log('Upstash Redis Token:', authToken)
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`

  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`)
  }

  const data = await response.json()
  return data.result
}
