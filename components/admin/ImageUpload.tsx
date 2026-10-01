"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { uploadThumbnail } from "@/lib/actions";
import { useToast } from "@/components/ui/Toast";

export function ImageUpload({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  async function onPick(file: File | undefined) {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadThumbnail({ ok: false, message: "" }, fd);
    setLoading(false);
    if (result.ok && result.url) {
      setUrl(result.url);
    } else {
      toast(result.message || "Upload failed", "error");
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-xl">
          <div className="relative aspect-video w-full">
            <Image src={url} alt="Thumbnail preview" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => setUrl("")}
            className="focus-ring absolute right-2 top-2 rounded-full bg-void/70 p-1.5 text-ink hover:bg-void"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="focus-ring card-surface flex aspect-video w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border-dashed text-mute hover:text-ink"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
          <span className="text-xs">{loading ? "Uploading…" : "Upload image"}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
    </div>
  );
}
