'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Send, ThumbsUp } from 'lucide-react'

const MESSAGE_PLACEHOLDER = 'Type a message...'
const ERROR_MESSAGE = 'Something went wrong. Please try again later.'
const DEFAULT_MESSAGE = '👍'

interface ChatInputProps {
  chatId: string
}

export default function ChatInput({ chatId }: ChatInputProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const sendMessage = async (messageText: string) => {
    if (!messageText) return
    setIsLoading(true)

    try {
      await axios.post('/api/message/send', { text: messageText, chatId })
      setInput('')
    } catch {
      toast.error(ERROR_MESSAGE)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        <Input
          className="rounded-3xl"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={MESSAGE_PLACEHOLDER}
        />
        <Button
          disabled={isLoading}
          onClick={() => sendMessage(input || DEFAULT_MESSAGE)}
          size="icon"
          variant="success"
          type="submit"
          className="flex-shrink-0 rounded-full"
        >
          {input ? <Send /> : <ThumbsUp />}
        </Button>
      </div>
    </div>
  )
}
