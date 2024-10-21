"use client";

import { StickyHeader } from "@/components/layout/sticky-header";
import { Link } from "@/components/typography/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Home() {
  return (
    <>
      <StickyHeader className="px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold no-underline">
            Duck Club App
          </Link>
          <SignInAndSignUpButtons />
        </div>
      </StickyHeader>

      <main className="container flex flex-col gap-8">
        <Authenticated>
          <SignedInContent />
        </Authenticated>
        <Unauthenticated>
          <p>Click one of the buttons in the top right corner to sign in.</p>
        </Unauthenticated>
      </main>
    </>
  );
}

function SignInAndSignUpButtons() {
  return (
    <div className="flex gap-4">
      <Authenticated>
        <UserButton afterSignOutUrl="#" />
      </Authenticated>
      <Unauthenticated>
        <SignInButton mode="modal">
          <Button variant="ghost">Sign in</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button>Sign up</Button>
        </SignUpButton>
      </Unauthenticated>
    </div>
  );
}

function SignedInContent() {
  return (
    <>
      <div className="h-full px-4 py-6 ">
        <Button asChild className="no-underline">
          <Link href="/log">Log</Link>
        </Button>
      </div>
    </>
  );
}
