import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Figma Vectorizer",
  description: "Convert raster images to editable vectors in Figma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
