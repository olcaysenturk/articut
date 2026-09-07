import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { saveAboutContentAction, saveHomeContentAction, saveProductDetailContentAction, saveFaqContentAction, saveTermsContentAction, savePrivacyContentAction } from "@/app/dashboard/actions";
import { CmsDashboard, type ActivePanel } from "@/app/dashboard/CmsDashboard";
import { logoutAction } from "@/app/dashboard/login/actions";
import { getCmsContent } from "@/lib/cms-content";
import { DASHBOARD_SESSION_COOKIE, verifySessionToken, getDashboardUsername } from "@/lib/dashboard-auth";

export const metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

function parsePanel(panel: string | undefined): ActivePanel {
  if (
    panel === "about-hero" ||
    panel === "about-story" ||
    panel === "about-contact" ||
    panel === "home-desktop" ||
    panel === "home-mobile" ||
    panel === "home-pack-showcase" ||
    panel === "home-showcase" ||
    panel === "product-package" ||
    panel === "product-media-strip" ||
    panel === "product-detail" ||
    panel === "faq" ||
    panel === "terms" ||
    panel === "privacy" ||
    panel === "profile"
  ) {
    return panel;
  }

  return "home-desktop";
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
      saveAboutAction={saveAboutContentAction}
      saveHomeAction={saveHomeContentAction}
      saveProductDetailAction={saveProductDetailContentAction}
      saveFaqAction={saveFaqContentAction}
      saveTermsAction={saveTermsContentAction}
      savePrivacyAction={savePrivacyContentAction}
      logoutAction={logoutAction}
      currentUsername={currentUsername}
    />
  );
}
