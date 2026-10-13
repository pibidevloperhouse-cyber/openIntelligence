import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIBI TECH | Student Project Showcase 2026 — Win Top 3 Prizes & Launch on Open Intelligence",
  description:
    "PIBI TECH National Student Project Showcase and Awards. Compete for Top 3 cash prizes and get your project officially published and featured on Open Intelligence.",
  keywords: [
    "PIBI TECH",
    "student projects",
    "Open Intelligence",
    "project showcase",
    "student innovation",
    "cash prizes",
  ],
  authors: [{ name: "PIBI TECH in partnership with Open Intelligence" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-slate-800 antialiased selection:bg-[#2ec4b6]/20 selection:text-[#1f6fb2]">
        {children}
      </body>
    </html>
  );
}
