"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

// --- CMS Content Schemas ---

const HeroSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  backgroundImage: z.string().optional().or(z.literal("")),
  backgroundImages: z.array(z.string()).optional(),
  imageUrl: z.string().optional().or(z.literal("")), // Legacy support
})

const AboutSchema = z.object({
  history: z.string().optional(),
  description: z.string().optional(),
  mission: z.string().optional(),
  missionDesc: z.string().optional(),
  vision: z.string().optional(),
  visionDesc: z.string().optional(),
  values: z.string().optional(),
  valuesDesc: z.string().optional(),
})

const NavbarLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  isExternal: z.boolean().optional(),
})

const NavbarSchema = z.object({
  links: z.array(NavbarLinkSchema).optional(),
  phoneNumber: z.string().optional(),
  ctaText: z.string().optional(),
  logoAlt: z.string().optional(),
})

const GenericSectionSchema = z.any() // Fallback for complex/array sections

const ModalsSchema = z.object({
  bookingTitle: z.string().optional(),
  bookingSubtitle: z.string().optional(),
  quoteTitle: z.string().optional(),
  quoteSubtitle: z.string().optional(),
})

const RatesSchema = z.object({
  sectionTitle: z.string().optional(),
  subtitle: z.string().optional(),
  currency: z.string().optional(),
  rows: z.array(z.object({
    no: z.string(),
    description: z.string(),
    feePerHour: z.string()
  })).optional()
})

const SectionSchemas: Record<string, z.ZodTypeAny> = {
  hero: HeroSchema,
  about: AboutSchema,
  services: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
  team: z.array(z.any()).optional(),
  navbar: NavbarSchema,
  modals: ModalsSchema,
  rates: RatesSchema,
}

// --- End Schemas ---

/**
 * Fetch a specific chunk of CMS content. This is safe to run on the public 
 * frontend but for admin uses we strictly fetch using the active session.
 */
export async function getSiteContent(sectionKey: string) {
  // Use admin client to ensure visibility regardless of RLS
  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from("site_content")
    .select("content_data")
    .eq("section_key", sectionKey)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return { data: null } // Not found
    console.error(`Error fetching site_content for ${sectionKey}:`, error)
    return { data: null, error: error.message }
  }

  return { data: data?.content_data || null }
}

/**
 * Optimized: Fetch multiple CMS sections in a single DB roundtrip.
 */
export async function getBatchSiteContent(sectionKeys: string[]) {
  if (!sectionKeys.length) return { data: {} }

  // Use admin client to ensure visibility regardless of RLS
  const adminSupabase = createAdminClient()
  const { data, error } = await adminSupabase
    .from("site_content")
    .select("section_key, content_data")
    .in("section_key", sectionKeys)

  if (error) {
    console.error(`Error fetching batch content:`, {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: (error as any).hint,
      errorObject: error, // Log the full object too
    })
    return { data: {}, error: error.message }
  }

  if (!data) return { data: {} }

  const mappedData = data.reduce((acc: Record<string, any>, row: any) => {
    acc[row.section_key] = row.content_data
    return acc
  }, {})

  return { data: mappedData }
}

/**
 * Admin ONLY: Update a chunk of CMS JSON content unconditionally.
 */
export async function updateSiteContent(sectionKey: string, jsonData: any) {
  console.log(`[CMS] updateSiteContent started for section: ${sectionKey}`);
  
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    // 1. Verify the caller is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.warn(`[CMS] updateSiteContent: Unauthorized attempt for ${sectionKey}`);
      return { error: "Unauthorized. Please log in." }
    }

    // 2. RBAC Verification
    const { data: profile, error: profileError } = await adminSupabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      console.error(`[CMS] Profile lookup error for user ${user.id}:`, profileError);
      return { error: "Profile not found. Please contact your system administrator." }
    }

    if (profile.status?.toLowerCase() !== "active") {
      return { error: `Your account is not active (current status: "${profile.status}").` }
    }

    if (profile.role !== "admin" && profile.role !== "super_admin") {
      return { error: "You do not have permission to edit CMS content." }
    }

    // 3. Input Validation (Zod)
    const schema = SectionSchemas[sectionKey] || GenericSectionSchema
    const result = schema.safeParse(jsonData)
    if (!result.success) {
      console.warn(`[CMS] Validation failure for ${sectionKey}:`, result.error.message);
      return { error: `Invalid ${sectionKey} data format: ${result.error.message}` }
    }

    // 4. Prepare content with metadata
    // Special Logic: Sync backgroundImage and imageUrl for the hero section
    let finalJsonData = { ...jsonData };
    if (sectionKey === "hero") {
      if (finalJsonData.backgroundImage && !finalJsonData.imageUrl) {
        finalJsonData.imageUrl = finalJsonData.backgroundImage;
      } else if (finalJsonData.imageUrl && !finalJsonData.backgroundImage) {
        finalJsonData.backgroundImage = finalJsonData.imageUrl;
      }
    }

    const contentWithMetadata = Array.isArray(finalJsonData)
      ? finalJsonData
      : {
          ...finalJsonData,
          _metadata: {
            last_updated_by: user.id,
            updated_at: new Date().toISOString(),
          }
        }

    console.log(`[CMS] updateSiteContent: Upserting to database...`);
    
    // 5. Database Upsert
    const { error: upsertError } = await adminSupabase
      .from("site_content")
      .upsert({
        section_key: sectionKey,
        content_data: contentWithMetadata,
        updated_at: new Date().toISOString()
      }, { onConflict: 'section_key' })

    if (upsertError) {
      console.error(`[CMS] Database upsert failed for ${sectionKey}:`, upsertError);
      return { error: upsertError.message }
    }

    console.log(`[CMS] updateSiteContent: Database update successful. Clearing cache...`);

    // 6. Cache Revalidation - revalidate the homepage and layout to clear all caches
    revalidatePath("/", "layout");
    revalidatePath("/");
    
    console.log(`[CMS] updateSiteContent: Completed successfully for ${sectionKey}`);
    return { success: true }
  } catch (err: any) {
    console.error(`[CMS] CRITICAL ERROR in updateSiteContent for ${sectionKey}:`, err);
    return { error: `Server error: ${err.message || "Unknown internal error"}` }
  }
}

/**
 * Admin ONLY: Upload a file to the cms_images bucket and return the public URL.
 */
export async function uploadCmsImage(formData: FormData) {
  console.log(`[CMS] uploadCmsImage started`);
  
  try {
    const file = formData.get("file") as File
    if (!file) {
      console.warn(`[CMS] uploadCmsImage: No file provided `);
      return { error: "No file provided" }
    }

    const supabase = await createClient()

    // 1. Verify the caller is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.warn(`[CMS] uploadCmsImage: Unauthorized attempt`);
      return { error: "Unauthorized" }
    }

    // 2. Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single()

    if (!profile || profile.status?.toLowerCase() !== "active") {
      return { error: "Unauthorized: Account inactive" }
    }

    // 3. RBAC Hardening
    if (profile.role !== "admin" && profile.role !== "super_admin") {
      console.warn(`[CMS] uploadCmsImage: Non-admin attempt by ${user.id}`);
      return { error: "Permission Denied: Admin privileges required." }
    }

    console.log(`[CMS] uploadCmsImage: Preparing file ${file.name} (${file.type})...`);

    // 4. Safe file naming
    const fileExt = file.name.split('.').pop()
    const safeFilename = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `uploads/${safeFilename}`

    const adminSupabase = createAdminClient()

    // 5. Convert standard File object to ArrayBuffer
    const buffer = await file.arrayBuffer()

    console.log(`[CMS] uploadCmsImage: Uploading to Supabase bucket 'cms_images'...`);

    // 6. Perform upload
    const { data: uploadData, error: uploadError } = await adminSupabase
      .storage
      .from("cms_images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error(`[CMS] Storage upload error:`, uploadError);
      return { error: `Storage error: ${uploadError.message}` }
    }

    console.log(`[CMS] uploadCmsImage: Upload successful. Extracting public URL...`);

    // 7. Get Public URL
    const { data: publicUrlData } = adminSupabase
      .storage
      .from("cms_images")
      .getPublicUrl(filePath)

    if (!publicUrlData || !publicUrlData.publicUrl) {
       console.error(`[CMS] Failed to retrieve public URL for ${filePath}`);
       return { error: "Failed to retrieve public URL" }
    }

    console.log(`[CMS] uploadCmsImage: Completed successfully. URL: ${publicUrlData.publicUrl}`);
    return { publicUrl: publicUrlData.publicUrl }

  } catch (err: any) {
    console.error(`[CMS] CRITICAL ERROR in uploadCmsImage:`, err);
    return { error: `Server error: ${err.message || "Unknown internal error"}` }
  }
}
