"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CloudSun,
  Users,
  Bird,
  Camera,
  MapPin,
  Sun,
  Sunrise,
  Sunset,
  LinkIcon,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loading } from "@/components/loading";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import {} from "next";
import Link from "next/link";

const TimeSlotSection = ({
  title,
  icon,
  sessions,
  huntId,
}: {
  title: string;
  icon: React.ReactNode;
  sessions: any[];
  huntId: string;
}) => {
  if (!sessions.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Link
          href={`/view-hunt/${huntId}?session=${title.toLowerCase().split(" ")[0]}`}
          className="text-muted-foreground"
        >
          <LinkIcon />
        </Link>
      </div>
      <div className="">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
};

const SessionCard = ({ session }: { session: any }) => {
  const totalHarvest = session.hunters.reduce(
    (total: any, hunter: { harvests: any[] }) =>
      total +
      hunter.harvests.reduce(
        (sum: any, harvest: { quantity: any }) => sum + harvest.quantity,
        0
      ),
    0
  );

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Weather Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudSun className="h-5 w-5" />
              <span>{session.weather?.condition}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {session.weather?.temperatureC}°C,{" "}
              {session.weather?.windDirection} {session.weather?.windSpeed}km/h
            </span>
          </div>

          <Separator />

          {/* Hunters & Harvests Summary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{session.hunters.length} hunters</span>
              </div>
              <div className="flex items-center gap-2">
                <Bird className="h-5 w-5" />
                <span>{totalHarvest} harvests</span>
              </div>
            </div>

            {/* Hunter Details */}
            <div className="space-y-2 mt-2">
              {session.hunters.map(
                (
                  hunter: {
                    fullName:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | React.PromiseLikeOfReactNode
                      | null
                      | undefined;
                    memberShipType:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | React.PromiseLikeOfReactNode
                      | null
                      | undefined;
                    duckBlind: {
                      name:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | React.PromiseLikeOfReactNode
                        | null
                        | undefined;
                    };
                  },
                  idx: React.Key | null | undefined
                ) => (
                  <div key={idx} className="text-sm bg-muted p-2 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{hunter.fullName}</span>
                      <Badge variant="outline">{hunter.memberShipType}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{hunter.duckBlind.name}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Notes */}
          {session.note && (
            <div className="text-sm text-muted-foreground italic">
              "{session.note}"
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export function HuntView({ huntId }: { huntId: Id<"huntsAllData"> }) {
  const huntDetails = useQuery(api.huntsAllData.getHuntDetails2, { huntId });

  if (
    !huntDetails ||
    !huntDetails.sessions ||
    huntDetails.sessions.length === 0
  ) {
    return <Loading />;
  }

  // Group sessions by time slot
  const sessionsByTimeSlot = {
    morning: huntDetails.sessions?.filter((s) => s.timeSlot === "morning"),
    midDay: huntDetails.sessions?.filter((s) => s.timeSlot === "mid-day"),
    afternoon: huntDetails.sessions?.filter((s) => s.timeSlot === "afternoon"),
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hunting Sessions</h1>
        <p className="text-muted-foreground">
          Total Sessions: {huntDetails.sessions.length} | Unique Hunters:{" "}
          {
            new Set(
              huntDetails.sessions.flatMap((session) =>
                session.hunters?.map((hunter) => hunter.fullName)
              )
            ).size
          }{" "}
          | Total Harvests:{" "}
          {huntDetails.sessions.reduce(
            (sum, session) =>
              sum +
              session.hunters!.reduce(
                (sum2, hunter) =>
                  sum2 +
                  hunter.harvests!.reduce(
                    (sum3, harvest) => sum3 + harvest.quantity!,
                    0
                  ),
                0
              ),
            0
          )}
        </p>
      </div>

      <div className="space-y-8">
        <TimeSlotSection
          title="Morning Sessions"
          icon={<Sunrise className="h-6 w-6 text-orange-500" />}
          sessions={sessionsByTimeSlot.morning}
          huntId={huntId}
        />

        <TimeSlotSection
          title="Mid-day Sessions"
          icon={<Sun className="h-6 w-6 text-yellow-500" />}
          sessions={sessionsByTimeSlot.midDay}
          huntId={huntId}
        />

        <TimeSlotSection
          title="Afternoon Sessions"
          icon={<Sunset className="h-6 w-6 text-blue-500" />}
          sessions={sessionsByTimeSlot.afternoon}
          huntId={huntId}
        />
      </div>
    </div>
  );
}
