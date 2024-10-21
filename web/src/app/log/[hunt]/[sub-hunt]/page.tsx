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
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HunterSelect } from "./hunter-select";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const FormSchema = z.object({
  pictures: z.instanceof(FileList).optional(),
  hunters: z
    .array(
      z.object({
        name: z.string(),
        email: z.string(),
        hunterID: z.string(),

        blinds: z.object({
          name: z.string().min(1, "Name is required"),
        }),

        species: z.array(
          z.object({
            name: z.string().min(1, "Species is required"),
            count: z.number().min(1, "Count must be at least 1"),
            id: z.string(),
          })
        ),
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
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Sub hunt data submitted:", data);
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

    await insertSubHunt({
      pictures: successfulImageIds,
      huntId: p[2] as Id<"hunts">,
      subHuntId: p[3] as Id<"subHunts">,
      hunters: data.hunters.map((hunter) => ({
        hunterID: hunter.hunterID as Id<"hunters">,
        species: hunter.species.map((species) => ({
          id: species.id as Id<"waterfowlSpecies">,
          count: species.count,
        })),
        blinds: hunter.blinds,
      })),
    });

    router.push(`/log/${p[2]}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Log New Hunt</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hunters</CardTitle>
            </CardHeader>
            <CardContent>
              {/* @ts-ignore */}
              <HunterSelect form={form} />
            </CardContent>
          </Card>

          {/* <DropZone /> */}

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

          <Button type="submit" className="w-full">
            Log Hunt
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SubHunt;
