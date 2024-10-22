import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

// This is an example of the classic "Place Autocomplete" widget.
// https://developers.google.com/maps/documentation/javascript/place-autocomplete
export const PlaceAutocompleteClassic = ({ onPlaceSelect }: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");
  const map = useMap();

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    if (!map) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
      const location = placeAutocomplete.getPlace().geometry?.location;
      if (location) {
        map.setCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
        map.setZoom(15);
      }
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container ">
      <input ref={inputRef} className="text-black  p-2" />
    </div>
  );
};
