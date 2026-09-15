"use client";

import { useState } from "react";
import type { ProductSpec } from "@/lib/types";

interface SpecsEditorProps {
  initialSpecs?: ProductSpec[];
  name?: string;
}

export function SpecsEditor({
  initialSpecs = [],
  name = "specifications",
}: SpecsEditorProps) {
  const [specs, setSpecs] = useState<ProductSpec[]>(
    initialSpecs.length > 0 ? initialSpecs : [{ label: "", value: "" }]
  );

  function handleAdd() {
    setSpecs([...specs, { label: "", value: "" }]);
  }

  function handleRemove(index: number) {
    if (specs.length === 1) {
      setSpecs([{ label: "", value: "" }]);
    } else {
      setSpecs(specs.filter((_, i) => i !== index));
    }
  }

  function handleChange(index: number, field: "label" | "value", val: string) {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  }

  const validSpecs = specs.filter((s) => s.label.trim() || s.value.trim());

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-steel-700">
          Technical Specifications
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 rounded-md bg-mist-200 px-2.5 py-1 text-xs font-semibold text-navy-950 transition-colors hover:bg-mist-300"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Spec
        </button>
      </div>

      <p className="text-xs text-steel-500">
        Key parameters like Voltage, Current, Poles, Protection Rating, etc.
      </p>

      {/* Hidden input for standard form submission */}
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(validSpecs)}
      />

      <div className="flex flex-col gap-2">
        {specs.map((spec, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Rated Current"
              value={spec.label}
              onChange={(e) => handleChange(index, "label", e.target.value)}
              className="flex-1 rounded-lg border border-navy-950/15 bg-white px-2.5 py-2 text-xs text-navy-950 placeholder:text-steel-400 focus:border-ventum-blue-500 focus:outline-none focus:ring-1 focus:ring-ventum-blue-500"
            />
            <input
              type="text"
              placeholder="e.g. 100A / 3P"
              value={spec.value}
              onChange={(e) => handleChange(index, "value", e.target.value)}
              className="flex-1 rounded-lg border border-navy-950/15 bg-white px-2.5 py-2 text-xs text-navy-950 placeholder:text-steel-400 focus:border-ventum-blue-500 focus:outline-none focus:ring-1 focus:ring-ventum-blue-500"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              title="Remove row"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-steel-400 transition-colors hover:bg-mist-200 hover:text-ventum-red-600"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

