import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "LandedCost Intelligence",
  description: "Decision-grade landed cost and import readiness for China -> South Africa.",
  verification: {
    google: "lL6Be2txXM5pG3Y-M094cYxOCswvGaXYCWV26Vev26g"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
