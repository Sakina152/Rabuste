import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Coffee, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

export default function AiBaristaBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: "Hey there! 👋 I'm your Rabuste Barista. How are you feeling today? (e.g., Sleepy, Stressed, Happy)" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Auto-scroll to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");

        // Add User Message
        const newHistory = [...messages, { role: 'user', content: userMessage } as Message];
        setMessages(newHistory);
        setIsLoading(true);

        try {
            // Send to Backend
            const response = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: newHistory.slice(-5) // Send last 5 messages for context
                })
            });

            const data = await response.json();

            // Add Bot Response
            setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: "Oops! I spilled the coffee. Try again?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">

            {/* 1. Chat Window */}
            {isOpen && (
                <div className="bg-stone-900 border border-stone-700 w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-10 fade-in duration-300">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-yellow-700 to-yellow-600 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-white">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Coffee size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold">Rabuste AI</h3>
                                <p className="text-xs text-yellow-100 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-900 scrollbar-thin scrollbar-thumb-stone-700">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-yellow-600 text-white rounded-br-none'
                                            : 'bg-stone-800 text-stone-200 border border-stone-700 rounded-bl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-stone-800 p-3 rounded-2xl rounded-bl-none border border-stone-700 flex items-center gap-2 text-stone-400 text-sm">
                                    <Loader2 size={14} className="animate-spin" /> Brewing answer...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-stone-800 border-t border-stone-700">
                        <div className="flex items-center gap-2 bg-stone-900 border border-stone-600 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-yellow-600 transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="I'm feeling sleepy..."
                                className="flex-1 bg-transparent text-white placeholder-stone-500 text-sm outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="text-yellow-500 hover:text-yellow-400 disabled:opacity-50 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'scale-0' : 'scale-100'} transition-transform duration-300 bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center group`}
            >
                <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
                {/* Notification Badge */}
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
        </div>
    );
}