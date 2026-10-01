import Image from "next/image";
import { Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Thumbnail with a graceful fallback when no image has been uploaded yet. */
export function Thumb({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 400px, 100vw",
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  if (!src) {
    return (
      <div className={cn("grid place-items-center bg-gradient-to-br from-raised to-panel", className)}>
        <Gamepad2 className="text-mute/40" size={32} />
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" loading="lazy" />
    </div>
  );
}
