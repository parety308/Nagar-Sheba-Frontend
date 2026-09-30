import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

const footerLinks = {
  platform: [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact" },
  ],
  citizen: [
    { name: "Login", href: "/login" },
    { name: "Create Account", href: "/register" },
    { name: "My Dashboard", href: "/citizen" },
    { name: "My Requests", href: "/citizen/requests" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                <ShieldCheck className="size-5" />
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight">Nagar Sheba</p>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Smart City Services
                </p>
              </div>
            </Link>

            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              A digital platform connecting citizens with essential city
              services. Submit complaints, track requests, and stay connected
              with your community.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0 text-primary" />
                <a
                  href="mailto:support@nagarsheba.com"
                  className="transition-colors hover:text-foreground"
                >
                  support@nagarsheba.com
                </a>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="size-4 shrink-0 text-primary" />
                <a
                  href="tel:+8801700000000"
                  className="transition-colors hover:text-foreground"
                >
                  +880 1700-000000
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="/"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <FaFacebook />
              </a>

              <a
                href="/"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <FaInstagram className="size-4" />
              </a>

              <a
                href="/"
                aria-label="Twitter"
                className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <FaTwitter className="size-4" />
              </a>

              <a
                href="/"
                aria-label="GitHub"
                className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <FaGithub className="size-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <FooterColumn title="Platform" links={footerLinks.platform} />

          {/* Citizen */}
          <FooterColumn title="Citizen" links={footerLinks.citizen} />

          {/* Support */}
          <FooterColumn title="Support" links={footerLinks.support} />
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t pt-6">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Nagar Sheba. All rights reserved.
            </p>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground sm:justify-end">
              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="transition-colors hover:text-foreground"
              >
                Terms
              </Link>

              <Link
                href="/contact"
                className="transition-colors hover:text-foreground"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>

      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
