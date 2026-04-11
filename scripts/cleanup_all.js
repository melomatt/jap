const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');
const path = require('path');

try {
    const rootDir = "c:\\Users\\User\\Downloads\\jap\\jap-main";
    const envPath = path.join(rootDir, ".env.local");
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let value = parts.slice(1).join('=').trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            process.env[key] = value;
        }
    });
} catch (e) {
    console.error("Error loading .env.local:", e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupAll() {
    const sections = ["hero", "services", "servicesHeader", "testimonials", "testimonialsHeader"];
    console.log("Cleaning up sections:", sections);

    for (const section of sections) {
        const { error } = await supabase
            .from("site_content")
            .delete()
            .eq("section_key", section);

        if (error) {
            console.error(`Error deleting ${section}:`, error);
        } else {
            console.log(`Successfully cleaned up ${section}.`);
        }
    }
}

cleanupAll();
