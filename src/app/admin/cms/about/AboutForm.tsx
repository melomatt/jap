"use client"

import { useState } from "react"
import { updateSiteContent } from "../actions"
import { Save } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function AboutForm({ initialData }: { initialData: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    history: initialData?.history || initialData?.title || "",
    description: initialData?.description || "",
    mission: initialData?.mission || "",
    missionDesc: initialData?.missionDesc || "",
    vision: initialData?.vision || "",
    visionDesc: initialData?.visionDesc || "",
    values: initialData?.values || "",
    valuesDesc: initialData?.valuesDesc || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { error } = await updateSiteContent("about", formData)

    if (error) {
      toast.error(`Database error: ${error}`)
    } else {
      toast.success("About section updated live!")
      router.refresh()
    }

    setIsSubmitting(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-700">
      <form onSubmit={handleSave} className="p-6 space-y-8">

        {/* Top Header Information */}
        <div className="space-y-5">
          <h3 className="font-semibold text-lg text-[#3b5998] dark:text-[#8fa8db] pb-2 border-b border-gray-100 dark:border-gray-700">General Information</h3>
          
          <div>
            <label className="block text-[11px] tracking-widest uppercase font-semibold text-gray-500 mb-2">Establishment Title</label>
            <input 
              name="history"
              value={formData.history} 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0f5132] focus:border-[#0f5132] dark:bg-gray-700 transition-colors font-semibold" 
              placeholder="e.g. ESTABLISHED DECEMBER 16, 2020" 
            />
          </div>

          <div>
            <label className="block text-[11px] tracking-widest uppercase font-semibold text-gray-500 mb-2">Main Description</label>
            <textarea 
              name="description"
              value={formData.description}
              rows={4} 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0f5132] focus:border-[#0f5132] dark:bg-gray-700 transition-colors resize-none text-sm leading-relaxed" 
            />
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="space-y-5 pt-4">
          <h3 className="font-semibold text-lg text-[#3b5998] dark:text-[#8fa8db] pb-2 border-b border-gray-100 dark:border-gray-700">The 3 Pillars</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Mission */}
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-100 dark:border-gray-600">
              <div className="text-3xl text-center">⚖️</div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-1">Heading</label>
                <input name="mission" value={formData.mission} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-sm text-sm dark:bg-gray-800 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-1">Text</label>
                <textarea name="missionDesc" value={formData.missionDesc} onChange={handleChange} rows={3} className="w-full px-2 py-1.5 border rounded-sm text-sm dark:bg-gray-800 dark:border-gray-600 resize-none" />
              </div>
            </div>

            {/* Vision */}
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-100 dark:border-gray-600">
              <div className="text-3xl text-center">🎯</div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-1">Heading</label>
                <input name="vision" value={formData.vision} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-sm text-sm dark:bg-gray-800 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-1">Text</label>
                <textarea name="visionDesc" value={formData.visionDesc} onChange={handleChange} rows={3} className="w-full px-2 py-1.5 border rounded-sm text-sm dark:bg-gray-800 dark:border-gray-600 resize-none" />
              </div>
            </div>

            {/* Values */}
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-100 dark:border-gray-600">
              <div className="text-3xl text-center">🤝</div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-1">Heading</label>
                <input name="values" value={formData.values} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-sm text-sm dark:bg-gray-800 dark:border-gray-600" />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-1">Text</label>
                <textarea name="valuesDesc" value={formData.valuesDesc} onChange={handleChange} rows={3} className="w-full px-2 py-1.5 border rounded-sm text-sm dark:bg-gray-800 dark:border-gray-600 resize-none" />
              </div>
            </div>

          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#0f5132] hover:bg-[#0c4027] text-white font-medium py-2.5 px-8 rounded-sm shadow-sm transition-colors disabled:opacity-50 text-sm"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving & Publishing..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  )
}
