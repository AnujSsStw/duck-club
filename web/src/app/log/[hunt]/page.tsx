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

  const hunt = useQuery(api.hunts.getSubHunts, {
    id: pathname.split("/").pop() as any,
  });
  if (!hunt) return <Loading />;

  console.log(hunt);

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
            <Button asChild={!h?.init} disabled={h?.init} key={h?._id}>
              <Link
                as="button"
                href={`/log/${pathname.split("/").pop()}/${h?._id}`}
                className="uppercase"
              >
                {h?.timeSlot}
              </Link>
            </Button>
          ))}
        </CardContent>
        {/* <CardFooter>
          <Button className="w-full">
            <CheckIcon /> Mark all as read
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  );
}
