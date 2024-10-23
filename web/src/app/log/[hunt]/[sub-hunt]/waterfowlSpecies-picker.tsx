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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { species } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";
import { useQuery } from "convex/react";
import { Loading } from "@/components/loading";
import { api } from "../../../../../convex/_generated/api";

export function SpeciesFieldArray({
  nestIndex,
  control,
}: {
  nestIndex: number;
  control: Control<
    {
      hunters: {
        hunterID: string;
        species: {
          count: number;
          id: string;
        }[];
        blinds: {
          name: string;
        };
      }[];
    },
    any
  >;
}) {
  const species = useQuery(api.queries.species.getWaterfowlSpecies);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `hunters.${nestIndex}.species`,
  });

  if (!species) return <Loading />;
  return (
    <div className="space-y-4">
      {fields.map((field, k) => (
        <div key={field.id} className="flex flex-row items-center gap-2">
          <FormField
            control={control}
            name={`hunters.${nestIndex}.species.${k}.id`}
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
                        className="h-9"
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
                                  count: fields[k].count,
                                  id: s._id,
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
              control={control}
              name={`hunters.${nestIndex}.species.${k}.count`}
              render={({ field }) => (
                <FormItem className="flex-grow sm:flex-grow-0">
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Count"
                      className="w-full sm:w-20"
                      min={1}
                      max={10}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        field.onChange(Math.min(Math.max(value, 1), 10));
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

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        onClick={() => append({ id: "", count: 1 })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Species
      </Button>
    </div>
  );
}
