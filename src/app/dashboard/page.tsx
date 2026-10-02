import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { saveAboutContentAction, saveHomeContentAction, saveProductDetailContentAction, saveFaqContentAction, saveTermsContentAction, savePrivacyContentAction, saveReturnsContentAction, saveSafetyContentAction } from "@/app/dashboard/actions";
import { CmsDashboard } from "@/app/dashboard/CmsDashboard";
import { isActivePanel, type ActivePanel } from "@/app/dashboard/panels";
import { logoutAction } from "@/app/dashboard/login/actions";
import { getCmsContent, isLocalCmsContent } from "@/lib/cms-content";
import { DASHBOARD_SESSION_COOKIE, verifySessionToken, getDashboardUsername } from "@/lib/dashboard-auth";

export const metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

function parsePanel(panel: string | undefined): ActivePanel {
  if (isActivePanel(panel)) {
    return panel;
  }

  if (panel === "product-combs" || panel === "product-reveal-desktop" || panel === "product-reveal-mobile") {
    return "product-reveal";
  }

  if (panel === "home-desktop" || panel === "home-mobile") {
    return "home-hero";
  }

  return "home-hero";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string; saved?: string }>;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(DASHBOARD_SESSION_COOKIE)?.value;

  if (!verifySessionToken(sessionToken)) {
    redirect("/dashboard/login");
  }

  const [content, params, currentUsername] = await Promise.all([
    getCmsContent(),
    searchParams,
    getDashboardUsername(),
  ]);
  const initialPanel = parsePanel(params.panel);

  return (
    <CmsDashboard
      content={content}
      initialPanel={initialPanel}
      isSaved={params.saved === "1"}
      isLocalCmsMode={isLocalCmsContent()}
      saveAboutAction={saveAboutContentAction}
      saveHomeAction={saveHomeContentAction}
      saveProductDetailAction={saveProductDetailContentAction}
      saveFaqAction={saveFaqContentAction}
      saveTermsAction={saveTermsContentAction}
      savePrivacyAction={savePrivacyContentAction}
      saveReturnsAction={saveReturnsContentAction}
      saveSafetyAction={saveSafetyContentAction}
      logoutAction={logoutAction}
      currentUsername={currentUsername}
    />
  );
}
