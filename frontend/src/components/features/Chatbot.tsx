import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", content: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate a highly trained, strict bot that prevents hallucination
    setTimeout(() => {
      let botResponse = "";
      const lowerInput = userMessage.content.toLowerCase();

      // "Training" data & rules
      if (lowerInput.includes("create task") || lowerInput.includes("add task") || lowerInput.includes("new task")) {
        botResponse = "To create a task, navigate to the Tasks page and click the 'New task' button in the top right corner. You can set the title, description, priority, and due date there.";
      } 
      else if (lowerInput.includes("status") || lowerInput.includes("move task") || lowerInput.includes("progress")) {
        botResponse = "You can change a task's status (BACKLOG, TODO, IN_PROGRESS, REVIEW, DONE, ARCHIVED) by clicking the three-dot menu (...) on any task card and selecting 'Change Status'.";
      }
      else if (lowerInput.includes("delete")) {
        botResponse = "To delete a task, open the three-dot action menu on the task card and click 'Delete Task'. You will be asked to confirm before it is permanently removed.";
      }
      else if (lowerInput.includes("priority")) {
        botResponse = "Tasks can have one of four priorities: URGENT, HIGH, MEDIUM, and LOW. Urgent and High tasks will be highlighted in red.";
      }
      else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
        botResponse = "Hello! I am the Taskline Assistant. I am strictly trained to answer questions about using this platform (creating tasks, changing statuses, etc.). How can I help?";
      }
      else {
        botResponse = "I am a highly constrained task management assistant. To prevent hallucination, I only answer questions related to managing tasks, projects, and workflows on this platform. Could you please rephrase your question to be about Taskline?";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: botResponse,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100",
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition-all duration-300 ease-in-out sm:w-[400px]",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-10 opacity-0",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Taskline Assistant
              </h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-secondary-foreground rounded-bl-sm",
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
