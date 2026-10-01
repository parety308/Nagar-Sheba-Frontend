"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useEffect, useMemo } from "react";
import { toast } from "sonner";

const MAX_SIZE = 5 * 1024 * 1024;

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  max?: number;
  disabled?: boolean;
};

export function PhotoPicker({ files, onChange, max = 5, disabled }: Props) {
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(
    () => () => {
      for (const p of previews) URL.revokeObjectURL(p.url);
    },
    [previews],
  );

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = ""; // allow re-selecting the same file

    const accepted: File[] = [];
    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
      } else if (file.size > MAX_SIZE) {
        toast.error(`${file.name} is larger than 5 MB`);
      } else {
        accepted.push(file);
      }
    }

    const next = [...files, ...accepted];
    if (next.length > max) {
      toast.error(`You can attach at most ${max} photos`);
      onChange(next.slice(0, max));
      return;
    }
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {previews.map((p, index) => (
          <div
            key={`${p.file.name}-${p.file.lastModified}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
          >
            <Image
              src={p.url}
              alt={p.file.name}
              fill
              unoptimized
              sizes="120px"
              className="object-cover"
            />
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange(files.filter((_, i) => i !== index))}
              aria-label={`Remove ${p.file.name}`}
              className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/70 text-white outline-none hover:bg-black focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        {files.length < max && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-[11px] text-muted-foreground transition-colors hover:bg-muted has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50">
            <ImagePlus className="size-5" />
            Add photo
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={disabled}
              onChange={handleSelect}
              className="sr-only"
            />
          </label>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">
        {files.length} / {max} photos. Images only, up to 5 MB each.
      </p>
    </div>
  );
}
