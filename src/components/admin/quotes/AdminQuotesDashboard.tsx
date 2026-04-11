"use client";

import { useState, useEffect } from "react";
import { deleteQuote, markQuoteAsReplied } from "@/app/actions/quote";
import { Eye, Trash2, Send, X, Clock, Reply, CheckCircle, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLoader } from "@/components/providers/LoadingProvider";
import toast from "react-hot-toast";


export default function AdminQuotesDashboard({ initialQuotes }: { initialQuotes: any[] }) {
    const [quotes, setQuotes] = useState(initialQuotes);
    const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
    const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);
    
    const [replySubject, setReplySubject] = useState("");
    const [replyMessage, setReplyMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel('admin:quotes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quotes' }, 
            (payload: any) => {
                setQuotes(prev => [payload.new, ...prev]);
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'quotes' },
            (payload: any) => {
                setQuotes(prev => prev.map(q => q.id === payload.new.id ? payload.new : q));
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [supabase]);

    const activeQuote = quotes.find(q => q.id === activeQuoteId);

    const generateMailtoLink = () => {
        if (!activeQuote) return "#";
        const subject = encodeURIComponent(`Re: Quote Request - ${activeQuote.matter}`);
        const body = encodeURIComponent(`Hi ${activeQuote.name},\n\nThank you for reaching out to Justice Advocates & Partners. We have received your request regarding "${activeQuote.matter}".\n\n[Type your reply here...]`);
        return `mailto:${activeQuote.email}?subject=${subject}&body=${body}`;
    };

    const generateGmailLink = () => {
        if (!activeQuote) return "#";
        const subject = encodeURIComponent(`Re: Quote Request - ${activeQuote.matter}`);
        const body = encodeURIComponent(`Hi ${activeQuote.name},\n\nThank you for reaching out to Justice Advocates & Partners. We have received your request regarding "${activeQuote.matter}".\n\n[Type your reply here...]`);
        return `https://mail.google.com/mail/?view=cm&fs=1&to=${activeQuote.email}&su=${subject}&body=${body}`;
    };

    const handleMarkAsReplied = async () => {
        if (!activeQuote) return;
        setIsSending(true);
        showLoader("Updating quote status...");
        const { error } = await markQuoteAsReplied(activeQuote.id);
        setIsSending(false);
        hideLoader();
        if (error) {
            toast.error("Error updating quote status: " + error);
        } else {
            toast.success("Quote marked as replied");
            setActiveQuoteId(null);
            // Realtime automatically updates the table status
        }
    };

    const confirmDelete = async () => {
        if (quoteToDelete) {
            showLoader("Deleting quote request...");
            await deleteQuote(quoteToDelete);
            toast.success("Quote deleted successfully");
            setQuotes(prev => prev.filter(c => c.id !== quoteToDelete));
            if (activeQuoteId === quoteToDelete) setActiveQuoteId(null);
            setQuoteToDelete(null);
            hideLoader();
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quote Requests</h1>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full min-w-[1000px] text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Matter</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Received</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {quotes.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No quotes found.
                                    </td>
                                </tr>
                            )}
                            {quotes.map(quote => {
                                const isReplied = quote.status === "replied";
                                return (
                                    <tr key={quote.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!isReplied ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}`}>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {quote.name}
                                        </td>
                                        <td className="px-6 py-4">{quote.email}</td>
                                        <td className="px-6 py-4 truncate max-w-[150px]">{quote.matter}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                isReplied 
                                                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' 
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                            }`}>
                                                {isReplied ? 'Replied' : 'Action Required'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(quote.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setActiveQuoteId(quote.id)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                    title={isReplied ? "View Quote" : "Reply to Quote"}
                                                >
                                                    {isReplied ? <Eye className="w-4 h-4" /> : <Reply className="w-4 h-4" />}
                                                </button>
                                                <button 
                                                    onClick={() => setQuoteToDelete(quote.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                    title="Delete Quote"
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

            {/* View / Reply Modal */}
            {activeQuote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-4xl h-[90vh] flex flex-col md:flex-row rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95">
                        
                        {/* Left Side: Quote Details */}
                        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Quote Details</h2>
                                        <p className="text-sm text-gray-500">Submitted on {new Date(activeQuote.created_at).toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => setActiveQuoteId(null)} className="md:hidden p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase">Name</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activeQuote.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase">Email</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-all">{activeQuote.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase">Phone</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activeQuote.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase">Budget</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activeQuote.budget}</p>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Matter / Context</p>
                                        <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200">
                                            {activeQuote.matter}
                                        </div>
                                    </div>

                                    {activeQuote.message && (
                                        <div className="pt-2">
                                            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Additional Message</p>
                                            <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                                {activeQuote.message}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Email Reply Action */}
                        <div className="w-full md:w-1/2 flex flex-col bg-white dark:bg-gray-800 relative z-10" style={{boxShadow: "-10px 0 15px -3px rgba(0,0,0,0.05)"}}>
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Send className="w-4 h-4 text-blue-600" /> Actions
                                </h3>
                                <button onClick={() => setActiveQuoteId(null)} className="hidden md:flex p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col p-6 items-center justify-center text-center space-y-6">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                                    <Mail className="w-10 h-10" />
                                </div>
                                
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reply to Customer</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                        Open your native email app to compose and send a reply directly to the customer. This ensures the email comes securely from your existing inbox.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
                                    <a 
                                        href={generateGmailLink()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-red-600 text-white px-5 py-3 rounded-xl hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2 font-semibold"
                                    >
                                        <Mail className="w-4 h-4" /> Reply via Gmail Web
                                    </a>

                                    <a 
                                        href={generateMailtoLink()}
                                        className="w-full bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 font-semibold"
                                    >
                                        <Mail className="w-4 h-4" /> Open Default Mail App
                                    </a>
                                    
                                    {activeQuote.status !== 'replied' && (
                                        <button 
                                            onClick={handleMarkAsReplied}
                                            disabled={isSending}
                                            className="w-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-5 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                                        >
                                            <CheckCircle className="w-4 h-4" /> 
                                            {isSending ? 'Updating...' : 'Mark as Replied'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {quoteToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 animate-in zoom-in-95">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Quote</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                            Are you sure you want to permanently delete this quote request? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 flex-wrap">
                            <button 
                                onClick={() => setQuoteToDelete(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                            >
                                Yes, Delete Quote
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
