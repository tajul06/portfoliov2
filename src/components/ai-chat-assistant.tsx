"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, User, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  isStreaming?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "What projects have you built?",
  "How does TalkBuddy work?",
  "What's your ML/AI tech stack?",
  "Show me your GitHub & contact",
];

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMascot, setSelectedMascot] = useState<"ip-2016" | "ip-0119">("ip-2016");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Quack! I'm Waddle, Tajul's AI Duck Assistant. Ask me anything about his projects, skills, or experience!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Trigger mascot expression safely
  const playDuck = useCallback((expression: string) => {
    if (typeof window === "undefined") return;
    const ducks = document.querySelectorAll("exode-mascot");
    ducks.forEach((duck: any) => {
      if (duck && typeof duck.play === "function") {
        try {
          duck.play(expression);
        } catch (e) {
          // ignore error if mascot is initializing
        }
      }
    });
  }, []);

  // When chat opens, scroll to bottom and wave hello
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      const timer = setTimeout(() => {
        playDuck("wave");
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, playDuck]);

  // Keep scrolled when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Escape closes, input autofocuses, background scroll locks while open
  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => openButtonRef.current?.focus(), 0);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
    };

    const botMsgId = (Date.now() + 1).toString();

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);
    setError(null);

    // Bot is working -> duck plays "think"
    playDuck("think");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get response");
      }

      if (!res.body) {
        throw new Error("No response body received");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let displayedText = "";
      let streamDone = false;
      let hasStartedTyping = false;

      // Smooth typewriter display loop (runs concurrently with stream reader)
      const typingPromise = new Promise<void>((resolve) => {
        const step = () => {
          if (displayedText.length < fullText.length) {
            if (!hasStartedTyping) {
              hasStartedTyping = true;
              // Bot starts replying -> duck animates smile
              playDuck("smile");
              setMessages((prev) => [
                ...prev,
                { id: botMsgId, sender: "bot", text: "", isStreaming: true },
              ]);
            }

            const remaining = fullText.length - displayedText.length;
            const charsToAdd = remaining > 100 ? 4 : remaining > 40 ? 2 : 1;
            displayedText = fullText.slice(0, displayedText.length + charsToAdd);

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMsgId
                  ? { ...msg, text: displayedText, isStreaming: true }
                  : msg
              )
            );

            setTimeout(step, 16);
          } else if (!streamDone) {
            setTimeout(step, 25);
          } else {
            // Stream complete and all text displayed
            playDuck("smile");
            if (!hasStartedTyping && fullText) {
              setMessages((prev) => [
                ...prev,
                { id: botMsgId, sender: "bot", text: fullText, isStreaming: false },
              ]);
            } else {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId
                    ? {
                        ...msg,
                        text: displayedText || "No response received.",
                        isStreaming: false,
                      }
                    : msg
                )
              );
            }
            resolve();
          }
        };
        step();
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          streamDone = true;
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
      }
      streamDone = true;

      await typingPromise;
    } catch (err: any) {
      playDuck("nervous");
      setError(err.message || "Something went wrong.");
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === botMsgId);
        const fallbackText =
          err.message ||
          "I couldn't process that right now. Feel free to contact Tajul directly via email.";
        if (exists) {
          return prev.map((msg) =>
            msg.id === botMsgId
              ? { ...msg, text: fallbackText, isStreaming: false }
              : msg
          );
        } else {
          return [
            ...prev,
            { id: botMsgId, sender: "bot", text: fallbackText, isStreaming: false },
          ];
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const isTalking = messages.some((m) => m.isStreaming);

  const handleMascotClick = () => {
    const expressions = ["wink", "laugh", "starstruck", "party", "love", "wave"];
    const pick = expressions[Math.floor(Math.random() * expressions.length)];
    playDuck(pick);
  };

  return (
    <>
      {/* Floating Mascot Launcher (The Mascot itself is the button) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            ref={openButtonRef as any}
            onClick={() => {
              playDuck("wave");
              setIsOpen(true);
            }}
            onMouseEnter={() => {
              playDuck("wave");
            }}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 flex flex-col items-center cursor-pointer select-none group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(true);
              }
            }}
            aria-label="Open AI Duck Assistant"
          >
            {/* Interactive Speech Bubble Prompt */}
            <div className="mb-1 whitespace-nowrap px-3 py-1 rounded-full bg-card/95 border border-border text-[11px] font-semibold text-foreground shadow-lg flex items-center gap-1.5 transition-all duration-200 group-hover:border-accent/50 group-hover:shadow-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ask Waddle</span>
              <Sparkles className="w-3 h-3 text-accent animate-pulse" />
            </div>

            {/* Living Mascot Character */}
            <div className="relative">
              <exode-mascot
                id="floating-duck-mascot"
                mascot={selectedMascot}
                src={`/mascots/${selectedMascot}.bexode`}
                base="/mascots/"
                colors="#ffd23f,#ff8a00,#fff7e0"
                mood="95"
                follow="true"
                style={{ width: "92px", height: "92px", display: "inline-block" }}
              />
              {/* Soft ground shadow under duck feet */}
              <div className="w-16 h-2.5 rounded-[100%] bg-foreground/15 dark:bg-black/50 blur-[2px] mx-auto -mt-2 transition-transform duration-200 group-hover:scale-90 group-hover:opacity-60" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="AI Duck Assistant"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as any }}
            className="fixed inset-x-3 bottom-3 top-[10vh] z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:top-auto sm:w-[410px] sm:h-[min(580px,calc(100dvh-3rem))] bg-background border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header with Interactive Mascot */}
            <div className="px-4 sm:px-5 py-3 border-b border-border bg-card/70 backdrop-blur-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Waddle the Duck interactive avatar */}
                <div
                  onClick={handleMascotClick}
                  title="Click Waddle for a trick! 🦆"
                  className="relative w-12 h-12 rounded-2xl bg-muted/60 border border-border flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform overflow-hidden shadow-sm group shrink-0"
                >
                  {isTalking && (
                    <span className="absolute -inset-0.5 rounded-2xl bg-accent/30 animate-pulse pointer-events-none" />
                  )}
                  <exode-mascot
                    id="duck-mascot-header"
                    mascot={selectedMascot}
                    src={`/mascots/${selectedMascot}.bexode`}
                    base="/mascots/"
                    colors="#ffd23f,#ff8a00,#fff7e0"
                    mood="95"
                    style={{ width: "52px", height: "52px", display: "inline-block" }}
                  />
                  <span className="absolute -bottom-0.5 right-0.5 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-white px-1 rounded-full font-mono">
                    tap!
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-foreground tracking-tight">
                      {selectedMascot === "ip-2016" ? "Waddle" : "Brave Duck"}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-accent/15 text-accent font-semibold tracking-wide">
                      AI DUCK
                    </span>
                  </div>

                  {/* Dynamic Status / Talking Soundwave Animation */}
                  {isTalking ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-accent font-semibold mt-0.5">
                      <span className="flex items-end gap-[2px] h-3">
                        <span className="w-[2.5px] h-3 bg-accent rounded-full animate-bounce [animation-duration:0.6s]" />
                        <span className="w-[2.5px] h-2 bg-accent rounded-full animate-bounce [animation-duration:0.4s]" />
                        <span className="w-[2.5px] h-3.5 bg-accent rounded-full animate-bounce [animation-duration:0.7s]" />
                        <span className="w-[2.5px] h-1.5 bg-accent rounded-full animate-bounce [animation-duration:0.5s]" />
                      </span>
                      <span>Talking...</span>
                    </div>
                  ) : loading ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-500 font-medium mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      <span>Thinking...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                      <span>Online & tracking cursor</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Switch Duck Style: Waddle (3D) vs Brave Duck */}
                <button
                  onClick={() => {
                    const next = selectedMascot === "ip-2016" ? "ip-0119" : "ip-2016";
                    setSelectedMascot(next);
                    setTimeout(() => playDuck("wave"), 150);
                  }}
                  title={`Switch Mascot (Current: ${selectedMascot === "ip-2016" ? "Waddle 3D" : "Brave Duck"})`}
                  className="px-2 py-1 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs border border-border/50 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] hidden sm:inline font-medium">
                    {selectedMascot === "ip-2016" ? "3D" : "2D"}
                  </span>
                </button>

                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm" aria-live="polite">
              {/* Featured Mascot Welcome Card (when conversation is fresh) */}
              {messages.length === 1 && (
                <div className="p-4 mx-1 rounded-2xl bg-card/60 border border-border/80 text-center flex flex-col items-center shadow-sm">
                  <div
                    onClick={handleMascotClick}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    title="Click me to play tricks!"
                  >
                    <exode-mascot
                      mascot={selectedMascot}
                      src={`/mascots/${selectedMascot}.bexode`}
                      base="/mascots/"
                      colors="#ffd23f,#ff8a00,#fff7e0"
                      mood="95"
                      style={{ width: "96px", height: "96px", display: "inline-block" }}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-foreground mt-1">
                    Meet {selectedMascot === "ip-2016" ? "Waddle" : "Brave Duck"}!
                  </h4>
                  <p className="text-[11px] text-muted-foreground max-w-[260px] mt-0.5 leading-relaxed">
                    Tajul&apos;s AI duck companion. It tracks your cursor, reacts to questions, and animates as it talks!
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm select-none shadow-sm">
                      🦆
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none shadow-sm"
                        : "bg-muted text-foreground rounded-bl-none border border-border/50 shadow-sm"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    ) : (
                      <div>
                        {/* Live Talking Audio Equalizer Waveform while streaming */}
                        {msg.isStreaming && (
                          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-border/50 text-[11px] font-semibold text-accent">
                            <span className="flex items-end gap-[2px] h-3">
                              <span className="w-[2.5px] h-3 bg-accent rounded-full animate-bounce [animation-duration:0.5s]" />
                              <span className="w-[2.5px] h-1.5 bg-accent rounded-full animate-bounce [animation-duration:0.35s]" />
                              <span className="w-[2.5px] h-3.5 bg-accent rounded-full animate-bounce [animation-duration:0.65s]" />
                              <span className="w-[2.5px] h-2 bg-accent rounded-full animate-bounce [animation-duration:0.45s]" />
                            </span>
                            <span>Speaking response...</span>
                          </div>
                        )}

                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
                          {msg.text ? (
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent underline font-medium hover:opacity-80"
                                  >
                                    {children}
                                  </a>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-foreground">{children}</strong>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
                                ),
                                li: ({ children }) => <li>{children}</li>,
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          ) : null}
                          {msg.isStreaming && (
                            <span className="inline-block w-1.5 h-3.5 bg-accent ml-0.5 animate-pulse align-middle" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                </div>
              ))}

              {/* Thinking State */}
              {loading && !messages.some((m) => m.isStreaming && m.text.length > 0) && (
                <div className="flex gap-2.5 justify-start items-center">
                  <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-sm animate-pulse">
                    🦆
                  </div>
                  <div className="bg-muted text-foreground rounded-2xl rounded-bl-none px-4 py-2.5 flex items-center gap-2 border border-border/50 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.18s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.36s]" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      Waddle is thinking...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-border/50 bg-card/30">
                <p className="text-[11px] text-muted-foreground mb-1.5 font-medium flex items-center gap-1">
                  <span>💡</span> Ask Waddle:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      disabled={loading}
                      className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors border border-border/40 text-left cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-border bg-card/50 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Waddle about Tajul's projects..."
                maxLength={500}
                disabled={loading}
                aria-label="Ask Waddle a question"
                className="flex-1 px-4 py-2 rounded-full bg-muted/60 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary border border-border/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
