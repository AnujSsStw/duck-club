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

const BlindSection = ({
  blindInfo,
  huntId,
}: {
  blindInfo: {
    blindName: string;
    harvests: any[];
    hunters: any[];
    totalHarvest: number;
    id: Id<"blindSessions">;
  };
  huntId: string;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-semibold">{blindInfo.blindName}</h2>
        <Link
          href={`/view-hunt/${huntId}?session=${blindInfo.id}`}
          className="text-muted-foreground"
        >
          <LinkIcon />
        </Link>
      </div>
      <BlindCard blindInfo={blindInfo} />
    </div>
  );
};

const BlindCard = ({ blindInfo }: { blindInfo: any }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Hunters & Harvests Summary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{blindInfo.hunters.length} hunters</span>
              </div>
              <div className="flex items-center gap-2">
                <Bird className="h-5 w-5" />
                <span>{blindInfo.totalHarvest} harvests</span>
              </div>
            </div>
            {/* Hunter Details */}
            <div className="space-y-2 mt-2">
              {blindInfo.hunters.map(
                (hunter: any, idx: number) =>
                  hunter && (
                    <div key={idx} className="text-sm bg-muted p-2 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{hunter.fullName}</span>
                        <Badge variant="outline">{hunter.memberShipType}</Badge>
                      </div>
                    </div>
                  )
              )}
            </div>
            {/* Harvests
            <div className="space-y-1">
              {blindInfo.harvests.map(
                (species: any, idx: number) =>
                  species && (
                    <div key={idx} className="text-sm text-muted-foreground">
                      {species.name}
                    </div>
                  )
              )}
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function HuntView({ huntId }: { huntId: Id<"huntingSessions"> }) {
  const huntDetails = useQuery(api.huntsAllData.getHuntDetails2, { huntId });

  if (!huntDetails || !huntDetails.blindHarvests) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl my-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hunting Sessions</h1>
        <p className="text-muted-foreground">
          Total Blinds: {huntDetails.blindHarvests.length} | Total Hunters:{" "}
          {
            new Set(
              huntDetails.blindHarvests.flatMap((blind) =>
                blind.hunters.filter(Boolean).map((hunter) => hunter?._id)
              )
            ).size
          }{" "}
          | Total Harvests:{" "}
          {huntDetails.blindHarvests.reduce(
            (sum, blind) => sum + blind.totalHarvest,
            0
          )}
        </p>
      </div>

      <div className="space-y-8">
        {huntDetails.blindHarvests.map((blindInfo, index) => (
          <BlindSection key={index} blindInfo={blindInfo} huntId={huntId} />
        ))}
      </div>
    </div>
  );
}
