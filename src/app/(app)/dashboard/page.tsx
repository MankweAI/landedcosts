import { AppShell } from "@/components/shell/AppShell";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-700">Scenario history and watchlists are upgrade-gated in this MVP.</p>
    </AppShell>
  );
}

