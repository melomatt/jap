"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Mail, Trash2, XCircle, Calendar, CalendarDays, ExternalLink, RefreshCw, CheckCircle, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { deleteEvaluation, markEvaluationAsReplied } from "@/app/actions/evaluation"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useLoader } from "@/components/providers/LoadingProvider"
import toast from "react-hot-toast"

type Evaluation = {
  id: string
  name: string
  email: string
  phone: string
  date: string
  matter: string
  message: string
  status: string
  created_at: string
}

export default function AdminEvaluationsDashboard({ initialEvaluations }: { initialEvaluations: Evaluation[] }) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null)
  const { showLoader, hideLoader } = useLoader()
  
  // Realtime updates
  const router = useRouter()
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'evaluations',
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setEvaluations((prev) => [payload.new as Evaluation, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setEvaluations((prev) => prev.map((e) => e.id === payload.new.id ? payload.new as Evaluation : e))
            if (selectedEval?.id === payload.new.id) {
              setSelectedEval(payload.new as Evaluation)
            }
          } else if (payload.eventType === 'DELETE') {
            setEvaluations((prev) => prev.filter((e) => e.id !== payload.old.id))
            if (selectedEval?.id === payload.old.id) {
              setSelectedEval(null)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedEval])

  // Deletion Modal State
  const [evalToDelete, setEvalToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Status Action State
  const [isMarking, setIsMarking] = useState(false)

  const filteredEvals = useMemo(() => {
    return evaluations.filter((e) => {
      const term = searchTerm.toLowerCase()
      return (
        (e.name && e.name.toLowerCase().includes(term)) ||
        (e.email && e.email.toLowerCase().includes(term)) ||
        (e.matter && e.matter.toLowerCase().includes(term)) ||
        (e.phone && e.phone.toLowerCase().includes(term))
      )
    })
  }, [evaluations, searchTerm])

  const handleDelete = async () => {
    if (!evalToDelete) return
    setIsDeleting(true)
    showLoader("Deleting evaluation request...")
    const { error } = await deleteEvaluation(evalToDelete)
    setIsDeleting(false)
    hideLoader()
    if (error) {
      toast.error("Failed to delete evaluation: " + error)
    } else {
      toast.success("Evaluation request deleted")
      setEvalToDelete(null)
      if (selectedEval?.id === evalToDelete) {
        setSelectedEval(null)
      }
    }
  }

  const handleMarkReplied = async () => {
    if (!selectedEval || selectedEval.status === 'replied') return
    setIsMarking(true)
    showLoader("Updating evaluation status...")
    const { error } = await markEvaluationAsReplied(selectedEval.id)
    setIsMarking(false)
    hideLoader()
    if (error) {
      toast.error("Failed to update status: " + error)
    } else {
      toast.success("Evaluation marked as replied")
    }
  }

  // Pre-generate Mailto parameters
  const generateMailtoLink = () => {
    if (!selectedEval) return "#"
    const subject = encodeURIComponent(`Regarding your Free Evaluation with JAP Inc. - ${selectedEval.matter}`)
    const body = encodeURIComponent(`Hi ${selectedEval.name},\n\nThank you for reaching out to Justice Advocates & Partners regarding "${selectedEval.matter}". \n\nWe would like to schedule your evaluation on your preferred date: ${selectedEval.date || 'TBD'}.\n\nBest Regards,\nJAP Inc.`)
    return `mailto:${selectedEval.email}?subject=${subject}&body=${body}`
  }

  const generateGmailLink = () => {
    if (!selectedEval) return "#"
    const to = encodeURIComponent(selectedEval.email)
    const subject = encodeURIComponent(`Regarding your Free Evaluation with JAP Inc. - ${selectedEval.matter}`)
    const body = encodeURIComponent(`Hi ${selectedEval.name},\n\nThank you for reaching out to Justice Advocates & Partners regarding "${selectedEval.matter}". \n\nWe would like to schedule your evaluation on your preferred date: ${selectedEval.date || 'TBD'}.\n\nBest Regards,\nJAP Inc.`)
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`
  }

  return (
    <div className="h-full flex flex-col pt-2 pb-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Free Evaluations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and respond to client consultation requests securely.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search evaluations..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-sm transition-all shadow-sm"
            />
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2 font-medium">
             <CalendarDays className="w-4 h-4" /> {filteredEvals.length} requests
          </div>
        </div>

        {/* List Content */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                <th className="px-6 py-4 w-1/4">Client</th>
                <th className="px-6 py-4 w-1/4">Legal Matter</th>
                <th className="px-6 py-4">Pref. Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filteredEvals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                      <p>No evaluation requests found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvals.map((e) => (
                  <tr key={e.id} className="hover:bg-blue-50/50 dark:hover:bg-gray-800/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedEval(e)}>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{e.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{e.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => setSelectedEval(e)}>
                       <span className="truncate max-w-[200px] block" title={e.matter}>{e.matter}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => setSelectedEval(e)}>
                      {e.date || "Not Specified"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedEval(e)}>
                      {e.status === 'replied' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                          <CheckCircle className="w-3.5 h-3.5" /> Replied
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                       <div className="flex gap-2 justify-end">
                         <button
                           onClick={() => setSelectedEval(e)}
                           className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition"
                           title="View details"
                         >
                           <ExternalLink className="w-4 h-4" />
                         </button>
                         <button
                           onClick={() => setEvalToDelete(e.id)}
                           className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded transition"
                           title="Delete request"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      {selectedEval && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedEval(null)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-lg">
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20 sticky top-0 z-10">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Evaluation Details
                  </h2>
                  <button 
                    onClick={() => setSelectedEval(null)}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 flex-1">
                    <div className="bg-gray-50/80 dark:bg-gray-900/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700 space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{selectedEval.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Mail className="w-3.5 h-3.5" /> <a href={`mailto:${selectedEval.email}`} className="hover:text-blue-600 hover:underline">{selectedEval.email}</a>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 font-medium whitespace-nowrap pt-1">
                                {formatDistanceToNow(new Date(selectedEval.created_at), { addSuffix: true })}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{selectedEval.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pref. Date</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{selectedEval.date || "None given"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2 mb-4 flex items-center gap-2">
                           <span className="w-1 h-4 bg-blue-600 rounded-full"></span> Legal Matter
                        </h4>
                        <p className="text-gray-800 dark:text-gray-200 font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/10 rounded border border-blue-100 dark:border-blue-800/30">
                            {selectedEval.matter}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2 mb-4 flex items-center gap-2">
                           <span className="w-1 h-4 bg-purple-600 rounded-full"></span> Message context
                        </h4>
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-inner">
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                                {selectedEval.message || <span className="italic text-gray-400">No additional message provided.</span>}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 mb-8 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50/80 dark:bg-gray-900/30 px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                Reply to Request
                            </h4>
                        </div>
                        <div className="p-5 flex flex-col gap-3">
                            <div className="flex gap-3">
                                <a 
                                    href={generateGmailLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm font-medium transition text-sm text-center"
                                >
                                    <Mail className="w-4 h-4" /> Reply via Gmail Web
                                </a>
                                <a 
                                    href={generateMailtoLink()}
                                    className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm font-medium transition text-sm text-center"
                                >
                                    <ExternalLink className="w-4 h-4" /> Native Mail App
                                </a>
                            </div>

                            <p className="text-xs text-center text-gray-500 mt-2">
                                If you reached out via email, mark this request as replied to securely log it.
                            </p>
                            <button
                                onClick={handleMarkReplied}
                                disabled={isMarking || selectedEval.status === 'replied'}
                                className={`mt-2 flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg font-bold transition text-sm border shadow-sm ${
                                    selectedEval.status === 'replied' 
                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800/30 cursor-not-allowed opacity-80' 
                                    : 'bg-white text-green-600 border-gray-200 hover:bg-green-50 hover:border-green-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-green-900/20'
                                }`}
                            >
                                {isMarking ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" /> 
                                ) : selectedEval.status === 'replied' ? (
                                    <CheckCircle className="w-4 h-4" /> 
                                ) : (
                                    <CheckCircle className="w-4 h-4" /> 
                                )}
                                {selectedEval.status === 'replied' ? 'Already Replied' : 'Mark as Replied'}
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {evalToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full flex-shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Request</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Are you sure you want to permanently delete this free evaluation request? It will be removed entirely from the database.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button 
                onClick={() => setEvalToDelete(null)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
