"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HunterSelect } from "./hunter-select";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  hunters: z.array(
    z.object({
      name: z.string(),
      email: z.string(),

      blinds: z.object({
        name: z.string(),
      }),

      species: z.array(
        z.object({
          name: z.string(),
          count: z.number(),
        })
      ),
    })
  ),
});

const SubHunt = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      hunters: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Sub hunt data submitted:", data);
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
              <HunterSelect form={form} />
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
