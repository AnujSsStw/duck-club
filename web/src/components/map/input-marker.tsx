import React, { useState } from "react";
import {
  AdvancedMarker,
  InfoWindow,
  Marker,
  useAdvancedMarkerRef,
  useMarkerRef,
} from "@vis.gl/react-google-maps";

export const InputMarker = ({ p }: { p: { lat: number; lng: number } }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(true);
  const [markerRef, marker] = useMarkerRef();

  return (
    <>
      <Marker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={p}
        // title={"AdvancedMarker that opens an Infowindow when clicked."}
      />
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <input type="text" className="border border-green-800 text-black" />
        </InfoWindow>
      )}
    </>
  );
};
