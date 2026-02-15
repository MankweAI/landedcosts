import { AppShell } from "@/components/shell/AppShell";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="mt-2 text-slate-700">Authentication, billing and workspace settings land here in later phases.</p>
    </AppShell>
  );
}

