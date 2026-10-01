import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { value: number; onChange?: (value: number) => void };

const STARS = [1, 2, 3, 4, 5];

/** Interactive when onChange is given, read-only otherwise. */
export function StarRating({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {STARS.map((n) => {
        const starClass = cn(
          "size-5",
          n <= value
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground/40",
        );

        if (onChange) {
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={n === value}
              className="rounded p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <Star className={starClass} />
            </button>
          );
        }

        return (
          <span key={n}>
            <Star className={starClass} />
          </span>
        );
      })}
      {!onChange && <span className="sr-only">{value} out of 5</span>}
    </div>
  );
}
