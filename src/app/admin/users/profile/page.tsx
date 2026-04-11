import { createClient } from "@/lib/supabase/server";
import { User, Mail, Calendar, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function UserProfilePage() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    const userName = user.user_metadata?.name || user.user_metadata?.full_name || "Admin User";
    const userRole = user.role === "authenticated" ? "Administrator" : "User";
    const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex-1 p-6 md:p-10 w-full max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">User Profile</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage your account details and preferences.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden" style={{boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)"}}>
                <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700 relative">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/40 dark:bg-white/5 blur-3xl"></div>
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl"></div>
                    </div>
                </div>

                <div className="px-8 pb-8 relative">
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="w-32 h-32 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center p-1.5 shadow-md border border-gray-100 dark:border-gray-700 z-10 box-content">
                            <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <User className="w-12 h-12 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div className="mb-2 hidden sm:block">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active Session
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
                                {userName}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 font-medium flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-gray-400" />
                                {userRole} Account
                            </p>
                        </div>

                        <div className="w-full h-px bg-gray-100 dark:bg-gray-700/50"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                    Joined On
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                                        {joinedDate}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mt-6 border border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                This is an administrative profile. Your credentials give you access to standard CMS duties such as content manipulation, quote resolutions, and handling live chat responses. 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
