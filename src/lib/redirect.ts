/** Only same-site relative paths are allowed (prevents open redirects). */
export function getSafeRedirect(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : null;
}
