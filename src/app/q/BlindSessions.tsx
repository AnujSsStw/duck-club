"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { HunterSelect } from "./hunter-select";
import { HarvestSpeciesPicker } from "./waterfowlSpecies-picker";
import { Blind } from "./blind";
import { HuntFormValues } from "./hunt-form-schema";
import { UseFormReturn, useFieldArray } from "react-hook-form";

export function BlindSessions({
  form,
  Rlocation,
}: {
  form: UseFormReturn<HuntFormValues>;
  Rlocation: any;
}) {
  const { fields, append, remove, prepend, insert } = useFieldArray({
    control: form.control,
    name: "blindSessions",
  });

  function addBlindSession() {
    prepend({ blindId: undefined as any, huntersPresent: [], harvests: [] });
  }

  return (
    <div>
      <div className="flex justify-between items-center space-y-4">
        <h2 className="text-lg font-semibold">Blind Sessions</h2>
        <Button
          type="button"
          onClick={addBlindSession}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Add Blind
        </Button>
      </div>

      {fields.map((field, index) => (
        <Card key={field.id} className="relative my-4">
          <Button
            type="button"
            onClick={() => remove(index)}
            className="absolute right-4 top-4 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-5 w-5" />
          </Button>

          <CardHeader>
            <CardTitle>Blind Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Blind */}
            <Blind form={form} nestIndex={index} Rlocation={Rlocation} />

            {/* Multiple Hunters Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hunters Present</label>
              <HunterSelect form={form} nestIndex={index} />
            </div>

            {/* Harvests */}
            <HarvestSpeciesPicker form={form} nestIndex={index} />

            {/* Notes */}
            <FormField
              control={form.control}
              name={`blindSessions.${index}.notes`}
              render={({ field }) => (
                <div className="space-y-2">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <textarea
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-black/5"
                      rows={3}
                    />
                  </FormControl>
                </div>
              )}
            />

            {/* Picture Upload */}
            <FormField
              control={form.control}
              name={`blindSessions.${index}.pictures`}
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
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
