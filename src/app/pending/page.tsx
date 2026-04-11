import { getSiteContent } from "@/app/admin/cms/actions";
import PendingClient from "./PendingClient";

export const dynamic = "force-dynamic";

export default async function PendingPage() {
    const { data } = await getSiteContent("settings");

    const cmsData = {
        title: data?.pendingTitle || "Account Pending Approval",
        message: data?.pendingMessage || "Your account has been created successfully, but it is currently inactive.",
        description: data?.pendingDescription || "A firm administrator must approve and activate your account before you can access the dashboard.",
    };

    return <PendingClient cmsData={cmsData} />;
}
