import { createAdminClient } from "@/lib/supabase/admin";

export async function getSandoResponse(userQuery: string, isOffHours: boolean = true): Promise<{ content: string; isHighConfidence: boolean }> {
    const query = userQuery.toLowerCase().trim();
    const adminSupabase = createAdminClient();

    // 1. Check for very specific intents (Booking/Quote)
    if (
        query.includes("book") || 
        query.includes("appointment") || 
        query.includes("schedule") || 
        query.includes("consultation") ||
        query.includes("evaluation")
    ) {
        return {
            content: "To book an appointment or request a free evaluation, please click the 'Free Evaluation' button at the top of our homepage. You can select a date and time that works best for you!",
            isHighConfidence: true
        };
    }

    if (
        query.includes("quote") || 
        query.includes("price") || 
        query.includes("cost") || 
        query.includes("how much")
    ) {
        return {
            content: "You can request a preliminary quote by clicking the 'Get a Quote' button in our services section. Alternatively, you can describe your legal needs here, and one of our human agents will provide a detailed estimate when we return!",
            isHighConfidence: true
        };
    }

    // 2. Fetch Knowledge Base from CMS
    const { data: cmsData } = await adminSupabase
        .from("site_content")
        .select("section_key, content_data")
        .in("section_key", ["about", "faq", "services", "team"]);

    if (!cmsData) return { content: getDefaultAwayMessage(null, isOffHours), isHighConfidence: false };

    const faqData = cmsData.find((s: any) => s.section_key === "faq")?.content_data || {};
    const aboutData = cmsData.find((s: any) => s.section_key === "about")?.content_data || {};
    // const servicesData = cmsData.find(s => s.section_key === "services")?.content_data || {};

    // 3. Try to match FAQ
    let bestMatch: { q: string, a: string, score: number } | null = null;
    
    // Process FAQ (keys are usually "0", "1", etc. or UUIDs)
    Object.values(faqData).forEach((item: any) => {
        if (item.q && item.a) {
            const score = calculateMatchScore(query, item.q.toLowerCase());
            if (score > 0.4 && (!bestMatch || score > (bestMatch as any).score)) {
                bestMatch = { q: item.q, a: item.a, score };
            }
        }
    });

    if (bestMatch && (bestMatch as any).score > 0.5) {
        return { content: (bestMatch as any).a, isHighConfidence: true };
    }

    // 4. Check 'About' info
    const aboutKeywords = [
        "who are you", "about the firm", "background", "jap inc", "justice advocates", 
        "story", "history", "reputation", "office", "firm profile"
    ];
    if (aboutKeywords.some(kw => query.includes(kw))) {
        return {
            content: aboutData.description || "Justice Advocates & Partners, Inc. (JAP Inc.) is a premier Liberian law firm established in 2020, specializing in corporate and commercial legal services.",
            isHighConfidence: true
        };
    }

    if (query.includes("founder") || query.includes("who started") || query.includes("partners")) {
        return {
            content: "JAP Inc. was founded by Counsellors-At-Law: G. Moses Paegar, Golda A. Bonah Elliott, and Albert S. Sims. Each founder has over fifteen years of legal practice experience.",
            isHighConfidence: true
        };
    }

    if (query.includes("where") || query.includes("location") || query.includes("liberia")) {
        return {
            content: "We are based in the Republic of Liberia and are licensed to practice before the Honorable Supreme Court of Liberia.",
            isHighConfidence: true
        };
    }

    // 5. Default Fallback with "Knowledge Preview"
    return { 
        content: getDefaultAwayMessage(bestMatch ? (bestMatch as any).a : null, isOffHours), 
        isHighConfidence: false 
    };
}

function calculateMatchScore(query: string, target: string): number {
    const queryWords = query.split(/\W+/).filter(w => w.length > 3);
    const targetWords = target.split(/\W+/).filter(w => w.length > 3);
    
    if (queryWords.length === 0) return 0;
    
    let matches = 0;
    queryWords.forEach(qw => {
        if (targetWords.includes(qw)) matches++;
    });
    
    return matches / queryWords.length;
}

function getDefaultAwayMessage(relevantInfo: string | null = null, isOffHours: boolean = true): string {
    const hoursInfo = isOffHours ? " (Business Hours: Mon-Fri 9-5, Sat 9-1 GMT)" : "";
    const base = `Hi there! I'm Sando, JAP's virtual assistant. Our human agents are currently ${isOffHours ? 'away' : 'busy'}${hoursInfo}.`;
    
    if (relevantInfo) {
        return `${base}\n\nI found some information that might help: "${relevantInfo}"\n\nIf you need more help, please leave your details and we'll reply soon!`;
    }
    
    return `${base} We have received your message. You can book an appointment or get a quote directly on our site. An agent will follow up with you as soon as we're back in the office!`;
}
