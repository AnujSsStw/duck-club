"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  Marker,
} from "@vis.gl/react-google-maps";
import React from "react";
import { CurrentLocation } from "./current-location";
import { PlaceAutocompleteClassic } from "./search-place";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export default function MapComp({ form }: { form?: any }) {
  const [userLocation, setUserLocation] = React.useState({ lat: 0, lng: 0 });

  return (
    <APIProvider apiKey={API_KEY}>
      {form && (
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select location</FormLabel>
              <FormControl>
                <>
                  <Map
                    style={{ width: "auto", height: "auto" }}
                    className="w-full h-96"
                    defaultCenter={{ lat: 22.54992, lng: 0 }}
                    defaultZoom={3}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                    onClick={(e) => {
                      if (e.detail.latLng) {
                        field.onChange(e.detail.latLng);
                        setUserLocation(e.detail.latLng);
                      }
                    }}
                  />
                  {/* <AdvancedMarker position={userLocation} /> */}
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {userLocation.lat !== 0 && userLocation.lng !== 0 && (
        <Marker position={userLocation} />
      )}
      {/* <InputMarker p={userLocation} /> */}
      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control mt-4">
          <PlaceAutocompleteClassic
            onPlaceSelect={(place) => {
              console.log("place", place);
              // setUserMarker({
              //   lat: place?.geometry?.location?.lat(),
              //   lng: place?.geometry?.location?.lng(),
              // });
            }}
          />
        </div>
      </MapControl>

      <MapControl position={ControlPosition.RIGHT_BOTTOM}>
        <CurrentLocation />
      </MapControl>
    </APIProvider>
  );
}
