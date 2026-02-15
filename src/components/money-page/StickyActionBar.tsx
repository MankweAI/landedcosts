"use client";

type StickyActionBarProps = {
  onAction: (action: "save" | "export" | "compare" | "watchlist") => void;
};

export function StickyActionBar({ onAction }: StickyActionBarProps) {
  const actions: Array<{ id: "save" | "export" | "compare" | "watchlist"; label: string }> = [
    { id: "save", label: "Save" },
    { id: "export", label: "Export" },
    { id: "compare", label: "Compare" },
    { id: "watchlist", label: "Watchlist" }
  ];

  return (
    <div className="fixed bottom-14 left-0 right-0 z-50 border-t border-slate-200 bg-white px-3 py-2 lg:bottom-4 lg:left-auto lg:right-4 lg:w-auto lg:rounded-lg lg:border lg:shadow-sm">
      <div className="mx-auto flex max-w-[740px] justify-between gap-2 lg:max-w-none">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onAction(action.id)}
            className="flex-1 rounded-md border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50 lg:flex-none"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

