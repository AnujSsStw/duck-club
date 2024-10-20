"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { blinds } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export function BlindsManager({
  form,
  field,
  index,
  remove,
}: {
  form: any;
  field: any;
  index: number;
  remove: (index: number) => void;
}) {
  return (
    <>
      <div key={field.id} className="flex items-end space-x-2 mb-4">
        <FormField
          control={form.control}
          name={`blinds.${index}.name`}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Blinds</FormLabel>
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
                        ? blinds.find((s) => s.name === field.value)?.name
                        : "Select Blinds"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className=" p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Blinds..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No Blinds found.</CommandEmpty>
                      <CommandGroup>
                        {blinds.map((s) => (
                          <CommandItem
                            value={s.name}
                            key={s.name}
                            onSelect={() => {
                              form.setValue(`blinds.${index}.name`, s.name);
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

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => remove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
