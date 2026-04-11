"use client";

import { useState, useEffect, useRef } from "react";
import { getConversationMessages, sendMessage, resolveConversation, deleteConversation } from "@/app/actions/chat";
import { User, Bot, Send, CheckCircle, Clock, Eye, Trash2, MessageSquareText, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLoader } from "@/components/providers/LoadingProvider";
import toast from "react-hot-toast";

export default function AdminChatDashboard({ initialConversations }: { initialConversations: any[] }) {
    const [conversations, setConversations] = useState(initialConversations);
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const { showLoader, hideLoader } = useLoader();

    // Setup Realtime subscriptions
    useEffect(() => {
        const allMsgsChannel = supabase
            .channel('admin:chat_messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, 
            (payload: any) => {
                const newMsg = payload.new;
                
                // Update active chat if currently open
                if (newMsg.conversation_id === activeConvId) {
                    setMessages(prev => {
                        if (prev.find(m => m.id === newMsg.id)) return prev;
                        
                        // Deduplicate optimistic admin messages
                        if (newMsg.sender_type === 'admin') {
                            const optIdx = prev.findIndex(m => m.isOptimistic && m.content === newMsg.content);
                            if (optIdx !== -1) {
                                const newList = [...prev];
                                newList[optIdx] = newMsg;
                                return newList;
                            }
                        }
                        
                        return [...prev, newMsg];
                    });
                }

                // Update the table list (move to top and update preview)
                setConversations(prev => {
                    const convIdx = prev.findIndex(c => c.id === newMsg.conversation_id);
                    if (convIdx >= 0) {
                        const updatedConv = { ...prev[convIdx], lastMessage: newMsg, updatedAt: newMsg.created_at };
                        const newList = [...prev.slice(0, convIdx), ...prev.slice(convIdx + 1)];
                        return [updatedConv, ...newList];
                    } else {
                        return [{
                            id: newMsg.conversation_id,
                            customerId: "New Customer",
                            status: "active",
                            updatedAt: newMsg.created_at,
                            lastMessage: newMsg
                        }, ...prev];
                    }
                });
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_conversations' },
            (payload: any) => {
                // Update status in the table list
                setConversations(prev => {
                    const convIdx = prev.findIndex(c => c.id === payload.new.id);
                    if (convIdx >= 0) {
                        const newList = [...prev];
                        newList[convIdx] = { ...newList[convIdx], status: payload.new.status };
                        return newList;
                    }
                    return prev;
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(allMsgsChannel);
        };
    }, [activeConvId, supabase]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const openConversation = async (id: string) => {
        setActiveConvId(id);
        showLoader("Loading conversation...");
        const { data } = await getConversationMessages(id);
        hideLoader();
        if (data) setMessages(data);
    };

    const closeConversation = () => {
        setActiveConvId(null);
        setMessages([]);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConvId) return;

        const content = newMessage.trim();
        setNewMessage("");
        setIsSending(true);

        const tempId = crypto.randomUUID();
        setMessages(prev => [...prev, { 
            id: tempId, 
            content, 
            sender_type: 'admin', 
            created_at: new Date().toISOString(),
            isOptimistic: true 
        }]);

        const { error } = await sendMessage(activeConvId, content, 'admin');
        if (error) {
            toast.error("Failed to send message: " + error);
        }
        setIsSending(false);
    };

    const handleResolve = async (id: string) => {
        showLoader("Resolving conversation...");
        const { error } = await resolveConversation(id);
        hideLoader();
        
        if (error) {
            toast.error("Failed to resolve chat: " + error);
        } else {
            toast.success("Chat resolved successfully");
            if (activeConvId === id) closeConversation();
        }
    };

    const confirmDelete = async () => {
        if (conversationToDelete) {
            showLoader("Deleting conversation...");
            const { error } = await deleteConversation(conversationToDelete);
            hideLoader();

            if (error) {
                toast.error("Failed to delete chat: " + error);
            } else {
                toast.success("Chat deleted successfully");
                setConversations(prev => prev.filter(c => c.id !== conversationToDelete));
                if (activeConvId === conversationToDelete) closeConversation();
                setConversationToDelete(null);
            }
        }
    };

    const activeConversationObj = conversations.find(c => c.id === activeConvId);

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Support Chats</h1>
            </div>

            {/* Chats Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full min-w-[900px] text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 font-medium">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Message</th>
                                <th className="px-6 py-4">Updated</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {conversations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No conversations found.
                                    </td>
                                </tr>
                            )}
                            {conversations.map(conv => {
                                const isResolved = conv.status === "resolved";
                                return (
                                    <tr key={conv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            Visitor #{conv.id.substring(0,6)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                isResolved 
                                                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' 
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                            }`}>
                                                {isResolved ? 'Resolved' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-sm">
                                            <div className="truncate text-gray-500 dark:text-gray-400">
                                                {conv.lastMessage ? (
                                                    <>
                                                        {conv.lastMessage.sender_type === 'admin' ? <span className="font-medium">You: </span> : conv.lastMessage.sender_type === 'bot' ? <span className="font-medium text-blue-500">Bot: </span> : ''}
                                                        {conv.lastMessage.content}
                                                    </>
                                                ) : (
                                                    <i>No messages</i>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(conv.updatedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!isResolved && (
                                                    <button 
                                                        onClick={() => openConversation(conv.id)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                        title="Reply"
                                                    >
                                                        <MessageSquareText className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {isResolved && (
                                                    <button 
                                                        onClick={() => openConversation(conv.id)}
                                                        className="p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {!isResolved && (
                                                    <button 
                                                        onClick={() => handleResolve(conv.id)}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                        title="Resolve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => setConversationToDelete(conv.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Chat Modal / Slide-over Overlay */}
            {activeConvId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl h-[80vh] flex flex-col rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95">
                        
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Visitor #{activeConvId.substring(0,8)}...</h3>
                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                    {activeConversationObj?.status === 'active' ? (
                                        <p className="text-xs text-green-600 font-medium flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active</p>
                                    ) : (
                                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400"></span> Resolved</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {activeConversationObj?.status === 'active' && (
                                    <button 
                                        onClick={() => handleResolve(activeConvId)}
                                        className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-400 dark:bg-green-900/30 dark:hover:bg-green-900/50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Resolve
                                    </button>
                                )}
                                <button onClick={closeConversation} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                            {messages.map((msg, i) => {
                                const isAdmin = msg.sender_type === 'admin';
                                const isBot = msg.sender_type === 'bot';
                                return (
                                    <div key={msg.id || i} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-end gap-2 max-w-[85%] md:max-w-[70%]">
                                            {!isAdmin && (
                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 mb-1 shadow-sm">
                                                    {isBot ? <Bot className="w-4 h-4 text-gray-600" /> : <User className="w-4 h-4 text-blue-600" />}
                                                </div>
                                            )}
                                            <div>
                                                {isBot && <span className="text-[11px] text-gray-500 ml-2 mb-1 block font-medium">Sando (Virtual Assistant)</span>}
                                                <div className={`px-4 py-2.5 text-sm rounded-2xl shadow-sm ${
                                                    isAdmin 
                                                        ? 'bg-blue-600 text-white rounded-br-sm' 
                                                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm border border-gray-100 dark:border-gray-600'
                                                }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-gray-400 mt-1 mx-10 font-medium">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Reply Input */}
                        <form onSubmit={handleSend} className="p-4 bg-gray-50 dark:bg-gray-900/80 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                            {activeConversationObj?.status === 'resolved' ? (
                                <div className="flex-1 text-center text-sm text-gray-500 py-2">
                                    This conversation has been resolved and is read-only.
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your reply here..."
                                        className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-xl px-4 py-2.5 text-sm outline-none transition-all dark:text-white shadow-sm"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim() || isSending}
                                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 font-semibold disabled:opacity-50 disabled:hover:shadow-none"
                                    >
                                        <span className="hidden sm:inline">Send Response</span>
                                        <Send className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {conversationToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 animate-in zoom-in-95">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Chat</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                            Are you sure you want to permanently delete this conversation and all its messages? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 flex-wrap">
                            <button 
                                onClick={() => setConversationToDelete(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                            >
                                Yes, Delete Match
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
