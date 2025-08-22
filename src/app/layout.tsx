import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JW Mini Dashboard",
  description: "Tiny demo: campaigns table with search & filter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}
