import { useState } from 'react'
import { ChatMessage } from '../interfaces/interfaces'
import { Streamdown } from 'streamdown'

export const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: input },
    ]

    setMessages(newMessages)
    setInput('')
    setLoading(true)

    console.log('array de mensajes', newMessages)

    try {
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatMessages: newMessages }),
      })

      // el reader no puede ser null porque el backend siempre responde con un stream, incluso en caso de error
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      let assistantText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantText += chunk

        // actualizar último mensaje
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1].content = assistantText
          return updated
        })
      }
    } catch {
      setError('Error al comunicarse con la IA')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col w-full max-w-md max-h-md py-24 mx-auto stretch'>
      <div className='flex-1 overflow-y-auto mb-4 max-h-md'>
        {messages.map((message, i) => (
          <div key={i} className='mb-4'>
            <strong>{message.role === 'user' ? 'User: ' : 'AI: '}</strong>

            <Streamdown isAnimating={loading}>{message.content}</Streamdown>
          </div>
        ))}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (!input.trim()) return

          try {
            await sendMessage()
            setInput('')
          } catch (error) {
            console.error('Failed to send message:', error)
            // TODO: Show user-friendly error message
            // You could add a toast notification here
          }
        }}
      >
        <input
          className='z-50 bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl'
          value={input}
          placeholder='Pregúntame...'
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
