import { useEffect, useState } from "react";

/** Preview URLs for files. Created and revoked inside one effect, so React Strict Mode can't leave revoked URLs behind. */
export function useObjectUrls(files: File[]) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  useEffect(() => {
    const next = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews(next);
    return () => {
      for (const p of next) URL.revokeObjectURL(p.url);
    };
  }, [files]);

  return previews;
}