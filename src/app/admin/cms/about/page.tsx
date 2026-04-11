import { getSiteContent } from "../actions"
import AboutForm from "./AboutForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AdminErrorState from "@/components/AdminErrorState"

export const metadata = { title: "CMS | About Us" }

export default async function AdminAboutPage() {
  const { data, error } = await getSiteContent("about")

  if (error) {
    return <AdminErrorState title="About Dashboard Error" message="Unable to load the about section data." error={error} />
  }

  // Fallback defaults
  const defaultData = data || { 
    title: "", description: "", 
    mission: "", missionDesc: "", 
    vision: "", visionDesc: "", 
    values: "", valuesDesc: "" 
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/admin/cms" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Us</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Modify the law firm's establishment date, core mission, vision, and values.
          </p>
        </div>
      </div>

      <AboutForm initialData={defaultData} />
    </div>
  )
}
