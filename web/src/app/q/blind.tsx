import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { blinds } from "@/lib/constants";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { HuntFormValues } from "./hunt-form-schema";
import { Doc } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import MapComp from "@/components/map/map";
import { Badge } from "@/components/ui/badge";

export function Blind({
  form,
  nestIndex: index,
  Rlocation,
}: {
  form: UseFormReturn<HuntFormValues>;
  nestIndex: number;
  Rlocation: Doc<"huntLocations"> | undefined;
}) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const recentBlinds = useQuery(api.blinds.getRecentBlinds, {
    locationId: Rlocation?._id,
  });
  const [location, setLocation] = useState();

  useEffect(() => {}, [location]);

  return (
    <div>
      {/* Blind Selection Tabs */}
      <Tabs defaultValue="existing">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="existing">Existing Blind</TabsTrigger>
          <TabsTrigger value="custom">Custom Blind</TabsTrigger>
          <TabsTrigger disabled={!recentBlinds?.length} value="recent">
            Recent
          </TabsTrigger>
        </TabsList>

        {/* Existing Blind Selection */}
        <TabsContent value="existing">
          <FormField
            control={form.control}
            name={`blindSessions.${index}.blindId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blind</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    form.setValue(`blindSessions.${index}.blindId`, value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select blind" />
                  </SelectTrigger>
                  <SelectContent>
                    {blinds.map((blind) => (
                      <SelectItem key={blind.name} value={blind.name}>
                        {blind.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        {/* Custom Blind Input */}
        <TabsContent value="custom">
          <FormField
            control={form.control}
            name={`blindSessions.${index}.blindId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Blind Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter custom blind name"
                    value={field.value}
                    onChange={(e) =>
                      form.setValue(
                        `blindSessions.${index}.blindId`,
                        e.target.value
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
            <DialogTrigger asChild>
              <Button className="mt-2" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Select on Map (optional)
              </Button>
            </DialogTrigger>
            <div> {location && `Selected location: ${location}`}</div>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Select Blind Location</DialogTitle>
              </DialogHeader>
              <MapComp
                form={form}
                setLocationName={setLocation}
                isLocationRequired={false}
              />
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Recent Blinds */}
        <TabsContent value="recent">
          <FormField
            control={form.control}
            name={`blindSessions.${index}.blindId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recent Blinds</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    form.setValue(`blindSessions.${index}.blindId`, value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select recent blind" />
                  </SelectTrigger>
                  <SelectContent>
                    {recentBlinds?.map((blind) => (
                      <SelectItem key={blind._id} value={blind.name}>
                        {blind.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
