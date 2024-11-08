"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { Bird, Camera, CloudSun, MapPin, Users } from "lucide-react";
import { Loading } from "@/components/loading";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type SessionViewProps = {
  sessionId: Id<"blindSessions">;
  huntId: Id<"huntingSessions">;
};

export function SessionView({ sessionId, huntId }: SessionViewProps) {
  const session = useQuery(api.huntsAllData.getHuntSessionDetails, {
    huntId,
    sessionId,
  });
  const photos = useQuery(api.upload_things.getPhotosBySessionId, {
    sessionId,
  });

  if (!session) {
    return <Loading />;
  }

  const { blindInfo, weather, hunters, harvests, location, timeSlot } = session;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Hunting Session Details</h1>
          <Badge variant="secondary" className="text-lg">
            {timeSlot}
          </Badge>
        </header>

        <WeatherCard weather={weather} />
        <BlindCard
          blindInfo={blindInfo}
          location={location}
          hunters={hunters}
          harvests={harvests}
        />

        {blindInfo.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{blindInfo.notes}</p>
            </CardContent>
          </Card>
        )}

        {photos && photos.length > 0 && <PicturesCard photos={photos} />}
      </div>
    </div>
  );
}

type WeatherCardProps = {
  weather: {
    temperatureC: number;
    windDirection: string;
    windSpeed: number;
    visibility: number;
    condition: string;
  };
};

function WeatherCard({ weather }: WeatherCardProps) {
  const temperatureF = Math.round((weather.temperatureC * 9) / 5 + 32);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="h-6 w-6" />
          Weather Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <WeatherItem label="Temperature" value={`${temperatureF}°F`} />
          <WeatherItem
            label="Wind"
            value={`${weather.windDirection} ${weather.windSpeed} km/h`}
          />
          <WeatherItem label="Visibility" value={`${weather.visibility} km`} />
          <WeatherItem label="Condition" value={weather.condition} />
        </div>
      </CardContent>
    </Card>
  );
}

function WeatherItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

type BlindCardProps = {
  blindInfo: {
    blindName: string;
    harvests: Array<{ speciesId: string; quantity: number }>;
  };
  location: { description: string };
  hunters: Array<{
    _id: string;
    fullName: string;
    pictureUrl?: string;
    memberShipType: string;
  }>;
  harvests: Array<{ _id: string; name: string }>;
};

function BlindCard({ blindInfo, location, hunters, harvests }: BlindCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Blind Info
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Location Details</h4>
            <Badge className="">{blindInfo.blindName}</Badge>
            <p className="text-sm text-muted-foreground">
              {location.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Hunters
            </h4>
            <div className="space-y-2 ">
              {hunters.map((hunter) => (
                <div key={hunter._id} className="flex items-center gap-2">
                  {hunter.pictureUrl && (
                    <img
                      src={hunter.pictureUrl}
                      alt={`${hunter.fullName}'s profile`}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span>{hunter.fullName}</span>
                  <Badge variant="secondary">{hunter.memberShipType}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Bird className="h-4 w-4" />
              Harvests
              <span className="text-muted-foreground ml-2">
                (Total:{" "}
                {blindInfo.harvests.reduce((sum, h) => sum + h.quantity, 0)})
              </span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {blindInfo.harvests.map((harvest) => {
                const species = harvests.find(
                  (h) => h._id === harvest.speciesId
                );
                return (
                  <div key={harvest.speciesId} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {species?.name}
                    </span>
                    <span className="font-medium">{harvest.quantity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PicturesCard({ photos }: { photos: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-6 w-6" />
          Pictures
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((pic, index) => (
            <div
              key={index}
              className="aspect-square bg-muted rounded-lg flex items-center justify-center"
            >
              <img
                src={pic}
                alt={`Session photo ${index + 1}`}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
