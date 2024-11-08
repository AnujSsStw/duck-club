"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HuntFormValues } from "@/app/q/hunt-form-schema";
import { Loading } from "@/components/loading";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { api } from "../../../convex/_generated/api";

export function HarvestSpeciesPicker({
  nestIndex,
  form,
}: {
  form: UseFormReturn<HuntFormValues>;
  nestIndex: number;
}) {
  const species = useQuery(api.species.getWaterfowlSpecies);

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: `blindSessions.${nestIndex}.harvests`,
  });

  if (!species) return <Loading />;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Harvests</label>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={() =>
            append({ speciesId: "", quantity: 1 }, { shouldFocus: true })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Species
        </Button>
      </div>

      {fields.map((field, k) => (
        <div key={field.id} className="flex flex-row items-center gap-2">
          <FormField
            control={form.control}
            name={`blindSessions.${nestIndex}.harvests.${k}.speciesId`}
            render={({ field }) => (
              <FormItem className="w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground",
                          "truncate",
                          "w-48 sm:w-full"
                        )}
                      >
                        {field.value
                          ? species.find((s) => s._id === field.value)?.name
                          : "Select Species"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search Species..."
                        className="h-9 focus:ring-0"
                      />
                      <CommandList>
                        <CommandEmpty>No Species found.</CommandEmpty>
                        <CommandGroup>
                          {species.map((s) => (
                            <CommandItem
                              value={s.name}
                              key={s._id}
                              onSelect={() => {
                                update(k, {
                                  speciesId: s._id,
                                  quantity: fields[k].quantity,
                                });
                              }}
                            >
                              {s.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  s._id === field.value
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
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <FormField
              control={form.control}
              name={`blindSessions.${nestIndex}.harvests.${k}.quantity`}
              render={({ field }) => (
                <FormItem className="flex-grow sm:flex-grow-0">
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Count"
                      className="w-full sm:w-20"
                      min={0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        field.onChange(Math.min(Math.max(value, 0), 10));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(k)}
              className="flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" color="red" />
              <span className="sr-only">Remove species</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
