import { SmileIcon } from 'lucide-react'
import { useState } from 'react'

type MessageInputProps = {
  onSend: (content: string) => void
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage('')
    }
  }

  return (
    <div className="p-4 w-full bg-white border-t border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="border rounded-3xl px-3 py-2 flex items-center border-slate-300 bg-white"
      >
        <SmileIcon className="w-6 h-6 mr-2 text-gray-500" />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhắn tin..."
          className="flex-1 outline-none px-2 text-base"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="text-blue-500 font-semibold outline-none px-2 disabled:opacity-50"
        >
          Gửi
        </button>
      </form>
    </div>
  )
}
