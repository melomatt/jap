import { getSiteContent } from "@/app/admin/cms/actions";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
    const { data } = await getSiteContent("settings");

    const cmsData = {
        title: data?.loginTitle || "Admin Portal",
        subtitle: data?.loginSubtitle || "Sign in to access the dashboard",
    };

    return <LoginClient cmsData={cmsData} />;
}
