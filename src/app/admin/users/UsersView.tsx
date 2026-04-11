"use client"

import { useState, useMemo } from "react"
import { toggleUserStatus, adminCreateUser, deleteAdminUser } from "./actions"
import { ChevronDown, Search, ShieldCheck, Mail, UserPlus, Shield, Activity, XCircle, ChevronLeft, ChevronRight, CheckCircle, Ban, Trash2 } from "lucide-react"
import { useLoader } from "@/components/providers/LoadingProvider"
import toast from "react-hot-toast"

type Profile = {
  id: string
  full_name: string
  email: string
  role: string
  status: string
  created_at?: string
}

export default function UsersView({ initialUsers, currentUserRole }: { initialUsers: Profile[], currentUserRole: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showLoader, hideLoader } = useLoader()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter users
  const filteredUsers = useMemo(() => {
    return initialUsers.filter((u) => {
      const term = searchTerm.toLowerCase()
      return (
        (u.full_name && u.full_name.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.role && u.role.toLowerCase().includes(term))
      )
    })
  }, [initialUsers, searchTerm])

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, currentPage, itemsPerPage])

  // Handlers
  const handleToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    showLoader(newStatus === "active" ? "Activating user..." : "Deactivating user...")
    const { error } = await toggleUserStatus(id, newStatus)
    hideLoader()
    if (error) {
      toast.error("Failed to change status: " + error)
    } else {
      toast.success(`User ${newStatus === "active" ? "activated" : "deactivated"} successfully`)
    }
  }

  const handleDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    showLoader("Deleting user account...")
    const { error } = await deleteAdminUser(userToDelete);
    setIsDeleting(false);
    hideLoader()
    if (error) {
      toast.error("Failed to delete user: " + error);
    } else {
      toast.success("User deleted successfully")
    }
    setUserToDelete(null);
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsSubmitting(true)
    showLoader("Inviting new administrator...")

    const formData = new FormData(form)
    const pw = formData.get("password") as string
    const cpw = formData.get("confirm_password") as string

    if (pw !== cpw) {
      toast.error("Passwords do not match!")
      setIsSubmitting(false)
      hideLoader()
      return
    }

    const { error } = await adminCreateUser(formData)

    if (error) {
      toast.error(error)
    } else {
      toast.success("Administrator invited successfully!")
      form.reset()
    }
    setIsSubmitting(false)
    hideLoader()
  }

  return (
    <div className="space-y-6 pb-2">

      {/* 1. Add User Form (Top Section) */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Invite New Administrator</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create a new account for a team member to access this dashboard.</p>
          </div>
        </div>

        <form id="add-user-form" onSubmit={handleCreate} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> Email Address
              </label>
              <input required name="email" type="email" placeholder="colleague@example.com" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-sm transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-400" /> Full Name
              </label>
              <input required name="name" type="text" placeholder="Jane Doe" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-sm transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input required minLength={6} name="password" type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-sm transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <input required minLength={6} name="confirm_password" type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-sm transition-colors" />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors disabled:opacity-50 text-sm flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? "Processing..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>

      {/* 2. User List Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

        {/* Table Controls */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Users Directory</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{filteredUsers.length} total users</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
                placeholder="Search users..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                      <p>No users found matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.full_name || "Unknown User"}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{user.email || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {user.role === 'super_admin' ? (
                          <ShieldCheck className="w-4 h-4 text-purple-500" />
                        ) : (
                          <Shield className="w-4 h-4 text-blue-500" />
                        )}
                        {user.role.replace("_", " ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                          <Activity className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">
                          <XCircle className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Unknown"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {user.role === 'super_admin' ? (
                        <span className="text-gray-400 text-xs italic bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Protected</span>
                      ) : (
                        <div className="relative group inline-block text-left">
                          <button
                            className="inline-flex justify-center items-center gap-1.5 w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-1.5 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                          >
                            Action
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                  
                          <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              {user.status === 'inactive' && (
                                  <button
                                    onClick={() => handleToggle(user.id, user.status)}
                                    className="w-full text-left px-4 py-2 text-sm text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" /> Activate
                                  </button>
                              )}
                              <button
                                 onClick={() => setUserToDelete(user.id)}
                                 className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                              >
                                 <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Functional Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 font-medium"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">
              Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{Math.max(1, totalPages)}</span>
            </span>
            <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border-r border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full flex-shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete User</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Are you sure you want to permanently delete this user? Their access will immediately be revoked and data removed from the directory.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button 
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

