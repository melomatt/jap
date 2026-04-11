"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { updateSiteContent, uploadCmsImage } from "@/app/admin/cms/actions";
import { Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoader } from "@/components/providers/LoadingProvider";
import toast from "react-hot-toast";

const heroSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    buttonText: z.string().min(1, "Button text is required"),
    backgroundImage: z.string().optional(),
    backgroundImages: z.array(z.string()).min(1, "At least one background image is required"),
});

type HeroFormData = z.infer<typeof heroSchema>;

export default function HeroForm({ initialData }: { initialData: any }) {
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();

    const form = useForm<HeroFormData>({
        resolver: zodResolver(heroSchema),
        defaultValues: {
            title: initialData?.title || "",
            subtitle: initialData?.subtitle || "",
            buttonText: initialData?.buttonText || "Get a Quote",
            backgroundImage: initialData?.backgroundImage || initialData?.imageUrl || "/hero_image.png",
            backgroundImages: initialData?.backgroundImages || [initialData?.backgroundImage || initialData?.imageUrl || "/hero_image.png"],
        },
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        showLoader("Uploading image to secure storage...");

        try {
            const file = e.target.files[0];
        
            // Client-side size validation: 10MB limit
            const MAX_SIZE = 10 * 1024 * 1024; // 10MB
            if (file.size > MAX_SIZE) {
                toast.error(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed is 10MB.`);
                setIsUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append("file", file);

            const result = await uploadCmsImage(formData);

            if (result.error) {
                toast.error("Image upload failed: " + result.error);
            } else if (result.publicUrl) {
                const currentImages = form.getValues("backgroundImages") || [];
                form.setValue("backgroundImages", [...currentImages, result.publicUrl]);
                // Also update the single image legacy field as a fallback
                form.setValue("backgroundImage", result.publicUrl);
                toast.success("Image added to slideshow!");
            }
        } catch (err: any) {
            console.error("HeroForm image upload error:", err);
            toast.error("Network error during upload. Please try again.");
        } finally {
            setIsUploading(false);
            hideLoader();
        }
    };

    const onSubmit = async (values: HeroFormData) => {
        setIsSaving(true);
        showLoader("Publishing Hero changes to live site...");

        try {
            const result = await updateSiteContent("hero", values);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Hero section saved successfully!");
                router.refresh();
            }
        } catch (err: any) {
            console.error("HeroForm submit error:", err);
            toast.error("The server took too long to respond. Please check your internet and try again.");
        } finally {
            setIsSaving(false);
            hideLoader();
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Main Title
                    </label>
                    <input
                        {...form.register("title")}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="EXPERT ADVISORY"
                    />
                    {form.formState.errors.title && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subtitle / Catchphrase
                    </label>
                    <textarea
                        {...form.register("subtitle")}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="WE ARE BRINGING SOLUTIONS BY PROVIDING SUPPORT FOR LEGAL SYSTEM."
                    />
                    {form.formState.errors.subtitle && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.subtitle.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Primary Button Text
                    </label>
                    <input
                        {...form.register("buttonText")}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Get a Quote"
                    />
                    {form.formState.errors.buttonText && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.buttonText.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Hero Sideshow Images
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                        {(form.watch("backgroundImages") || []).map((img, idx) => (
                            <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const current = form.getValues("backgroundImages");
                                            const updated = current.filter((_, i) => i !== idx);
                                            form.setValue("backgroundImages", updated);
                                            if (updated.length > 0) form.setValue("backgroundImage", updated[0]);
                                        }}
                                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 text-white text-[10px] rounded backdrop-blur-sm">
                                    Slide {idx + 1}
                                </div>
                            </div>
                        ))}
                        
                        <div className="aspect-video relative rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800/50">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={isUploading}
                            />
                            {isUploading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                            ) : (
                                <Upload className="h-6 w-6 text-gray-400" />
                            )}
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {isUploading ? "Uploading..." : "Add Image"}
                            </span>
                        </div>
                    </div>
                    {form.formState.errors.backgroundImages && (
                        <p className="text-red-500 text-sm">{form.formState.errors.backgroundImages.message}</p>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving Changes..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
