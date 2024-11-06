"use client";

import MapComp from "@/components/map/map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { History, MapPin } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarForm } from "../log/date-picker";
import { BlindSessions } from "./BlindSessions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { uploadImages } from "./upload-images";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { HuntFormSchema, HuntFormValues } from "./hunt-form-schema";

const RecentLocations = ({
  recentLocations,
  selectLocation,
}: {
  recentLocations: Doc<"huntLocations">[];
  selectLocation: (location: Doc<"huntLocations">) => void;
}) => (
  <div className="w-64 space-y-2">
    {recentLocations.map((location) => (
      <button
        key={location._id}
        onClick={() => selectLocation(location)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-gray-700 rounded-md"
      >
        <span>{location.description}</span>
        <span className="text-gray-500 text-xs">
          {new Date(location._creationTime).toLocaleDateString()}
        </span>
      </button>
    ))}
  </div>
);

const HuntEntryForm = () => {
  const form = useForm<HuntFormValues>({
    resolver: zodResolver(HuntFormSchema),
    defaultValues: {
      blindSessions: [],
      date: undefined,
      location: { lat: 0, lng: 0 },
      timeSlot: undefined,
    },
  });
  const [loading, setLoading] = useState(false);
  const generateUploadUrl = useMutation(api.upload_things.generateUploadUrl);
  const user = useQuery(api.users.current);
  const insertHuntingSession = useAction(api.q.i);
  const recentLocations = useQuery(api.utils.getUserRecentLocations, {
    hunterId: user?._id,
  });
  const [locationId, setLocationId] = useState<Id<"huntLocations"> | undefined>(
    undefined
  );

  const router = useRouter();

  const selectLocation = (location: Doc<"huntLocations">) => {
    form.setValue("location", {
      lat: location.latitude,
      lng: location.longitude,
    });
    setLocationName(location.description);
    setLocationId(location._id);
  };

  const handleSubmit = async () => {
    console.log("Form data:", form.getValues());
    if (!user) {
      alert("Please login to save your hunt");
      return;
    }
    setLoading(true);

    // loop through the blind sessions and upload the images and get the ids
    for (const blindSession of form.getValues().blindSessions) {
      const successfulImageIds = await uploadImages(
        { pictures: blindSession.pictures },
        generateUploadUrl
      );
      blindSession.pictures = successfulImageIds as any;
    }

    try {
      const res = await insertHuntingSession({
        createdBy: user?._id,
        huntingSession: {
          date: form.getValues().date.toISOString(),
          location: form.getValues().location,
          timeSlot: form.getValues().timeSlot as any,
          blindSessions: form.getValues().blindSessions.map((blindSession) => ({
            blindId: blindSession.blindId,
            huntersPresent: blindSession.huntersPresent.map(
              (hunter) => hunter.hunterID as Id<"hunters">
            ),
            harvests: blindSession.harvests.map((harvest) => ({
              speciesId: harvest.speciesId as Id<"waterfowlSpecies">,
              quantity: harvest.quantity,
            })),
            notes: blindSession.notes,
            pictures: blindSession.pictures as any,
          })),
        },
        locationId: locationId,
      });

      setLoading(false);
      if (res) {
        router.push(`/`);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [locationName, setLocationName] = useState("");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-4xl mx-auto space-y-8 p-4"
      >
        {/* Main hunt details */}
        <Card>
          <CardHeader>
            <CardTitle>Hunt Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location Selection */}
            <FormField
              control={form.control}
              name="location"
              rules={{ required: "Location is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-700"
                          >
                            <MapPin className="h-4 w-4" />
                            {locationName || "Select on Map"}
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Select Location</DialogTitle>
                          </DialogHeader>
                          <MapComp
                            form={form}
                            setLocationName={setLocationName}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Recent Locations */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-700"
                          >
                            <History className="h-4 w-4" />
                            Recent
                          </button>
                        </PopoverTrigger>
                        <PopoverContent>
                          {recentLocations && (
                            <RecentLocations
                              recentLocations={recentLocations}
                              selectLocation={selectLocation}
                            />
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Selection */}

            <CalendarForm form={form} label="Date" name="date" />

            {/* Time Slot Selection */}
            <FormField
              control={form.control}
              name="timeSlot"
              render={({ field }) => (
                <FormItem className="text-white">
                  <FormLabel>Time Slot</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="mid-day">Mid-day</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Blind Sessions */}

        <BlindSessions
          form={form}
          Rlocation={recentLocations?.find(
            (location) =>
              location.latitude === form.getValues("location.lat") &&
              location.longitude === form.getValues("location.lng")
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Hunt"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HuntEntryForm;
