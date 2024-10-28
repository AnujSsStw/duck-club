"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ImageGrid } from "./image-grid";
import { ImageComponent } from "./image-comp";

export default function Page() {
  const images = useQuery(api.upload_things.getImagesByHunterId);
  if (!images) return null;

  return (
    <div>
      <ImageGrid
        images={images}
        getImage={(image) => <ImageComponent image={image} />}
      />
    </div>
  );
}
