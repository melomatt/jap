"use client"

import { useState } from "react"
import { updateSiteContent, uploadCmsImage } from "../actions"
import { ImageIcon, Save, Trash2, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function HeroForm({ initialData }: { initialData: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  // State
  const [title, setTitle] = useState(initialData?.title || "")
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "")
  
  // Manage existing saved images
  const [backgroundImages, setBackgroundImages] = useState<string[]>(
    initialData?.backgroundImages || (initialData?.imageUrl ? [initialData.imageUrl] : [])
  )
  
  // Manage new images pending upload
  const [newImageFiles, setNewImageFiles] = useState<{ id: string; file: File; previewUrl: string }[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      
      const MAX_SIZE = 4 * 1024 * 1024;
      const validFiles = filesArray.filter(file => {
        if (file.size > MAX_SIZE) {
          toast.error(`File ${file.name} too large. Max 4MB.`)
          return false
        }
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not a valid image.`)
          return false
        }
        return true
      })

      const newEntries = validFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: URL.createObjectURL(file)
      }))

      setNewImageFiles(prev => [...prev, ...newEntries])
    }
  }

  const removeSavedImage = (index: number) => {
    setBackgroundImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (id: string) => {
    setNewImageFiles(prev => {
      const filtered = prev.filter(item => item.id !== id)
      // Clean up object URLs
      const removed = prev.find(item => item.id === id)
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return filtered
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    let finalImageUrls = [...backgroundImages]

    // Process new image uploads
    if (newImageFiles.length > 0) {
      for (const item of newImageFiles) {
        const formData = new FormData()
        formData.append("file", item.file)
        
        try {
          const { publicUrl, error: uploadError } = await uploadCmsImage(formData)
          if (uploadError) {
            toast.error(`Upload failed for ${item.file.name}: ${uploadError}`)
          } else {
            finalImageUrls.push(publicUrl)
          }
        } catch (err: any) {
          console.error("Hero upload catch:", err)
          toast.error(`Network error for ${item.file.name}. Skip and try again later.`)
        }
      }
    }

    // Save completely to JSON using backgroundImages array
    // Provide imageUrl as the first for legacy fallback robustness
    const newJson = { 
      title, 
      subtitle, 
      imageUrl: finalImageUrls.length > 0 ? finalImageUrls[0] : "",
      backgroundImage: finalImageUrls.length > 0 ? finalImageUrls[0] : "",
      backgroundImages: finalImageUrls
    }
    
    const { error: saveError } = await updateSiteContent("hero", newJson)

    if (saveError) {
      toast.error(`Database error: ${saveError}`)
    } else {
      toast.success("Hero section updated live!")
      setBackgroundImages(finalImageUrls)
      
      // Cleanup object urls
      newImageFiles.forEach(item => URL.revokeObjectURL(item.previewUrl))
      setNewImageFiles([])
      
      router.refresh()
    }

    setIsSubmitting(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-700">
      <form onSubmit={handleSave} className="p-6 space-y-8">

        <div className="space-y-5">
          <div>
            <label className="block text-[11px] tracking-widest uppercase font-semibold text-gray-500 mb-2">Main Title</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0f5132] focus:border-[#0f5132] dark:bg-gray-700 transition-colors font-semibold" 
              placeholder="e.g. EXPERT ADVISORY" 
            />
          </div>

          <div>
            <label className="block text-[11px] tracking-widest uppercase font-semibold text-gray-500 mb-2">Subtitle / Tagline</label>
            <textarea 
              value={subtitle}
              rows={3} 
              onChange={e => setSubtitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0f5132] focus:border-[#0f5132] dark:bg-gray-700 transition-colors resize-none text-sm" 
              placeholder="e.g. WE ARE BRINGING SOLUTIONS BY PROVIDING SUPPORT..." 
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] tracking-widest uppercase font-semibold text-gray-500 mb-3">Slideshow Images (Advisors)</label>
          <p className="text-xs text-gray-500 mb-4">Upload all the advisor images you want to cycle through in the aesthetic Apple-style slideshow background.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Display Saved Images */}
            {backgroundImages.map((url, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-100 dark:bg-gray-700 rounded relative group overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={url} alt={`Saved slide ${i}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => removeSavedImage(i)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Display Pending Images */}
            {newImageFiles.map((item) => (
              <div key={item.id} className="aspect-[4/5] bg-gray-100 dark:bg-gray-700 rounded relative group overflow-hidden border-2 border-yellow-400 dark:border-yellow-600">
                <img src={item.previewUrl} alt="Pending slide" className="w-full h-full object-cover opacity-80" />
                <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">New</div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => removeNewImage(item.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Upload Button */}
            <label className="aspect-[4/5] bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer transition-colors group">
              <div className="text-center text-gray-500 dark:text-gray-400 group-hover:text-blue-500">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <span className="text-sm font-medium">Add Image</span>
              </div>
              <input 
                type="file" 
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                className="hidden" 
              />
            </label>

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

