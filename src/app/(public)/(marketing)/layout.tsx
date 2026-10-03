import type { ReactNode } from "react";
import Footer from "@/components/layout/homepage/Footer";
import Navbar from "@/components/layout/homepage/Navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div id="main" className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}