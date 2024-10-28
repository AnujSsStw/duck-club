export interface HuntData {
  _creationTime: number;
  _id: string;
  blindSessions: BlindSession[];
  city: string;
  condition: string;
  county: string;
  createdBy: string;
  date: Date;
  description: string;
  dt: string;
  humidity: number;
  latitude: number;
  locationID: string;
  locationId: string;
  longitude: number;
  name: string;
  precipitation: number;
  source: string;
  state: string;
  temperatureC: number;
  timeSlot: string;
  updatedAt: Date;
  uvIndex: number;
  visibility: number;
  weatherConditionID: string;
  windDirection: string;
  windSpeed: number;
}

export interface BlindSession {
  _creationTime: number;
  _id: string;
  blindName: string;
  harvests: Harvest[];
  hunters: Hunter[];
  huntersPresent: string[];
  huntingSessionId: string;
  species: Species[];
  totalBirds: number;
  updatedAt: Date;
  notes?: string;
  pictures?: string[];
}

export interface Harvest {
  quantity: number;
  speciesId: string;
}

export interface Hunter {
  _creationTime: number;
  _id: string;
  email: string;
  firstName: string;
  fullName: string;
  lastName: string;
  memberShipType: string;
  phoneNumber: string;
  pictureUrl: string;
  tokenIdentifier: string;
}

export interface Species {
  _creationTime: number;
  _id: string;
  name: string;
}
