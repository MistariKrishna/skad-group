import clsx from "clsx";

type Props = {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  light?: boolean;
  center?: boolean;
  className?: string;
};

export default function SectionHeading({ id, eyebrow, title, intro, light = false, center = false, className }: Props) {
  return (
    <div className={clsx("max-w-2xl", center && "mx-auto text-center", className)}>
      <span
        className={clsx(
          "inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[.12em]",
          light ? "border-white/15 bg-white/5 text-gold" : "border-rule bg-white text-gold-dark shadow-[0_6px_16px_-12px_rgba(10,31,68,.35)]",
        )}
      >
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
        {eyebrow}
      </span>
      <h2
        id={id}
        className={clsx("mt-5 font-serif text-[clamp(32px,3.8vw,48px)] font-medium leading-[1.1] tracking-[-0.01em]", light ? "text-white" : "text-navy")}
      >
        {title}
      </h2>
      {intro && <p className={clsx("mt-5 text-lg leading-relaxed", light ? "text-white/70" : "text-body")}>{intro}</p>}
    </div>
  );
}