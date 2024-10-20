import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { LocateFixed } from "lucide-react";

export const CurrentLocation = () => {
  const map = useMap();
  const m = useMapsLibrary("marker");
  if (!map || !m) return null;

  return (
    <div
      className="p-2 bg-white rounded-full shadow-md cursor-pointer m-2"
      onClick={() => {
        navigator.geolocation.getCurrentPosition((position) => {
          map.setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
        map.setZoom(15);
      }}
    >
      <LocateFixed color="black" />
    </div>
  );
};
