"use client";

import { Loading } from "@/components/loading";
import { Link } from "@/components/typography/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { HuntingDashboard } from "./charts";

export default function Home() {
  return (
    <>
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

export function SignInAndSignUpButtons() {
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
  const user = useQuery(api.users.current);
  const hunts = useQuery(api.huntsAllData.getHuntsByCreator, {
    creatorId: user?._id,
  });
  if (!hunts) return <Loading />;

  return (
    <>
      <div className="w-full px-4 py-6 md:w-[90%] lg:w-[75%] mx-auto">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Your Hunts</h2>
          <Button asChild>
            <Link href="/q" className="no-underline">
              <Plus className="w-4 h-4 mr-2" />
              Create Hunt
            </Link>
          </Button>
        </div>

        <Separator className="my-4" />
      </div>
      <HuntingDashboard />
    </>
  );
}
