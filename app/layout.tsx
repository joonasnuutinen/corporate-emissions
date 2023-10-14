import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Emissions",
  description: "Compare greenhouse gas emissions of companies over time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
