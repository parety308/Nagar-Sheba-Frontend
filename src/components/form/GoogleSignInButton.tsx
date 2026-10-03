"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useGoogleLogin } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { getSafeRedirect } from "@/lib/redirect";
import { getRoleHome } from "@/lib/roles";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

type GoogleCredentialResponse = { credential: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number>,
          ) => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const { mutate: googleLogin } = useGoogleLogin();

  const handleCredential = useCallback(
    (response: GoogleCredentialResponse) => {
      googleLogin(response.credential, {
        onSuccess: (user) => {
          toast.success("Welcome!", {
            description: "You signed in with Google.",
          });
          router.replace(
            getSafeRedirect(searchParams.get("redirect")) ??
              getRoleHome(user.role),
          );
          router.refresh();
        },
        onError: (error) =>
          toast.error("Google sign in failed", {
            description: getApiErrorMessage(error),
          }),
      });
    },
    [googleLogin, router, searchParams],
  );

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredential,
    });
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      width: 320,
    });
  }, [scriptReady, handleCredential]);

  if (!CLIENT_ID) return null;

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="flex min-h-11 justify-center" />
    </>
  );
}
