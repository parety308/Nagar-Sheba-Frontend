import type { Metadata } from "next";
import { LegalDocument } from "@/components/shared/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Nagar Sheba collects, uses and protects your information.",
  openGraph: { title: "Privacy policy | Nagar Sheba" },
};

const SECTIONS = [
  {
    heading: "Information we collect",
    body: [
      "When you register we collect your name, email address, phone number and address. When you file a request we collect its description, location coordinates and any photos you attach.",
      "We do not store card or mobile-wallet credentials. Payments are handled by SSLCommerz and bKash, and we keep only the transaction reference, amount and status.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "Your information is used to route requests to the right city department, verify payments, send status notifications and keep an audit trail of changes.",
    ],
  },
  {
    heading: "Who can see it",
    body: [
      "Staff see requests belonging to their own department. Administrators can see all requests and the audit log. Your citizen profile is never shown publicly.",
      "We use trusted processors: Cloudinary for image storage, SSLCommerz and bKash for payments, and an email provider for verification and notification messages.",
    ],
  },
  {
    heading: "Security and retention",
    body: [
      "Passwords are stored as salted hashes. Sessions use httpOnly cookies, and blocked or deleted accounts lose access immediately. Request records are retained for accountability and may be archived rather than erased.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can update your profile at any time from your dashboard. To request correction or deletion of your data, contact us using the details on the contact page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy policy"
      updated="1 October 2026"
      sections={SECTIONS}
    />
  );
}
