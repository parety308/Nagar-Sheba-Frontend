import { cn } from "@/lib/utils";

type Props = { latitude: number; longitude: number; className?: string };

export function LocationPreview({ latitude, longitude, className }: Props) {
  const d = 0.006;
  const bbox = [longitude - d, latitude - d, longitude + d, latitude + d].join(
    "%2C",
  );
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <iframe
      title="Request location on map"
      src={src}
      loading="lazy"
      className={cn("h-56 w-full rounded-lg border", className)}
    />
  );
}
