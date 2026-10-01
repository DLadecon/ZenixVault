import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Providers } from "./providers";
import "./globals.css";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

// Every page depends on live database content (settings, scripts, games),
// so the whole app is rendered fresh per request rather than pre-built at
// deploy time — this also avoids needing a database connection during the
// build step itself.
export const dynamic = "force-dynamic";


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: settings.siteName, template: `%s — ${settings.siteName}` },
    description: settings.tagline,
    icons: { icon: "/favicon.svg" },
    openGraph: {
      siteName: settings.siteName,
      title: settings.siteName,
      description: settings.tagline,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: settings.siteName, description: settings.tagline },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased">
        <Providers>
          <Navbar siteName={settings.siteName} youtubeChannel={settings.youtubeChannel} />
          <main>{children}</main>
          <Footer
            siteName={settings.siteName}
            tagline={settings.tagline}
            youtubeChannel={settings.youtubeChannel}
            discordUrl={settings.discordUrl}
          />
        </Providers>
      </body>
    </html>
  );
}
