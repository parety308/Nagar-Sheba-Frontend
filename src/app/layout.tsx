import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Public_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/query.provider";

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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
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
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <div className="flex-1">{children}</div>
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
