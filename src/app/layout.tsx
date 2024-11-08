import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { StickyHeader } from "@/components/layout/sticky-header";
import Link from "next/link";
import { SignInAndSignUpButtons } from "./page";
import { Book } from "lucide-react";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kill Book",
  description: "A place to store your hunting data",
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
                <Book className="w-6 h-6" />
                <Link href="/" className="text-2xl font-bold no-underline">
                  Kill Book
                </Link>
                <nav className="flex flex-row gap-2 items-center">
                  <Button asChild variant="ghost">
                    <Link
                      href="/data-view"
                      className={cn("no-underline", "text-blue-500")}
                    >
                      Explore
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link
                      href="/gallery"
                      className="no-underline text-blue-500"
                    >
                      Gallery
                    </Link>
                  </Button>
                </nav>
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
