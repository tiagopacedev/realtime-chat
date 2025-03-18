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
    // <div className="p-4 sm:mb-0">
    //   <div className="relative flex items-center">
    //     <Input
    //       className="flex h-10 w-full rounded-md border border-transparent bg-background px-3 py-2 pe-32 text-sm !shadow-transparent !ring-transparent ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 lg:pe-56"
    //       value={input}
    //       onChange={handleInputChange}
    //       onKeyDown={handleKeyDown}
    //       placeholder={MESSAGE_PLACEHOLDER}
    //     />

    //     <div className="absolute end-4 flex items-center">
    //       <Button
    //         disabled={isLoading}
    //         onClick={() => sendMessage(input || DEFAULT_MESSAGE)}
    //         size={input ? 'default' : 'icon'}
    //         variant="outline"
    //         type="submit"
    //         className="flex-shrink-0"
    //       >
    //         {input ? 'Send' : <ThumbsUp />}
    //       </Button>
    //     </div>
    //   </div>
    // </div>

    <div className="px-6 py-6 sm:mb-0">
      <div className="flex items-center gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={MESSAGE_PLACEHOLDER}
        />
        <Button
          disabled={isLoading}
          onClick={() => sendMessage(input || DEFAULT_MESSAGE)}
          size="icon"
          variant="outline"
          type="submit"
          className="flex-shrink-0"
        >
          {input ? <Send /> : <ThumbsUp />}
        </Button>
      </div>
    </div>
  )
}
