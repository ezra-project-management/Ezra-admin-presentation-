"use client";

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Revenue projections Q2",
  "Book a Banquet Hall event",
  "Staff salary breakdown",
  "Nyama Choma schedule",
  "Wellness service prices",
  "Report maintenance issue",
];

export default function EzraChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "👋 Hi! I'm the Ezra Annex Admin AI.\n\nI can help with bookings, revenue reports, staff info, wellness pricing, maintenance, and more. What can I help you with?",
        },
      ]);
    }
  }, [open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.message || "Sorry, I couldn't get a response. Please try again." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 96) + "px";
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI chat" : "Open Ezra Annex AI chat"}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "#1D9E75",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
          zIndex: 9999,
          transition: "background 0.15s, transform 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#0F6E56")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#1D9E75")}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "88px",
            right: "24px",
            width: "360px",
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "560px",
            background: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            zIndex: 9998,
          }}
        >
          {/* Header */}
          <div style={{ background: "#1D9E75", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%", background: "#0F6E56",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 600, color: "#E1F5EE", flexShrink: 0,
            }}>EA</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#fff", fontSize: "14px", fontWeight: 500, margin: 0, lineHeight: 1.3 }}>Ezra Annex Admin AI</p>
              <span style={{ color: "#9FE1CB", fontSize: "11px" }}>● Online — Ask me anything</span>
            </div>
          </div>

          {/* Quick suggestion chips */}
          {messages.length <= 1 && (
            <div style={{
              padding: "10px 12px 8px",
              display: "flex", flexWrap: "wrap", gap: "6px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              background: "#16162a",
              flexShrink: 0,
            }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    fontSize: "11px", padding: "4px 10px", borderRadius: "20px",
                    background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                    color: "#9FE1CB", cursor: "pointer", whiteSpace: "nowrap",
                    transition: "background 0.12s, border-color 0.12s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(29,158,117,0.2)"; e.currentTarget.style.borderColor = "#1D9E75"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: "10px", minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: "8px", alignItems: "flex-end" }}>
                {msg.role === "assistant" && (
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%", background: "#0F6E56",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "9px", fontWeight: 600, color: "#E1F5EE", flexShrink: 0,
                  }}>EA</div>
                )}
                <div style={{
                  maxWidth: "82%", padding: "9px 13px", borderRadius: "14px",
                  fontSize: "13px", lineHeight: 1.55,
                  background: msg.role === "user" ? "#1D9E75" : "rgba(255,255,255,0.07)",
                  color: msg.role === "user" ? "#fff" : "rgba(255,255,255,0.9)",
                  border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%", background: "#0F6E56",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "9px", fontWeight: 600, color: "#E1F5EE", flexShrink: 0,
                }}>EA</div>
                <div style={{
                  padding: "10px 14px", borderRadius: "14px",
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", gap: "4px", alignItems: "center",
                }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span key={i} style={{
                      width: "6px", height: "6px", borderRadius: "50%", background: "#9FE1CB",
                      display: "inline-block",
                      animation: "ezra-bounce 1.2s infinite",
                      animationDelay: `${delay}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <form onSubmit={handleSubmit} style={{
            padding: "10px 12px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex", gap: "8px", alignItems: "flex-end",
            background: "#16162a", flexShrink: 0,
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleTextareaInput}
              placeholder="Ask about bookings, budgets, staff…"
              rows={1}
              style={{
                flex: 1, border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
                padding: "8px 11px", fontSize: "13px", resize: "none",
                minHeight: "36px", maxHeight: "96px",
                background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.9)",
                lineHeight: 1.4, outline: "none", fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: input.trim() && !loading ? "#1D9E75" : "rgba(255,255,255,0.1)",
                border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.15s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes ezra-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
