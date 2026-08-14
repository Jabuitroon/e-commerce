import { useEffect, useRef, useState } from "react"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import type { ChatMessage } from "../interfaces/interfaces"

export function Chat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll al final cuando llegan mensajes nuevos
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, loading])

  // Enfocar el input al abrir el panel
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    setError("")

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: input }]

    // Agregamos el turno del usuario y un mensaje vacío del asistente que iremos rellenando
    setMessages([...newMessages, { role: "assistant", content: "" }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatMessages: newMessages }),
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let assistantText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        assistantText += decoder.decode(value)

        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: "assistant", content: assistantText }
          return updated
        })
      }
    } catch {
      setError("Error al comunicarse con la IA")
      // Quitamos el mensaje vacío del asistente si falló
      setMessages((prev) => prev.filter((m, i) => !(i === prev.length - 1 && m.content === "")))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {/* Panel del chat */}
      {open && (
        <div className="flex h-[32rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-blue-500 bg-slate-200 text-card-foreground shadow-2xl">
          {/* Encabezado */}
          <header className="flex items-center justify-between gap-3 border-b border-border bg-blue-800/80 px-4 py-3 text-blue-500">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-400 text-amber-50">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <p className="text-sm text-blue-300 font-semibold">Asistente IA</p>
                <p className="text-xs text-slate-200/80">Siempre disponible</p>
              </div>
            </div>
          </header>

          {/* Mensajes */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                <Bot className="h-10 w-10 opacity-40" aria-hidden="true" />
                <p className="text-sm text-pretty">¿En qué puedo ayudarte hoy?</p>
              </div>
            )}

            {messages.map((message, i) => {
              const isUser = message.role === "user"
              const isEmptyAssistant = !isUser && message.content === ""
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[90%] whitespace-pre-wrap overflow-x-hidden rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      isUser
                        ? "rounded-br-sm bg-blue-800/80 text-blue-100"
                        : "rounded-bl-sm bg-slate-100 text-foreground shadow-sm"
                    }`}
                  >
                    {isEmptyAssistant ? <TypingDots /> : message.content}
                  </div>
                </div>
              )
            })}

            {error && (
              <p role="alert" className="text-center text-xs text-destructive">
                {error}
              </p>
            )}
          </div>

          {/* Entrada de texto */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            className="flex items-center gap-2 border-t border-blue-600 p-3"
          >
            <input
              ref={inputRef}
              value={input}
              placeholder="Pregúntame..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              className="flex-1 rounded-full border border-input px-4 py-2 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Enviar mensaje"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-slate-200 transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}

      {/* Botón lanzador */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
      </button>
    </div>
  )
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="El asistente está escribiendo">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-2 w-2 animate-bounce rounded-full bg-blue-800/60"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}
