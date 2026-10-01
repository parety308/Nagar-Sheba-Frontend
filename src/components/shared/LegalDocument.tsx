import { PageHeader } from "@/components/shared/PageHeader";

type Section = { heading: string; body: string[] };
type Props = { title: string; updated: string; sections: Section[] };

export function LegalDocument({ title, updated, sections }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader title={title} description={`Last updated ${updated}`} />
      <div className="space-y-8">
        {sections.map((s, i) => (
          <section key={s.heading}>
            <h2 className="text-base font-semibold">
              {i + 1}. {s.heading}
            </h2>
            {s.body.map((p) => (
              <p
                key={p}
                className="mt-2 text-sm leading-6 text-muted-foreground"
              >
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
