import Image from "next/image";
import clsx from "clsx";

type Props = {
  src?: string;
  alt: string;
  label: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function Media({ src, alt, label, className, sizes = "(min-width: 1024px) 50vw, 100vw", priority = false }: Props) {
  return (
    <div className={clsx("relative overflow-hidden bg-mist", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#EEF0F3] to-[#E1E5EB] text-center">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 text-[#A3ABB8]" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="6" width="18" height="13" rx="2" />
            <circle cx="12" cy="12.5" r="3.5" />
            <path d="M8.5 6l1.5-2h4l1.5 2" />
          </svg>
          <span className="px-6 text-[11.5px] font-medium uppercase tracking-[.12em] text-[#8A93A2]">{label}</span>
        </div>
      )}
    </div>
  );
}