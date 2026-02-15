"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";

export default function SavedPage() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem("saved_scenarios");
    if (!raw) return;
    try {
      setItems(JSON.parse(raw) as string[]);
    } catch {
      setItems([]);
    }
  }, []);

  return (
    <AppShell title="Saved Scenarios">
      <h1 className="text-2xl font-bold text-slate-900">Saved Scenarios</h1>
      <p className="mt-2 text-slate-700">MVP uses localStorage until auth is enabled.</p>
      <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
        {items.length === 0 ? <li>No saved scenarios yet.</li> : items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </AppShell>
  );
}

