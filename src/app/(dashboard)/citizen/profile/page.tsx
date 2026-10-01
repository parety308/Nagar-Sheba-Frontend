import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/ProfileView";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile & settings"
        description="Manage your details, photo and password."
      />
      <ProfileView />
    </>
  );
}
