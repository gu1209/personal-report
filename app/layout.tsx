import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Name | Portfolio",
  description: "Personal portfolio — finance, technology, data analytics.",
  keywords: ["Portfolio", "Finance", "Data Analytics", "Python", "Quantitative"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "Your Name | Portfolio",
    description: "Personal portfolio — finance, technology, data analytics.",
    siteName: "Your Portfolio",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
