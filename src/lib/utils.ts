import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

// dayjs plugins
dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isSameOrAfter)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort()
  return `${sortedIds[0]}--${sortedIds[1]}`
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, '__')
}

export function formatTimestamp(timestamp: number) {
  const now = dayjs()
  const messageTime = dayjs(timestamp)

  // If it's today, show the time
  if (messageTime.isToday()) {
    return messageTime.format('HH:mm') // 'HH:mm' for hours and minutes
  }

  // If it's this week, show the weekday
  if (messageTime.isSameOrAfter(now.startOf('week'))) {
    return messageTime.format('dddd') // Weekday name, e.g., "Monday"
  }

  // Otherwise, show the full date
  return messageTime.format('MM/DD/YYYY') // or any other date format you prefer
}
