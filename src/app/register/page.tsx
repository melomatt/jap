import { getSiteContent } from "@/app/admin/cms/actions";
import RegisterClient from "./RegisterClient";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
    const { data } = await getSiteContent("settings");

    const cmsData = {
        title: data?.registerTitle || "Admin Registration",
        subtitle: data?.registerSubtitle || "Create an administrator or lawyer account",
    };

    return <RegisterClient cmsData={cmsData} />;
}
