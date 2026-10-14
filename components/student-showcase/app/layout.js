import "./globals.css";

export const metadata = {
  title: "PIBI TECH | Student Project Showcase 2026 — Win Top 3 Prizes & Launch on PiBi Open Intelligence",
  description:
    "PIBI TECH National Student Project Showcase and Awards. Compete for Top 3 cash prizes and get your project officially published and featured on PiBi Open Intelligence.",
  keywords: [
    "PIBI TECH",
    "student projects",
    "PiBi Open Intelligence",
    "project showcase",
    "student innovation",
    "cash prizes",
  ],
  authors: [{ name: "PIBI TECH in partnership with PiBi Open Intelligence" }],
};

export default function RootLayout({ children }) {
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
