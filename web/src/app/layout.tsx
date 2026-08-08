import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leseli | Study path finder for Basotho students",
  description:
    "Explore likely study options in Lesotho from your LGCSE subjects, grades, and interests.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
