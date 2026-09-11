"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  deleteProductImageAction,
  uploadProductImageAction,
} from "@/lib/actions/images";

export interface ManagedImage {
  id: string;
  url: string;
}

interface ProductImageManagerProps {
  value: ManagedImage[];
  onChange: (images: ManagedImage[]) => void;
  max?: number;
}

/** Upload / remove product images. Keeps `value` as the source of truth. */
export function ProductImageManager({
  value,
  onChange,
  max = 8,
}: ProductImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remaining = max - value.length;
    if (remaining <= 0) {
      toast.error(`You can add up to ${max} images.`);
      return;
    }

    setUploading(true);
    const uploaded: ManagedImage[] = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadProductImageAction(formData);
      if (result.ok) {
        uploaded.push(result.data);
      } else {
        toast.error(`${file.name}: ${result.error}`);
      }
    }
    setUploading(false);
    if (uploaded.length > 0) onChange([...value, ...uploaded]);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleRemove(image: ManagedImage) {
    onChange(value.filter((img) => img.id !== image.id));
    const result = await deleteProductImageAction(image.id);
    if (!result.ok) {
      toast.error("Couldn't delete the file from storage, but it's been removed here.");
    }
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {value.map((image, index) => (
            <li key={image.id} className="relative size-24">
              <div className="relative size-24 overflow-hidden rounded-md border border-border bg-muted">
                <Image src={image.url} alt="" fill sizes="96px" className="object-cover" />
              </div>
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Primary
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(image)}
                className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full border border-border bg-card shadow-sm hover:bg-muted"
                aria-label="Remove image"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <label
        className={cn(
          "flex h-24 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:bg-muted/50",
          value.length >= max && "pointer-events-none opacity-50",
        )}
      >
        {uploading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Upload className="size-5" />
        )}
        <span>{uploading ? "Uploading…" : "Add images"}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading || value.length >= max}
        />
      </label>
      <p className="text-xs text-muted-foreground">
        JPEG, PNG, WebP or AVIF, up to 5MB each. The first image is used as
        the primary photo.
      </p>
    </div>
  );
}
