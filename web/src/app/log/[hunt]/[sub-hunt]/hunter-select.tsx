"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, UserPlus, X } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { species } from "@/lib/constants";
import { BlindsManager } from "@/app/log-hunt/blinds-picker";
import {
  SpeciesFieldArray,
  WaterFlow,
} from "@/app/log-hunt/waterfowlSpecies-picker";

// Simulated API call
const fetchUsers = async (
  query: string
): Promise<Array<{ id: number; name: string; email: string }>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulated user data
  const allUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com" },
    { id: 4, name: "David Lee", email: "david@example.com" },
    { id: 5, name: "Emma Wilson", email: "emma@example.com" },
  ];

  // Filter users based on the query
  return allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
  );
};

export function HunterSelect({
  form,
}: {
  form: UseFormReturn<
    {
      hunters: {
        hunterID: string;
        name: string;
        email: string;
        species: {
          name: string;
          count: number;
        }[];
        blinds: {
          name: string;
        };
      }[];
    },
    any,
    undefined
  >;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "hunters",
  });

  const performSearch = useCallback(async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const results = await fetchUsers(query);
      setSearchResults(
        results.map((user) => ({ ...user, id: user.id.toString() }))
      );
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  const handleAddUser = (user: { id: string; name: string; email: string }) => {
    if (!fields.some((field) => field.hunterID === user.id)) {
      append({
        email: user.email,
        name: user.name,
        blinds: { name: "" },
        species: [{ name: "", count: 0 }],
        hunterID: user.id,
      });
    }
  };

  const handleRemoveUser = (index: number) => {
    remove(index);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
            aria-label="Search users"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-4" role="alert">
          {error}
        </div>
      )}

      {!isLoading && !error && searchResults.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Search Results</h2>
          <ul className="space-y-2">
            {searchResults.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between border-white  p-3 rounded-lg shadow"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Button
                  onClick={() => handleAddUser(user)}
                  disabled={fields.some((field) => field.hunterID === user.id)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-2">Selected Users</h2>
        {fields.length === 0 ? (
          <p className="text-gray-500">No users selected</p>
        ) : (
          <ul className="space-y-4 ">
            {fields.map((field, index) => (
              <li
                key={field.id}
                className="border-white border  my-4 flex flex-col p-3 rounded-lg shadow"
              >
                {/* basic details */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <FormField
                      control={form.control}
                      name={`hunters.${index}.name`}
                      render={({ field }) => (
                        <p className="font-medium">{field.value}</p>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`hunters.${index}.email`}
                      render={({ field }) => (
                        <p className="text-sm text-gray-500">{field.value}</p>
                      )}
                    />
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveUser(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove user</span>
                  </Button>
                </div>

                {/* blinds */}
                <div>
                  <BlindsManager
                    field={field}
                    index={index}
                    remove={remove}
                    form={form}
                  />
                </div>

                {/* species */}
                <div>
                  <SpeciesFieldArray nestIndex={index} control={form.control} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
