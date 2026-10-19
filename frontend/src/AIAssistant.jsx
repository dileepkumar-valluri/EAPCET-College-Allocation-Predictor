
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  MessageCircle,
  Send,
  Sparkles,
  X,
  LoaderCircle,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

const starterMessage = {
  role: "assistant",
  content:
    "Hi! I'm your EAPCET AI assistant.\nAsk me about AP/TG EAPCET, ranks, college options, branches, or how to use this predictor.",
};

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([starterMessage]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isSending]);

  const sendMessage = async (event) => {
    event?.preventDefault();

    const message = input.trim();

    if (!message || isSending) return;

    setInput("");
    setError("");

    setMessages((current) => [
      ...current,
      { role: "user", content: message },
    ]);

    setIsSending(true);

    try {
      const requestStart = performance.now();

      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message }),
      });

      console.log(
        `AI request total time: ${(
          (performance.now() - requestStart) /
          1000
        ).toFixed(2)} seconds`
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "The assistant could not respond. Please try again."
        );
      }

      const reply = data.reply || data.response || data.answer;

      if (!reply) {
        throw new Error(
          "The assistant returned an empty response. Please try again."
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: String(reply),
        },
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the AI assistant. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  const resetChat = () => {
    setMessages([starterMessage]);
    setError("");
    setInput("");
  };

  return (
    <div className="relative z-[100]">
      {/* Floating AI button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-5 right-5 z-[101] flex h-14 items-center gap-2.5 rounded-full border border-violet-200/30 bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 px-5 text-[#100B19] shadow-[0_8px_35px_rgba(139,92,246,0.32)] transition-shadow hover:shadow-[0_10px_45px_rgba(139,92,246,0.48)] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-[#08070D] sm:bottom-7 sm:right-7"
      >
        {isOpen ? <X size={21} /> : <MessageCircle size={21} />}

        <span className="text-sm font-semibold">
          {isOpen ? "Close chat" : "Ask AI"}
        </span>

        {!isOpen && (
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-violet-300 bg-emerald-400" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, x: 35, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 25, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-label="EAPCET AI assistant chat"
            className="fixed bottom-[88px] right-3 z-[100] flex h-[min(680px,calc(100dvh-120px))] w-[min(420px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-violet-300/15 bg-[#0C0912]/95 text-[#F5F3FF] shadow-[0_25px_100px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:bottom-24 sm:right-7"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-white/[0.08] bg-[#15101F]/90 px-4 py-4">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />

              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-gradient-to-br from-violet-400/20 to-purple-500/10 text-violet-200">
                  <Bot size={22} />
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#15101F] bg-emerald-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-wide">
                    EAPCET AI Assistant
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/45">
                    <Sparkles size={11} className="text-violet-300" />
                    AI-powered guidance
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetChat}
                title="Start a new chat"
                aria-label="Start a new chat"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] px-2.5 py-2 text-xs text-white/50 transition hover:border-violet-300/20 hover:bg-violet-500/10 hover:text-violet-100"
              >
                <RotateCcw size={12} />
                New chat
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-[#100C18]/60 to-[#0C0912] px-4 py-5"
              aria-live="polite"
            >
              <div className="mb-5 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/35">
                  <Sparkles size={11} className="text-violet-300/70" />
                  EAPCET STUDENT SUPPORT
                </span>
              </div>

              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-violet-300/15 bg-violet-500/10 text-violet-200">
                      <Sparkles size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-3 text-[13px] leading-6 ${
                      message.role === "user"
                        ? "rounded-br-md bg-gradient-to-br from-violet-300 to-purple-300 text-[#160E22] shadow-[0_4px_20px_rgba(139,92,246,0.12)]"
                        : "rounded-bl-md border border-white/[0.075] bg-white/[0.035] text-white/85"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {isSending && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-lg border border-violet-300/15 bg-violet-500/10 text-violet-200">
                    <Sparkles size={14} />
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.035] px-3.5 py-3 text-xs text-white/55">
                    <LoaderCircle
                      size={15}
                      className="animate-spin text-violet-300"
                    />
                    Thinking...
                  </div>
                </motion.div>
              )}

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-3 py-3 text-xs leading-5 text-rose-200"
                >
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form
              onSubmit={sendMessage}
              className="border-t border-white/[0.08] bg-[#120D1A]/95 p-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-white/[0.09] bg-[#09070F] p-2 transition-colors focus-within:border-violet-400/45 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.06)]">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent?.isComposing
                    ) {
                      event.preventDefault();
                      sendMessage(event);
                    }
                  }}
                  placeholder="Ask about ranks, colleges, branches..."
                  rows={1}
                  maxLength={2000}
                  aria-label="Message the AI assistant"
                  className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/30"
                />

                <motion.button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  aria-label="Send message"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-300 to-purple-300 text-[#160E22] shadow-[0_3px_12px_rgba(139,92,246,0.15)] transition hover:shadow-[0_3px_18px_rgba(139,92,246,0.3)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={17} />
                </motion.button>
              </div>

              <p className="mt-2 px-1 text-[10px] leading-4 text-white/30">
                AI guidance can be imperfect. Verify counselling details
                with official sources.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AIAssistant;
