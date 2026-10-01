import type { Metadata } from "next";
import { LegalDocument } from "@/components/shared/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The rules for using the Nagar Sheba platform.",
  openGraph: { title: "Terms of service | Nagar Sheba" },
};

const SECTIONS = [
  {
    heading: "Using Nagar Sheba",
    body: [
      "Nagar Sheba lets residents report civic issues and apply for city permits. You agree to provide accurate information and to use the service only for genuine requests.",
    ],
  },
  {
    heading: "Accounts",
    body: [
      "You are responsible for keeping your password confidential. Staff and administrator accounts are created by an administrator and require a password change on first login. Accounts used abusively may be blocked.",
    ],
  },
  {
    heading: "Requests and service times",
    body: [
      "Each service category has a target resolution time. The clock starts when a request is assigned, and overdue requests are flagged for administrators. Target times are commitments to track, not guarantees of outcome.",
      "You may reopen a resolved request within 3 days. After that it closes automatically.",
    ],
  },
  {
    heading: "Fees, cancellations and refunds",
    body: [
      "Fees are shown before you submit. Work on a paid request begins once payment is verified. You may cancel a request while it is pending payment, submitted or assigned; a completed payment is then refunded to the original method. If an automatic refund fails, an administrator can retry it.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "Do not upload unlawful, misleading or offensive content, or attempt to access data that is not yours. Photos must be images up to 5 MB each, with at most 5 per request.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "We may update these terms as the service evolves. Continued use after a change means you accept the updated terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of service"
      updated="1 October 2026"
      sections={SECTIONS}
    />
  );
}
