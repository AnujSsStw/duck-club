"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Bird,
  CloudSun,
  Sun,
  Sunrise,
  Sunset,
  Trash2,
  Users,
} from "lucide-react";
import React from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { species } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { getHuntSessionDetails } from "../../../../convex/q";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export const SessionEdit = ({
  huntId,
  huntDetails,
}: {
  huntId: Id<"huntingSessions">;
  huntDetails: UnwrapPromise<ReturnType<typeof getHuntSessionDetails>>;
}) => {
  const [sessions, setSessions] = React.useState(huntDetails.blindSessions);
  const [activeTimeSlot, setActiveTimeSlot] = React.useState(
    huntDetails.sessions?.[0]?.timeSlot
  );
  const [activeSessionId, setActiveSessionId] = React.useState(
    huntDetails.sessions?.[0]?.timeSlot
  );
  const [openPopovers, setOpenPopovers] = React.useState<{
    [key: string]: boolean;
  }>({});
  const updatorFunction = useMutation(api.huntsAllData.updateHuntSession);

  const activeSession = React.useMemo(
    () => sessions?.find((s: any) => s.timeSlot === activeSessionId),
    [sessions, activeSessionId]
  );

  const updateSession = (sessionId: string, updates: any) => {
    setSessions(
      sessions?.map((session: any) =>
        session.timeSlot === sessionId ? { ...session, ...updates } : session
      )
    );
  };

  const updateHunterHarvest = (
    sessionId: string,
    hunterIndex: number,
    harvestIndex: number,
    field: string,
    value: any
  ) => {
    setSessions(
      sessions?.map((session: any) => {
        if (session.timeSlot !== sessionId) return session;

        const newSession = { ...session };
        newSession.hunters[hunterIndex].harvests[harvestIndex][field] = value;
        return newSession;
      })
    );
  };

  const getTimeSlotIcon = (timeSlot: string) => {
    switch (timeSlot) {
      case "morning":
        return <Sunrise className="h-4 w-4" />;
      case "mid-day":
        return <Sun className="h-4 w-4" />;
      case "afternoon":
        return <Sunset className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const togglePopover = (hunterIndex: number, harvestIndex: number) => {
    const key = `${hunterIndex}-${harvestIndex}`;
    setOpenPopovers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Hunting Sessions</h1>
        <div className="space-x-2">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={async () => {
              await updatorFunction({
                huntId: huntId,
                sessionId: activeSessionId!,
                sessions: sessions,
              });
            }}
          >
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Time Slot Filter */}
      <Tabs
        value={activeTimeSlot}
        onValueChange={(value) => {
          const timeSlot = value as "morning" | "mid-day" | "afternoon";
          setActiveTimeSlot(timeSlot);
          setActiveSessionId(timeSlot);
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          {huntDetails.blindSessions.map((v) => (
            <TabsTrigger
              key={v._id}
              value={v.blindName}
              disabled={!sessions?.some((s: any) => s.timeSlot === "morning")}
            >
              {/* {getTimeSlotIcon(timeSlot)} {timeSlot} */}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {activeSession && (
        <form className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"></div>

              <div className="space-y-2">
                <Label htmlFor="note">Notes</Label>
                <Textarea
                  id="note"
                  value={activeSession.note}
                  onChange={(e) =>
                    updateSession(activeSession.timeSlot!, {
                      note: e.target.value,
                    })
                  }
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Weather */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudSun className="h-6 w-6" />
                Weather Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={activeSession.weather.temperatureC}
                  onChange={(e) =>
                    updateSession(activeSession.timeSlot!, {
                      weather: {
                        ...activeSession.weather,
                        temperatureC: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="windSpeed">Wind Speed (km/h)</Label>
                <Input
                  id="windSpeed"
                  type="number"
                  value={activeSession.weather.windSpeed}
                  onChange={(e) =>
                    updateSession(activeSession.timeSlot!, {
                      weather: {
                        ...activeSession.weather,
                        windSpeed: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="windDirection">Wind Direction</Label>
                <Input
                  id="windDirection"
                  value={activeSession.weather.windDirection}
                  onChange={(e) =>
                    updateSession(activeSession.timeSlot!, {
                      weather: {
                        ...activeSession.weather,
                        windDirection: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Hunters */}
          {activeSession.hunters?.map((hunter, hunterIndex) => (
            <Card key={hunter.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    {hunter.fullName}
                    <Badge>{hunter.memberShipType}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Bird className="h-4 w-4" />
                      Harvests
                    </h4>
                    {hunter.harvests?.map((harvest, harvestIndex) => (
                      <div
                        key={harvest.speciesId}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end"
                      >
                        <div className="space-y-2">
                          <Label>Species</Label>
                          <Popover
                            open={
                              openPopovers[`${hunterIndex}-${harvestIndex}`]
                            }
                            onOpenChange={() =>
                              togglePopover(hunterIndex, harvestIndex)
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={
                                  openPopovers[`${hunterIndex}-${harvestIndex}`]
                                }
                                className="w-[200px] justify-between truncate"
                              >
                                {harvest.speciesId
                                  ? species.find(
                                      (species) =>
                                        species._id === harvest.speciesId
                                    )?.name
                                  : "Select species..."}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search species..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No species found.</CommandEmpty>
                                  <CommandGroup>
                                    {species.map((species) => (
                                      <CommandItem
                                        key={species._id}
                                        value={species._id}
                                        onSelect={(currentValue) => {
                                          setOpenPopovers((prev) => ({
                                            ...prev,
                                            [`${hunterIndex}-${harvestIndex}`]:
                                              false,
                                          }));
                                          updateHunterHarvest(
                                            activeSession.timeSlot!,
                                            hunterIndex,
                                            harvestIndex,
                                            "speciesId",
                                            currentValue
                                          );
                                          updateHunterHarvest(
                                            activeSession.timeSlot!,
                                            hunterIndex,
                                            harvestIndex,
                                            "speciesName",
                                            species.name
                                          );
                                        }}
                                      >
                                        {species.name}
                                        <CheckIcon
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            harvest.speciesId === species._id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={harvest.quantity}
                            onChange={(e) =>
                              updateHunterHarvest(
                                activeSession.timeSlot!,
                                hunterIndex,
                                harvestIndex,
                                "quantity",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          type="button"
                          onClick={() => {
                            const newSession = { ...activeSession };
                            newSession.hunters?.[hunterIndex].harvests?.splice(
                              harvestIndex,
                              1
                            );
                            updateSession(activeSession.timeSlot!, newSession);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newSession = { ...activeSession };
                        newSession.hunters?.[hunterIndex].harvests?.push({
                          speciesId: undefined,
                          speciesName: "",
                          quantity: 0,
                        });
                        updateSession(activeSession.timeSlot!, newSession);
                      }}
                    >
                      Add Harvest
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </form>
      )}
    </div>
  );
};
