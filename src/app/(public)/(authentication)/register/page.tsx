import type { Metadata } from "next";
import RegisterForm from "@/components/form/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Nagar Sheba citizen account.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
