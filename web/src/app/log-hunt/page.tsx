"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useMutation } from "convex/react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { BlindsManager } from "./blinds-picker";
import { CalendarForm } from "./date-picker";
import MultiSelectSearch from "./hunter-select";
import { WaterFlow } from "./waterfowlSpecies-picker";

const FormSchema = z.object({
  date: z.date({ required_error: "Start date is required" }),
  timeSlot: z.string().min(1, "Time slot is required"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),

  hunterIDs: z.array(z.string()).min(1, "At least one hunter is required"),
  blindUsed: z.string().min(1, "Blind used is required"),
  pictures: z.instanceof(FileList).optional(),
  waterfowlSpecies: z
    .array(
      z.object({
        species: z.string().min(1, "Species is required"),
        count: z.number().min(1, "Count must be at least 1"),
      })
    )
    .min(1, "At least one species must be added"),
  blinds: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        alternativeName: z.string().optional(),
      })
    )
    .min(1, "At least one blind must be added"),
});

export default function LogHunt() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startDate: undefined,
      hunterIDs: [],
      pictures: undefined,
      location: { lat: 0, lng: 0 },
      waterfowlSpecies: [],
      blinds: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "waterfowlSpecies",
  });

  const {
    fields: blindFields,
    append: appendBlind,
    remove: removeBlind,
  } = useFieldArray({
    control: form.control,
    name: "blinds",
  });

  const generateUploadUrl = useMutation(api.hunts.generateUploadUrl);
  const logHunt = useAction(api.hunts.logHunt);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Hunt data submitted:", data.pictures);
    // Here you would typically send the data to your backend
    return;

    if (data.pictures !== undefined) {
      const imageIds = await Promise.all(
        Array.from(data.pictures).map(async (selectedImage) => {
          try {
            const postUrl = await generateUploadUrl();

            const result = await fetch(postUrl, {
              method: "POST",
              headers: { "Content-Type": selectedImage.type },
              body: selectedImage,
            });

            if (!result.ok) {
              throw new Error(`Failed to upload file: ${selectedImage.name}`);
            }

            const { storageId } = await result.json();
            return storageId; // Return the storage ID to collect it
          } catch (error) {
            console.error(`Error uploading ${selectedImage.name}:`, error);
            return null; // Optionally return null or handle the error
          }
        })
      );

      // Filter out any null values (in case of errors)
      const successfulImageIds = imageIds.filter((id) => id !== null);

      await logHunt({
        endDate: data.endDate.toISOString(),
        startDate: data.startDate.toISOString(),
        hunterIDs: ["jd75pztjmkk7pqyg1wmwf04jcs72ydcj" as Id<"hunters">],
        pictures: successfulImageIds,
        huntLoaction: data.location,
      });
    } else {
      await logHunt({
        endDate: data.endDate.toISOString(),
        startDate: data.startDate.toISOString(),
        hunterIDs: ["jd75pztjmkk7pqyg1wmwf04jcs72ydcj" as Id<"hunters">],
        huntLoaction: data.location,
      });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Log New Hunt</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hunt Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <MapComp form={form} /> */}

              <div className="flex space-x-4">
                <div className="flex-1">
                  <CalendarForm form={form} label="Starting" name="startDate" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hunters</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiSelectSearch />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pictures</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="pictures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Pictures</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        id="pictures"
                        accept="image/*"
                        multiple
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Species</CardTitle>
            </CardHeader>
            <CardContent>
              {fields.map((field, index) => (
                <WaterFlow
                  field={field}
                  index={index}
                  remove={remove}
                  form={form}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ species: "", count: 1 })}
              >
                Add Species
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blinds used</CardTitle>
            </CardHeader>
            <CardContent>
              {blindFields.map((field, index) => (
                <BlindsManager
                  field={field}
                  index={index}
                  remove={removeBlind}
                  form={form}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendBlind({ name: "", latitude: 0, longitude: 0 })
                }
              >
                Add Blinds
              </Button>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Log Hunt
          </Button>
        </form>
      </Form>
    </div>
  );
}
