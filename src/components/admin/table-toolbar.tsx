"use client";


export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface AdminTableToolbarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (filterId: string) => void;
  actionButton?: React.ReactNode;
}

export function AdminTableToolbar({
  searchPlaceholder = "Search products...",
  searchValue,
  onSearchChange,
  filters = [],
  activeFilter,
  onFilterChange,
  actionButton,
}: AdminTableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-navy-950/10 bg-white p-4 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-steel-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-navy-950/15 bg-mist-100/50 py-2.5 pl-10 pr-9 text-sm text-navy-950 placeholder:text-steel-400 focus:border-ventum-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ventum-blue-500/20"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-steel-400 hover:text-navy-950"
              aria-label="Clear search"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Action Button Slot */}
        {actionButton && (
          <div className="flex items-center gap-2">{actionButton}</div>
        )}
      </div>

      {/* Filter Chips */}
      {filters.length > 0 && onFilterChange && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-navy-950/5 pt-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-navy-950 text-white shadow-xs"
                    : "bg-mist-200/70 text-steel-600 hover:bg-mist-300/70 hover:text-navy-950"
                }`}
              >
                <span>{filter.label}</span>
                {filter.count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-navy-950/5 text-steel-500"
                    }`}
                  >
                    {filter.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

