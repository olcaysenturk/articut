import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const gamayEditorial = localFont({
  src: [
    { path: "./fonts/Gamay_Editorial_Light.woff", weight: "300", style: "normal" },
    { path: "./fonts/Gamay_Editorial_Regular.woff", weight: "400", style: "normal" },
    { path: "./fonts/Gamay_Editorial_Medium.woff", weight: "500", style: "normal" },
    { path: "./fonts/Gamay_Editorial_Medium_Italic.woff", weight: "500", style: "italic" },
    { path: "./fonts/Gamay_SemiBold.woff", weight: "600", style: "normal" },
  ],
  variable: "--font-gamay-editorial",
  display: "swap",
});

const gamayNarrow = localFont({
  src: "./fonts/Gamay_Narrow_Bold.woff",
  variable: "--font-gamay-narrow",
  weight: "700",
  display: "swap",
});

const gamayWide = localFont({
  src: "./fonts/Gamay_Wide_ExtraBold.woff",
  variable: "--font-gamay-wide",
  weight: "800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: "Articut",
    template: "%s | Articut",
  },
  description: "Articut",
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${gamayEditorial.variable} ${gamayNarrow.variable} ${gamayWide.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
