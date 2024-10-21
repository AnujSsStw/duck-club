"use client";

import { StickyHeader } from "@/components/layout/sticky-header";
import { Link } from "@/components/typography/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Loading } from "@/components/loading";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  return (
    <>
      <StickyHeader className="px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold no-underline">
            Duck Club App
          </Link>
          <div className="flex gap-4">
            <Button asChild className="no-underline">
              <Link href="/log">Log</Link>
            </Button>
            <SignInAndSignUpButtons />
          </div>
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
  const user = useQuery(api.users.current);
  const hunts = useQuery(api.hunts.getHunts, {
    id: user?._id,
  });
  if (!hunts) return <Loading />;
  console.log(hunts);

  return (
    <>
      <div className="h-full px-4 py-6 w-[75%] mx-auto">
        <Table>
          <TableCaption>A list of your Log Hunts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Created At</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Hunt Date</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hunts.map((hunt) => (
              <TableRow key={hunt._id}>
                <TableCell>
                  {new Date(hunt._creationTime).toLocaleDateString()}
                </TableCell>
                <TableCell>{hunt.locationName}</TableCell>
                <TableCell>{new Date(hunt.date).toDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button asChild className="no-underline">
                    <Link href={`/log/${hunt._id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
