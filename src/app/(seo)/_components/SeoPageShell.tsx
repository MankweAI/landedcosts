import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";

type SeoPageShellProps = {
  title: string;
  children: ReactNode;
};

export function SeoPageShell({ title, children }: SeoPageShellProps) {
  return <AppShell title={title}>{children}</AppShell>;
}

