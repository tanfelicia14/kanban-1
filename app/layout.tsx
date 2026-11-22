import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "Aplikasi Kanban Board",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
     <body className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50 to-pink-50 antialiased">
  {children}
</body>
    </html>
  );
}