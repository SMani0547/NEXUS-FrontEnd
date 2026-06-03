import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAskMutation } from "@/hooks/useNexusApi";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "Nexus AI - Ask Questions About Pacific Data" },
      { name: "description", content: "Chat with Nexus AI to explore Pacific crop and livestock yield data through natural language." },
    ],
  }),
  component: AIPage,
});

const SUGGESTIONS = [
  "How has Fiji's crop yield changed over time?",
  "Compare Fiji and Samoa.",
  "Which countries have the highest livestock yield?",
  "What trends can be observed across the Pacific?",
  "Which products show the strongest growth?",
  "How diverse is agricultural production across Pacific countries?",
];

type Message = { id: string; role: "user" | "assistant"; content: string };

function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const askMutation = useAskMutation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: q }]);
    setInput("");
    setTyping(true);

    try {
      const response = await askMutation.mutateAsync(q);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: response.answer }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The backend could not answer right now.";
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: message }]);
    } finally {
      setTyping(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-accent font-medium mb-2">Nexus AI</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Ask Questions About The Data</h1>
            <p className="text-muted-foreground max-w-2xl">
              Have a conversation with the Pacific Dataviz Challenge datasets in plain language.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="space-y-3">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-display font-semibold text-sm">Suggested Questions</span>
              </div>
              <div className="space-y-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={typing}
                    className="w-full text-left text-xs p-3 rounded-lg bg-muted/50 hover:bg-accent/10 hover:text-accent transition-colors border border-transparent hover:border-accent/30 disabled:opacity-60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-muted-foreground px-2 leading-relaxed">
              Answers are generated from the backend dataset context.
            </div>
          </aside>

          <div className="bg-card border border-border rounded-2xl shadow-card flex flex-col h-[640px]">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-ocean flex items-center justify-center shadow-glow mb-5">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-2">Nexus AI</h3>
                  <p className="text-muted-foreground max-w-md text-sm">
                    Ask about Pacific agriculture: countries, products, time ranges, trends, and comparisons.
                  </p>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""} animate-fade-in-up`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-ocean text-white shadow-glow"
                  }`}>
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] ${m.role === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: m.content.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex gap-3 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-lg bg-gradient-ocean flex items-center justify-center shadow-glow">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border p-4">
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex gap-2 items-end"
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask about Pacific yields, countries, products..."
                  className="flex-1 resize-none bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
                />
                <Button type="submit" disabled={!input.trim() || typing} className="bg-gradient-ocean text-white border-0 h-11 w-11 p-0 shadow-glow disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
