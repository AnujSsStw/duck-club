import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, useState } from "react";
import { api } from "../../../convex/_generated/api";

export function ImageComponent({ image }: { image: any }) {
  const setAsFavoriteAction = useMutation(api.upload_things.setAsFavorite);
  const [selectedImage, setSelectedImage] = useState(null);
  console.log(image.url);

  return (
    <div className="relative">
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            <Image
              src={image.url}
              alt={image._id}
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] p-0">
          <div className="relative">
            <Image
              src={image.url}
              alt={image._id}
              width={800}
              height={800}
              className="rounded-lg object-contain w-full h-full"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-2 left-2">
              <Button variant="outline" asChild>
                <Link href={`/view-hunt/${image.huntId}`}>View</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {image.isFavorite ? (
        <FullHeart
          onClick={async () => {
            await setAsFavoriteAction({
              imageId: image._id,
              isFavorite: false,
            });
          }}
          className="absolute top-2 left-2 hover:text-white text-red-500 cursor-pointer"
        />
      ) : (
        <Heart
          onClick={async () => {
            await setAsFavoriteAction({
              imageId: image._id,
              isFavorite: true,
            });
          }}
          className="absolute top-2 left-2 hover:text-red-500 cursor-pointer"
        />
      )}
      {/* <ImageMenu image={imageData} /> */}
    </div>
  );
}

export function FullHeart(props: ComponentProps<"div">) {
  return (
    <div {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    </div>
  );
}
