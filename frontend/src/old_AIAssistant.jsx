import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bot, MessageCircle, Send, Sparkles, X, LoaderCircle } from 'lucide-react'

const starterMessage = {
  role: 'assistant',
  content: "Hi! I'm your EAPCET - AI assistant. \nAsk me about AP/TG EAPCET, ranks, college options, branches, or how to use this predictor.",
}

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([starterMessage])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
      inputRef.current?.focus()
    }
  }, [isOpen, messages, isSending])

  const sendMessage = async (event) => {
    event?.preventDefault()
    const message = input.trim()
    if (!message || isSending) return

    setInput('')
    setError('')
    setMessages((current) => [...current, { role: 'user', content: message }])
    setIsSending(true)

    try {
        const requestStart = performance.now();
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message }),
      })
      console.log(
  `AI request total time: ${((performance.now() - requestStart) / 1000).toFixed(2)} seconds`
);
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || data.message || 'The assistant could not respond. Please try again.')
      }
      const reply = data.reply || data.response || data.answer
      if (!reply) throw new Error('The assistant returned an empty response. Please try again.')
      setMessages((current) => [...current, { role: 'assistant', content: String(reply) }])
    } catch (err) {
      setError(err.message || 'Unable to connect to the AI assistant. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const resetChat = () => {
    setMessages([starterMessage])
    setError('')
  }

  return (
    <div className="relative z-[100]">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={isOpen}
        className="fixed bottom-5 right-5 z-[101] flex h-14 items-center gap-2.5 rounded-full border border-white/15 bg-[#b7a5ff] px-4 text-[#111019] shadow-[0_12px_45px_rgba(183,165,255,0.28)] transition hover:-translate-y-0.5 hover:bg-[#c9bcff] focus:outline-none focus:ring-2 focus:ring-[#b7a5ff] focus:ring-offset-2 focus:ring-offset-[#08090d] sm:bottom-7 sm:right-7"
      >
        {isOpen ? <X size={21} /> : <MessageCircle size={21} />}
        <span className="text-sm font-semibold">{isOpen ? 'Close chat' : 'Ask AI'}</span>
        {!isOpen && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-[#b7a5ff] bg-emerald-500" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, x: 35, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 25, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="EAPCET AI assistant chat"
            className="fixed bottom-[88px] right-3 z-[100] flex h-[min(680px,calc(100dvh-120px))] w-[min(420px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0e14] text-[#f4f3ef] shadow-[0_25px_100px_rgba(0,0,0,0.65)] sm:bottom-24 sm:right-7"
          >
            <div className="flex items-center justify-between border-b border-white/[0.09] bg-[#12131b] px-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#b7a5ff]/15 text-[#c9bcff]"><Bot size={21} /></div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">EAPCET AI Assistant</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/45"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Gemini-powered guidance</p>
                </div>
              </div>
              <button type="button" onClick={resetChat} className="rounded-lg px-2.5 py-2 text-xs text-white/50 transition hover:bg-white/5 hover:text-white" title="Start a new chat">New chat</button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#b7a5ff]/10 text-[#c9bcff]"><Sparkles size={14} /></div>}
                  <div className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-3 text-[13px] leading-6 ${message.role === 'user' ? 'rounded-br-md bg-[#b7a5ff] text-[#111019]' : 'rounded-bl-md border border-white/[0.08] bg-white/[0.045] text-white/85'}`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex items-start gap-2">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-lg bg-[#b7a5ff]/10 text-[#c9bcff]"><Sparkles size={14} /></div>
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.045] px-3.5 py-3 text-xs text-white/55"><LoaderCircle size={15} className="animate-spin" /> Thinking...</div>
                </div>
              )}
              {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/[0.07] px-3 py-2 text-xs leading-5 text-red-200">{error}</p>}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="border-t border-white/[0.09] bg-[#101117] p-3">
              <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#08090d] p-2 focus-within:border-[#b7a5ff]/50">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      sendMessage(event)
                    }
                  }}
                  placeholder="Ask about ranks, colleges, branches..."
                  rows={1}
                  maxLength={2000}
                  aria-label="Message the AI assistant"
                  className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/30"
                />
                <button type="submit" disabled={!input.trim() || isSending} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#b7a5ff] text-[#111019] transition hover:bg-[#c9bcff] disabled:cursor-not-allowed disabled:opacity-40"><Send size={17} /></button>
              </div>
              <p className="mt-2 px-1 text-[10px] leading-4 text-white/30">AI guidance can be imperfect. Verify counselling details with official sources.</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AIAssistant
