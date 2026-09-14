"use client";

import { useEffect, useRef, useState } from "react";

export interface ExistingImage {
  id: string;
  url: string;
}

interface ImageUploaderProps {
  /**
   * Images already attached to the product (edit mode). URLs are resolved on
   * the server — the bucket id is not exposed to the client bundle.
   */
  existingImages?: ExistingImage[];
  /** Told the current image count so the form can explain the draft rule. */
  onCountChange?: (count: number) => void;
}

interface Pending {
  id: string;
  file: File;
  url: string;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const MAX_BYTES = 8 * 1024 * 1024;

export function ImageUploader({ existingImages = [], onCountChange }: ImageUploaderProps) {
  const [kept, setKept] = useState<ExistingImage[]>(existingImages);
  const [pending, setPending] = useState<Pending[]>([]);
  const [dragging, setDragging] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const total = kept.length + pending.length;

  useEffect(() => {
    onCountChange?.(total);
  }, [total, onCountChange]);

  // Object URLs are only valid while the preview is on screen.
  useEffect(() => {
    return () => {
      for (const item of pending) URL.revokeObjectURL(item.url);
    };
  }, [pending]);

  /**
   * The file input is the only thing the form serialises, so it must hold
   * exactly the files we are previewing. Rebuild it from our own list.
   */
  const syncInput = (items: Pending[]) => {
    if (!inputRef.current) return;
    const transfer = new DataTransfer();
    for (const item of items) transfer.items.add(item.file);
    inputRef.current.files = transfer.files;
  };

  const addFiles = (files: FileList | File[]) => {
    const next: Pending[] = [];
    const rejected: string[] = [];

    for (const file of Array.from(files)) {
      if (!ACCEPT.split(",").includes(file.type)) {
        rejected.push(`${file.name} is not a JPEG, PNG, WebP or AVIF image`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        rejected.push(`${file.name} is larger than 8MB`);
        continue;
      }
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        url: URL.createObjectURL(file),
      });
    }

    setProblems(rejected);
    if (next.length === 0) return;

    setPending((current) => {
      const merged = [...current];
      for (const item of next) {
        if (!merged.some((existing) => existing.id === item.id)) merged.push(item);
      }
      syncInput(merged);
      return merged;
    });
  };

  const removePending = (id: string) => {
    setPending((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      const next = current.filter((item) => item.id !== id);
      syncInput(next);
      return next;
    });
  };

  const removeKept = (id: string) =>
    setKept((current) => current.filter((image) => image.id !== id));

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="block text-xs font-bold uppercase tracking-wider text-steel-700">
          Product images
        </span>
        <span className="text-xs text-steel-500">
          {total === 0 ? "None yet — saves as draft" : `${total} image${total === 1 ? "" : "s"}`}
        </span>
      </div>

      {/* Ids the admin kept; anything dropped here is deleted on save. */}
      <input
        type="hidden"
        name="keepImageIds"
        value={JSON.stringify(kept.map((image) => image.id))}
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files.length > 0) addFiles(event.dataTransfer.files);
        }}
        className={`mt-2 rounded-xl border-2 border-dashed p-4 transition-colors ${
          dragging
            ? "border-ventum-blue-500 bg-ventum-blue-50"
            : "border-navy-950/15 bg-mist-100/40"
        }`}
      >
        {total > 0 && (
          <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {kept.map((image, index) => (
              <li key={image.id} className="group relative aspect-square overflow-hidden rounded-lg border border-navy-950/10 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-navy-950/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                    Main
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeKept(image.id)}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy-950/80 text-white opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <span aria-hidden="true" className="text-xs">&times;</span>
                </button>
              </li>
            ))}

            {pending.map((item, index) => (
              <li key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-ventum-blue-300 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.file.name} className="h-full w-full object-cover" />
                {kept.length === 0 && index === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-navy-950/80 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                    Main
                  </span>
                )}
                <span className="absolute bottom-1 left-1 rounded bg-ventum-blue-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  New
                </span>
                <button
                  type="button"
                  onClick={() => removePending(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy-950/80 text-white opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <span aria-hidden="true" className="text-xs">&times;</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <label className="flex cursor-pointer flex-col items-center gap-1 py-2 text-center">
          <span className="rounded-xl border border-navy-950/15 bg-white px-4 py-2 text-xs font-semibold text-navy-950 transition-colors hover:bg-mist-100">
            Choose images
          </span>
          <span className="text-xs text-steel-500">
            or drag and drop — JPEG, PNG, WebP or AVIF, up to 8MB each
          </span>
          <input
            ref={inputRef}
            type="file"
            name="images"
            accept={ACCEPT}
            multiple
            className="sr-only"
            onChange={(event) => {
              if (event.target.files) addFiles(event.target.files);
            }}
          />
        </label>
      </div>

      {problems.length > 0 && (
        <ul className="mt-2 space-y-1" role="alert">
          {problems.map((problem) => (
            <li key={problem} className="text-xs font-semibold text-ventum-red-700">
              {problem}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-2 text-xs text-steel-500">
        The first image is used on product cards. A product with no image can be
        saved, but stays a draft until you add one.
      </p>
    </div>
  );
}
