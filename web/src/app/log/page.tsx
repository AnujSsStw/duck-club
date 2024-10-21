"use client";

import MapComp from "@/components/map/map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarForm } from "@/app/log/date-picker";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";

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

    router.push(`/log/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto m-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col justify-center"
        >
          <Card>
            <CardHeader>
              <CardTitle>Hunt Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <MapComp form={form} />

              <div className="flex space-x-4">
                <div className="flex-1">
                  <CalendarForm form={form} label="Date" name="date" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Button type="submit">Create Hunt</Button>
        </form>
      </Form>
    </div>
  );
};

export default LogHunt;
