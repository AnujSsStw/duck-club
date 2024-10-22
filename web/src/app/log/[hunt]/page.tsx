"use client";
import { BellIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loading } from "@/components/loading";

export default function CardDemo() {
  const pathname = usePathname();

  // const hunt = useQuery(api.hunts.getSubHunts, {
  //   id: pathname.split("/").pop() as any,
  // });
  const huntExists = useQuery(api.huntsAllData.getTakenTimeSlots, {
    huntId: pathname.split("/").pop() as any,
  });
  if (!huntExists) return <Loading />;


  const hunt = ["morning", "mid-day", "afternoon"];

  return (
    <div className="flex  w-full h-screen justify-center items-center">
      <Card className={cn("w-[380px]")}>
        <CardHeader>
          <CardTitle>Navigate to Time slots</CardTitle>
          <CardDescription>
            Nav to different time slot to add details about hunt
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {hunt.map((h) => (
            <Button key={h} disabled={huntExists.includes(h)}>
              <Link
                href={`/log/${pathname.split("/").pop()}/${h}`}
                className="uppercase"
              >
                {h}
              </Link>
            </Button>
          ))}
        </CardContent>
        <CardFooter className="justify-center">
          {huntExists.length === 3 && (
            <div className="flex justify-center flex-col">
              <Link href={"/"} className="flex items-center">
                <CheckIcon /> All Done Go to Home
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
