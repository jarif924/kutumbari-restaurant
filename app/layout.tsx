import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "KutumBari Restaurant | কুটুমবাড়ি রেস্টুরেন্ট - স্বাদের সাথে ভালোবাসার এক আপন ঠিকানা",
  description:
    "KutumBari Restaurant in Bhandaria (Main Road, 2nd Floor, Reserve Pukur Par). Premium dining for Bangla, Chinese & Fast-Food. Grand Opening 15% Discount. Dine-in, family gatherings, birthday & wedding events.",
  keywords: [
    "KutumBari Restaurant",
    "কুটুমবাড়ি রেস্টুরেন্ট",
    "Bhandaria Restaurant",
    "ভাণ্ডারিয়া রেস্টুরেন্ট",
    "Bangla Food",
    "Chinese Food",
    "Fast Food",
    "Reserve Pukur Par",
    "Best Restaurant Bhandaria",
  ],
  authors: [{ name: "KutumBari Restaurant" }],
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "KutumBari Restaurant | কুটুমবাড়ি রেস্টুরেন্ট",
    description: "স্বাদের সাথে ভালোবাসার এক আপন ঠিকানা | Good Food Together",
    images: [{ url: "/logo.jpg" }],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#073322",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body className="antialiased bg-white text-brand-charcoal overflow-x-hidden selection:bg-brand-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
