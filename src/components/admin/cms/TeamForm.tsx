"use client";

import { useState } from "react";
import { updateSiteContent, uploadCmsImage } from "@/app/admin/cms/actions";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TeamForm({ initialData }: { initialData: any }) {
    const [items, setItems] = useState<any[]>(
        Array.isArray(initialData) 
            ? initialData.map((m: any) => ({
                name: m.name || "",
                title: m.title || m.role || "",
                image: m.image || m.imageUrl || "/default_avatar.png",
                bio: m.bio || "",
                credentials: m.credentials || "",
                education: m.education || []
            })) 
            : []
    );

    const [isSaving, setIsSaving] = useState(false);
    const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
    const router = useRouter();

    const handleAddItem = () => {
        setItems([...items, { name: "", title: "", bio: "", image: "/default_avatar.png", credentials: "", education: [] }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingIdx(index);

        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        const result = await uploadCmsImage(formData);

        if (result.error) {
            toast.error("Image upload failed: " + result.error);
        } else if (result.publicUrl) {
            handleChange(index, "image", result.publicUrl);
        }
        setUploadingIdx(null);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const result = await updateSiteContent("team", items);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Team profiles updated successfully!");
            router.refresh();
        }
        setIsSaving(false);
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
                {items.length === 0 && <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">No team members added yet.</div>}

                {items.map((item, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-6">
                        <button type="button" onClick={() => handleRemoveItem(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 bg-white dark:bg-gray-800 rounded-md shadow-sm z-10"><Trash2 className="h-4 w-4" /></button>

                        {/* Photo Column */}
                        <div className="w-full md:w-1/3 space-y-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase">Profile Photo</label>
                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden relative">
                                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="relative mt-2">
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(idx, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploadingIdx === idx} />
                                <button type="button" className="w-full flex justify-center items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                                    {uploadingIdx === idx ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
                                </button>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="w-full md:w-2/3 space-y-3 pr-8">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
                                <input required value={item.name || ""} onChange={(e) => handleChange(idx, "name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm" placeholder="John Doe" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title / Role</label>
                                    <input required value={item.title || ""} onChange={(e) => handleChange(idx, "title", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm" placeholder="Managing Partner" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Credentials</label>
                                    <input value={item.credentials || ""} onChange={(e) => handleChange(idx, "credentials", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm" placeholder="Esq., LL.M." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Biography</label>
                                <textarea required rows={3} value={item.bio || ""} onChange={(e) => handleChange(idx, "bio", e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm" placeholder="Short bio..." />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Education (One per line)</label>
                                <textarea rows={3} value={Array.isArray(item.education) ? item.education.join('\n') : (item.education || "")} onChange={(e) => handleChange(idx, "education", e.target.value.split('\n'))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm font-mono" placeholder="Degree - University (Year)" />
                            </div>
                        </div>
                    </div>
                ))}

                <button type="button" onClick={handleAddItem} className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Plus className="h-5 w-5" /> Add Team Member
                </button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save Team Profiles"}
                </button>
            </div>
        </form>
    );
}
