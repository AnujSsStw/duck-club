"use client";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from 'convex/react';
import { Bird, Camera, CloudSun, MapPin, Users } from 'lucide-react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { Loading } from '@/components/loading';

// Dummy data for testing
const dummySession = {
    note: "Great morning hunt with clear conditions",
    timeSlot: "morning",
    totalWaterfowl: 12,
    pictures: ["photo1.jpg", "photo2.jpg"],
    weather: {
        dt: "2024-10-23T08:00:00Z",
        temperatureC: 15,
        windDirection: "NW",
        windSpeed: 12,
        precipitation: 0,
        condition: "Clear",
        humidity: 75,
        visibility: 10,
        uvIndex: 2,
        source: "WeatherAPI"
    },
    hunters: [
        {
            id: "123",
            email: "john@example.com",
            firstName: "John",
            lastName: "Doe",
            fullName: "John Doe",
            pictureUrl: null,
            phoneNumber: "555-0123",
            memberShipType: "member",
            duckBlind: {
                id: "blind1",
                name: "North Blind",
                latitude: 45.5231,
                longitude: -122.6765
            },
            harvests: [
                {
                    speciesId: "spec1",
                    speciesName: "Mallard",
                    quantity: 3
                },
                {
                    speciesId: "spec2",
                    speciesName: "Wood Duck",
                    quantity: 2
                }
            ]
        }
    ]
};

export function SessionView({sessionId, huntId}: {sessionId: string, huntId: Id<"huntsAllData">}) {

  const session = useQuery(api.huntsAllData.getHuntSessionDetails, { huntId, sessionId });
  const photos = useQuery(api.upload_things.getPhotosBySessionId, {huntId, sessionId})

    if (!session){
        return <Loading />
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Hunting Session Details</h1>
                    <Badge variant="secondary" className="text-lg">
                        {session.timeSlot}
                    </Badge>
                </div>

                {/* Weather Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CloudSun className="h-6 w-6" />
                            Weather Conditions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Temperature</p>
                                <p className="font-medium">{Math.round((session.weather.temperatureC * 9/5) + 32)}°F</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Wind</p>
                                <p className="font-medium">
                                    {session.weather.windDirection} {session.weather.windSpeed} km/h
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Visibility</p>
                                <p className="font-medium">{session.weather.visibility} km</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Condition</p>
                                <p className="font-medium">{session.weather.condition}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Hunters Card */}
                {session.hunters?.map((hunter) => (
                    <Card key={hunter.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-6 w-6" />
                                {hunter.fullName}
                                <Badge>{hunter.memberShipType}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{hunter.duckBlind?.name}</span>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Bird className="h-4 w-4" />
                                        Harvests
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {hunter.harvests?.map((harvest) => (
                                            <div key={harvest.speciesId} className="flex gap-2">
                                                <span>{harvest.speciesName}</span>
                                                <span className="font-medium">{harvest.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Notes Section */}
                {session.note && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{session.note}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Pictures Section */}
                {session.pictures && session.pictures.length > 0 && photos && photos.length > 0 && (
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
                                    <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                        <img src={pic || ""} alt={`Session photo ${index + 1}`} className="rounded-lg object-cover" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
