import Image from "next/image";
import type { Attachment } from "@/types/request.type";

type Props = { title: string; attachments: Attachment[] };

export function AttachmentGallery({ title, attachments }: Props) {
  if (attachments.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {attachments.map((a, index) => (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noreferrer"
            className="relative aspect-video overflow-hidden rounded-lg border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Image
              src={a.url}
              alt={`${title} ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 220px, 45vw"
              className="object-cover transition-transform hover:scale-105"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
