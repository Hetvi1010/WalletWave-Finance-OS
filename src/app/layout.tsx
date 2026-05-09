import type { Metadata } from "next";
import "@/app/globals.css";
import { AppProvider } from "@/components/providers/app-provider";

export const metadata: Metadata = {
  title: "WalletWave | Personal Finance Tracker",
  description: "Production-ready personal finance tracker with analytics, budgets, exports, and dark mode."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
