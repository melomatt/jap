"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Bot, Loader2, ChevronDown } from "lucide-react";
import { getOrCreateConversation, getConversationMessages, sendMessage, triggerTimeoutBot } from "@/app/actions/chat";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Initialize Customer ID
    useEffect(() => {
        let id = localStorage.getItem("jap_chat_customer_id");
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem("jap_chat_customer_id", id);
        }
        setCustomerId(id);
    }, []);

    // Load messages when opened
    useEffect(() => {
        if (isOpen && customerId && !conversationId) {
            initChat();
        }
    }, [isOpen, customerId]);

    // Setup Realtime subscription
    useEffect(() => {
        if (!conversationId) return;

        const channel = supabase
            .channel('public:chat_messages')
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'chat_messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload: any) => {
                const newMsg = payload.new;
                setIsTyping(false); // Stop typing when any new message (bot or agent) arrives
                setMessages(prev => {
                    if (prev.find(m => m.id === newMsg.id)) return prev;
                    
                    if (newMsg.sender_type === 'customer') {
                        const optIdx = prev.findIndex(m => m.isOptimistic && m.content === newMsg.content);
                        if (optIdx !== -1) {
                            const newList = [...prev];
                            newList[optIdx] = newMsg;
                            return newList;
                        }
                    }
                    
                    return [...prev, newMsg];
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, supabase]);

    // Auto-scroll
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }

        // Smart Timeout Logic (1 minute)
        if (messages.length > 0 && conversationId) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.sender_type === 'customer') {
                const timer = setTimeout(() => {
                    setIsTyping(true); // Show typing before Sando jumps in via timeout
                    triggerTimeoutBot(conversationId);
                }, 60000); // 60 seconds
                return () => clearTimeout(timer);
            }
        }
    }, [messages, conversationId]);

    // Safety Timeout for Typing Indicator
    useEffect(() => {
        if (isTyping) {
            const timer = setTimeout(() => {
                setIsTyping(false);
            }, 10000); // Clear after 10s if no message arrives
            return () => clearTimeout(timer);
        }
    }, [isTyping]);

    const initChat = async () => {
        setIsLoading(true);
        const { data: conv, error } = await getOrCreateConversation(customerId!);
        if (conv) {
            setConversationId(conv.id);
            const { data: msgs } = await getConversationMessages(conv.id);
            if (msgs) setMessages(msgs);
        }
        setIsLoading(false);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationId) return;

        const content = newMessage.trim();
        setNewMessage("");
        setIsSending(true);

        const tempId = crypto.randomUUID();
        setMessages(prev => [...prev, { 
            id: tempId, 
            content, 
            sender_type: 'customer', 
            created_at: new Date().toISOString(),
            isOptimistic: true 
        }]);

        const result = await sendMessage(conversationId, content, 'customer');
        
        // Only show typing indicator if the server confirmed a bot response is coming
        if (result.success && result.isBotReplying) {
            setIsTyping(true);
        }

        if (result.success && result.data) {
            setMessages(prev => prev.map(m => m.id === tempId ? result.data : m));
        }
        setIsSending(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 30, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        className="bg-white/95 dark:bg-[#1D1D1F]/90 backdrop-blur-3xl w-full sm:w-[420px] h-[85dvh] sm:h-[500px] fixed sm:relative bottom-0 right-0 sm:bottom-auto sm:right-auto sm:rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-white/20 dark:border-white/5"
                    >
                        {/* Header */}
                        <div className="px-8 py-5 pt-6 sm:pt-6 flex justify-between items-center bg-white/10 dark:bg-black/10 border-b border-gray-200/50 dark:border-white/5 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1D1D1F] rounded-full"></div>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">JAP Support</h3>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Always Online</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all active:scale-90"
                            >
                                <ChevronDown className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 scrollbar-hide">
                            {isLoading && (
                                <div className="flex justify-center items-center h-full text-blue-600">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            )}
                            {!isLoading && messages.length === 0 && (
                                <div className="text-center py-10 space-y-4">
                                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full mx-auto flex items-center justify-center">
                                        <MessageCircle className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white">Start a Conversation</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 px-10 leading-relaxed">Our advisors are ready to support your legal journey.</p>
                                    </div>
                                </div>
                            )}
                            {messages.map((msg, i) => {
                                const isCustomer = msg.sender_type === 'customer';
                                const sameAsPrev = i > 0 && messages[i-1].sender_type === msg.sender_type;
                                
                                return (
                                    <motion.div 
                                        key={msg.id || i}
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'} ${sameAsPrev ? 'mt-1' : 'mt-5'}`}
                                    >
                                        {!isCustomer && !sameAsPrev && (
                                            <div className="flex items-center gap-2 mb-1.5 ml-1">
                                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">
                                                    <Bot className="w-3 h-3" />
                                                </div>
                                                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">Sando</span>
                                            </div>
                                        )}
                                        <div className={`max-w-[88%] px-5 py-3 text-[16px] sm:text-[15px] leading-relaxed font-medium transition-all ${
                                            isCustomer 
                                                ? 'bg-[#007AFF] text-white rounded-[1.4rem] rounded-br-[0.3rem] shadow-sm' 
                                                : 'bg-[#F2F2F7] dark:bg-[#2C2C2E] text-gray-900 dark:text-white rounded-[1.4rem] rounded-bl-[0.3rem] shadow-sm'
                                        }`}>
                                            {msg.content}
                                        </div>
                                        {!sameAsPrev && (
                                            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 mt-1.5 px-2 uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </motion.div>
                                );
                            })}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-start mt-2 ml-1"
                                >
                                    <div className="flex items-center gap-2 mb-1.5 ml-1">
                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">
                                            <Bot className="w-3 h-3" />
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">Sando</span>
                                    </div>
                                    <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] px-4 py-3 rounded-[1.4rem] rounded-bl-[0.3rem] shadow-sm flex gap-1 items-center">
                                        <motion.div 
                                            animate={{ scale: [1, 1.2, 1] }} 
                                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                            className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" 
                                        />
                                        <motion.div 
                                            animate={{ scale: [1, 1.2, 1] }} 
                                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                            className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" 
                                        />
                                        <motion.div 
                                            animate={{ scale: [1, 1.2, 1] }} 
                                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                            className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full" 
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/10 dark:bg-black/10 border-t border-gray-200/50 dark:border-white/5 pb-10 sm:pb-6">
                            <form 
                                onSubmit={handleSend} 
                                className="flex items-center gap-2 bg-gray-100 dark:bg-[#2C2C2E] rounded-3xl p-1.5 pl-4 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all border border-transparent focus-within:border-blue-500/30"
                            >
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="iMessage..."
                                    className="flex-1 bg-transparent border-none outline-none text-[16px] sm:text-[15px] py-1 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                                <motion.button 
                                    whileTap={{ scale: 0.9 }}
                                    type="submit" 
                                    disabled={!newMessage.trim() || isSending}
                                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 shrink-0 shadow-lg shadow-blue-500/20"
                                >
                                    <Send className="w-4 h-4 fill-current" />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
                    isOpen 
                        ? 'bg-gray-100 dark:bg-[#2C2C2E] text-gray-600 dark:text-gray-400' 
                        : 'bg-blue-600 text-white'
                }`}
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
            </motion.button>
        </div>
    );
}
