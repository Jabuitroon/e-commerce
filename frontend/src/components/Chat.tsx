import { useState } from 'react'

import { ChatMessage } from '@e-commerce/chatbot'

export const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]

    setMessages(newMessages)
    setInput('')
    setLoading(true)

    // 🔥 mensaje vacío del asistente
    console.log('array de mensajes', newMessages)

    const res = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatMessages: newMessages }),
    })

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    let assistantText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      assistantText += chunk

      // 🔥 actualizar último mensaje
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1].content = assistantText
        return updated
      })
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ minHeight: 400 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === 'user' ? 'right' : 'left',
              margin: '10px 0',
            }}
          >
            <span
              style={{
                background: msg.role === 'user' ? '#007bff' : '#eee',
                color: msg.role === 'user' ? '#fff' : '#000',
                padding: '8px 12px',
                borderRadius: '10px',
                display: 'inline-block',
              }}
            >
              {msg.content || '...'}
            </span>
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Escribe tu mensaje...'
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Pensando...' : 'Enviar'}
      </button>
    </div>
  )
}
