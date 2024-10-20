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
import { species } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";

export function WaterFlow({
  form,
  field,
  index,
  remove,
  i,
}: {
  form: any;
  field: any;
  index: number;
  remove: (index: number) => void;
  i: number;
}) {
  // const species = useQuery(api.queries.species.getWaterfowlSpecies);

  if (!species) return null;

  return (
    <div key={field.id} className="flex items-end space-x-2 mb-4">
      <FormField
        control={control}
        name={`hunters.${nestIndex}.species.${k}.name`}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Species</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      " justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? species.find((s) => s.name === field.value)?.name
                      : "Select Species"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className=" p-0">
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
                            form.setValue(
                              `waterfowlSpecies.${index}.species`,
                              s.name
                            );
                          }}
                        >
                          {s.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              s.name === field.value
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
            {/* <FormDescription>
            This is the language that will be used in the dashboard.
          </FormDescription> */}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`hunters.${index}species.${i}.count`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Count</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
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
        onClick={() => remove(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function SpeciesFieldArray({
  nestIndex,
  control,
}: {
  nestIndex: number;
  control: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `hunters.${nestIndex}.species`,
  });

  return (
    <div>
      {fields.map((field, k) => (
        <div key={field.id} className="flex items-end space-x-2 mb-4">
          <FormField
            control={control}
            name={`hunters.${nestIndex}.species.${k}.name`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Species</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          " justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? species.find((s) => s.name === field.value)?.name
                          : "Select Species"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
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
                                field.onChange(s.name);

                                // setValue(
                                //   `hunters.${nestIndex}.species.${k}.name`,
                                //   s.name
                                // );
                              }}
                            >
                              {s.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  s.name === field.value
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
                {/* <FormDescription>
            This is the language that will be used in the dashboard.
          </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`hunters.${nestIndex}.species.${k}.count`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="Count"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
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
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ name: "", count: 0 })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Species
      </Button>
    </div>
  );
}
