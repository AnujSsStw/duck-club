"use client";

import { CalendarForm } from "@/app/log/date-picker";
import { Loading } from "@/components/loading";
import MapComp from "@/components/map/map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../convex/_generated/api";

const FormSchema = z.object({
  date: z.date({ required_error: "Start date is required" }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

const LogHunt = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: undefined,
      location: { lat: 0, lng: 0 },
    },
  });
  const insertHunt = useAction(api.hunts.addHunt);
  const user = useQuery(api.users.current);
  const router = useRouter();

  if (!user) {
    return <Loading />;
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const id = await insertHunt({
      creatorID: user._id,
      date: data.date.toISOString(),
      location: data.location,
    });

    router.push(`/log/${id.noSql_huntsId}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Hunt Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="aspect-w-16 aspect-h-9 sm:aspect-h-7">
                <MapComp form={form} />
              </div>

              <div className="sm:flex sm:space-x-4">
                <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                  <CalendarForm form={form} label="Date" name="date" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" className="w-full sm:w-auto">Create Hunt</Button>
        </form>
      </Form>
    </div>
  );
};

export default LogHunt;
