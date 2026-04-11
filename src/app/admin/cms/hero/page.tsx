import { getSiteContent } from "../actions"
import HeroForm from "./HeroForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AdminErrorState from "@/components/AdminErrorState"

export const metadata = { title: "CMS | Hero Section" }

export default async function AdminHeroPage() {
  const { data, error } = await getSiteContent("hero")

  if (error) {
    return <AdminErrorState title="Hero Dashboard Error" message="Unable to load the hero section data." error={error} />
  }

  // Fallback defaults if the database is empty somehow
  const defaultData = data || { title: "", subtitle: "", imageUrl: "" }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/admin/cms" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hero Section</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update the large image and welcome text displayed at the very top of your homepage.
          </p>
        </div>
      </div>

      <HeroForm initialData={defaultData} />
    </div>
  )
}
