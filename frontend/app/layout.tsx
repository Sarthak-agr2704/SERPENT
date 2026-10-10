import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "S.E.R.P.E.N.T. — Search Evidence & Research Platform",
  description:
    "S.E.R.P.E.N.T. — Search Evidence & Research Platform for Exploration, Networked Thinking. Autonomous multi-agent web intelligence powered by SerpApi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmMono.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050605] text-[#eee9da] overflow-x-hidden selection:bg-[#c6a96b] selection:text-black">
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

