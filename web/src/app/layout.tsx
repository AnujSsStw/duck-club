import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { StickyHeader } from "@/components/layout/sticky-header";
import Link from "next/link";
import { SignInAndSignUpButtons } from "./page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My App Title",
  description: "My app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <StickyHeader className="px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-4 items-center">
                <Link href="/" className="text-2xl font-bold no-underline">
                  Kill Book
                </Link>
                <Link
                  href="/data-view"
                  className="text-md text-gray-500 no-underline"
                >
                  Data View
                </Link>
              </div>

              <div className="flex gap-4">
                <SignInAndSignUpButtons />
              </div>
            </div>
          </StickyHeader>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
