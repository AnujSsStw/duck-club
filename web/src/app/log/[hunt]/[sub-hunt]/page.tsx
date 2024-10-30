"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HunterSelect } from "./hunter-select";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useState } from "react";
import { Spinner } from "@/components/spinner";
import { Loading } from "@/components/loading";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  note: z.string().optional(),
  pictures: z.instanceof(FileList).optional(),
  hunters: z
    .array(
      z.object({
        hunterID: z.string(),

        blinds: z.object({
          name: z.string().min(1, "Blind is required"),
        }),

        species: z.array(
          z.object({
            count: z.number().min(1, "Count must be at least 1"),
            id: z.string().min(1, "Species is required"),
          })
        ), // enable to log even if no species are selected
      })
    )
    .min(1, "At least one hunter is required"),
});

const SubHunt = () => {
  const pathname = usePathname();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      hunters: [],
      pictures: undefined,
    },
  });
  const generateUploadUrl = useMutation(api.upload_things.generateUploadUrl);
  const insertSubHunt = useMutation(api.subHunts.insertSubHunt);

  // noSql_hunt inplementation
  const addHuntSession = useMutation(api.huntsAllData.addHuntSession);
  const getHuntLocation = useQuery(api.huntsAllData.getHuntLocation, {
    huntId: pathname.split("/")[2] as Id<"huntsAllData">,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (!getHuntLocation) return <Loading />;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Sub hunt data submitted:", data);
    setLoading(true);
    const p = pathname.split("/");

    // return;
    let successfulImageIds;
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
      successfulImageIds = imageIds.filter((id) => id !== null);
    }

    const weatherData = "";
    await addHuntSession({
      huntId: p[2] as Id<"huntsAllData">,
      timeSlot: p[3] as "morning" | "mid-day" | "afternoon",
      pictures: successfulImageIds,
      hunters: data.hunters.map((hunter) => ({
        hunterID: hunter.hunterID as Id<"hunters">,
        species: hunter.species.map((species) => ({
          id: species.id as Id<"waterfowlSpecies">,
          count: species.count,
        })),
        blinds: hunter.blinds,
      })),
      weather: weatherData,
      note: data.note,
    });
    // await insertSubHunt({
    //   pictures: successfulImageIds,
    //   huntId: p[2] as Id<"hunts">,
    //   subHuntId: p[3] as Id<"subHunts">,
    //   hunters: data.hunters.map((hunter) => ({
    //     hunterID: hunter.hunterID as Id<"hunters">,
    //     species: hunter.species.map((species) => ({
    //       id: species.id as Id<"waterfowlSpecies">,
    //       count: species.count,
    //     })),
    //     blinds: hunter.blinds,
    //   })),
    // });
    setLoading(false);

    router.push(`/log/${p[2]}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 sm:mb-6">Log New Hunt</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          {/* @ts-ignore */}
          <HunterSelect form={form} />

          {/* Pictures */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Pictures</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="pictures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Pictures</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          id="pictures"
                          accept="image/*"
                          multiple
                          onChange={(e) => field.onChange(e.target.files)}
                          className="h-auto file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        />
                        <Button
                          className="py-4"
                          type="button"
                          variant="outline"
                          onClick={() => {
                            field.onChange(undefined);
                            // Reset the file input
                            const fileInput = document.getElementById(
                              "pictures"
                            ) as HTMLInputElement;
                            if (fileInput) fileInput.value = "";
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add any additional notes about the hunt.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button disabled={loading} type="submit" className="w-full">
            {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            Log Hunt
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SubHunt;
