"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Search, UserPlus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlindsManager } from "./blinds-picker";
import { SpeciesFieldArray } from "./waterfowlSpecies-picker";

import { GuestHunter } from "./guest-hunter";


type Hunter = {
  _id: Id<"hunters">;
  email: string;
  fullName: string;
  pictureUrl: string;
  memberShipType: "guest" | "member";
};

const fetchUsers = async (query: string): Promise<Array<Hunter>> => {
  // TODO: remove this and add auth headers
  const users = await fetch(
    `https://gallant-ant-192.convex.site/get-user/${query}`
  );
  const data: Hunter[] = await users.json();

  return data;
};

export function HunterSelect({
  form,
}: {
  form: UseFormReturn<
    {
      hunters: {
        hunterID: string;
        blinds: {
          name: string;
        };
        species: {
          id: string;
          count: number;
        }[];
      }[];
    },
    any,
    undefined
  >;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<Array<Hunter>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fields, append, remove, prepend, insert } = useFieldArray({
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
      setSearchResults(results.map((user) => ({ ...user })));
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

  const handleAddUser = (user: Hunter) => {
    if (!fields.some((field) => field.hunterID === user._id)) {
      prepend({
        hunterID: user._id,
        blinds: { name: "" },
        species: [],
      });

      // Clear search term after adding user
      setSearchTerm("");
    }
  };

  const handleRemoveUser = (index: number) => {
    remove(index);
  };

  return (
    <div className="">
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

      {/* add a or seprator */}
      <div className="flex items-center justify-center">
        <div className="w-1/2 h-px bg-gray-200"></div>
        <p className="px-4 text-gray-500">or</p>
        <div className="w-1/2 h-px bg-gray-200"></div>
      </div>

      {!isLoading && !error && searchResults.length === 0 && (
        // create a new hunter
        <GuestHunter />
      )}

      {!isLoading && !error && searchResults.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Search Results</h2>
          <ul className="space-y-2">
            {searchResults.map((user) => (
              <li
                key={user._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-white p-3 rounded-lg shadow"
              >
                <div className="flex items-center mb-2 sm:mb-0">
                  <Avatar className="mr-2 flex-shrink-0">
                    <AvatarImage src={user.pictureUrl} />
                    <AvatarFallback>Pic</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{user.fullName}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleAddUser(user)}
                  disabled={fields.some((field) => field.hunterID === user._id)}
                  className="w-full sm:w-auto mt-2 sm:mt-0"
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
              <Card key={field.id} className="pt-4">
                <CardContent>
                  {/* basic details */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2 items-center">
                      <Avatar>
                        <AvatarImage src={searchResults.find(user => user._id === field.hunterID)?.pictureUrl} />
                        <AvatarFallback>Pic</AvatarFallback>
                      </Avatar>
                      <span>
                        <p className="font-medium">
                          {searchResults.find(user => user._id === field.hunterID)?.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchResults.find(user => user._id === field.hunterID)?.email}
                        </p>
                      </span>
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
                    <SpeciesFieldArray
                      nestIndex={index}
                      control={form.control}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
