import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Public_Sans } from "next/font/google";
import "./globals.css";
import { AppToaster } from "@/components/shared/AppToaster";
import { cn } from "@/lib/utils";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
        geistSans.variable,
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
        <ThemeProvider>
          <QueryProvider>
            <div className="flex-1">{children}</div>
            <AppToaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
