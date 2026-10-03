import type { Metadata } from "next";
import { Geist_Mono, Inter, Public_Sans } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/shared/AppToaster";
import { cn } from "@/lib/utils";
import { MotionProvider } from "@/providers/motion.provider";
import QueryProvider from "@/providers/query.provider";
import { ThemeProvider } from "@/providers/theme.provider";

const publicSansHeading = Public_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: { default: "Nagar Sheba", template: "%s | Nagar Sheba" },
  description: "Smart City Services for Citizens",
  openGraph: {
    title: "Nagar Sheba",
    description: "Report civic issues, pay service fees and track requests.",
    type: "website",
  },
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("ns-theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistMono.variable,
        inter.variable,
        publicSansHeading.variable,
        "font-sans",
      )}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Required for pre-hydration theme initialization */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>

      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <QueryProvider>
            <MotionProvider>
              <div className="flex-1">{children}</div>
              <AppToaster />
            </MotionProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
