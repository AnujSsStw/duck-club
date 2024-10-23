"use client";

import { StickyHeader } from "@/components/layout/sticky-header";
import { Loading } from "@/components/loading";
import { Link } from "@/components/typography/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

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
        <Button asChild className="no-underline">
          <Link href="/log">Log</Link>
        </Button>
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
    <div className="w-full px-4 py-6 md:w-[90%] lg:w-[75%] mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Added Log Hunts</h2>
      <p className="text-sm text-gray-500 mb-4">Click on the add button to add a session.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hunts.map((hunt) => (
          <Card key={hunt.id}>
            <CardHeader>
              <CardTitle className="text-lg">{hunt.location}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Created: {new Date(hunt.createdAt!).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Hunt Date: {new Date(hunt.date!).toDateString()}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/log/${hunt.id}`}>Add Session</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
