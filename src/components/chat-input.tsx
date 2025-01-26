'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Send } from 'lucide-react'
import { Button } from './ui/button'

interface ChatInputProps {
  chatPartner: User
  chatId: string
}

export default function ChatInput({ chatPartner, chatId }: ChatInputProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  const sendMessage = async () => {
    if (!input) return
    setIsLoading(true)

    try {
      await axios.post('/api/message/send', { text: input, chatId })
      setInput('')
    } catch {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-t border-gray-200 p-6 sm:mb-0">
      <div className="flex items-center gap-2">
        <input
          className="w-full rounded-md"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
        />
        <Button
          disabled={isLoading || !input}
          onClick={sendMessage}
          type="submit"
          className="flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
