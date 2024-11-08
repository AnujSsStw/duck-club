"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { TabBlinds } from "./tab-blinds";
import { TabSpecies } from "./tab-species";
import { TabTotal } from "./tab-total";
import { TabWeather } from "./tab-weather";

export function HuntingDashboard() {
  const [timePeriod, setTimePeriod] = useState("allTime");
  const [selectedTab, setSelectedTab] = useState("totals");

  return (
    <div className="container mx-auto p-4 space-y-8 ">
      <h1 className="text-3xl font-bold mb-4">Hunting Dashboard</h1>

      <Select
        onValueChange={(value) => setTimePeriod(value)}
        value={timePeriod}
      >
        <SelectTrigger
          disabled={selectedTab === "totals"}
          className="w-[180px]"
        >
          <SelectValue placeholder="Select time period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="season">Season</SelectItem>
          <SelectItem value="allTime">All Time</SelectItem>
        </SelectContent>
      </Select>

      <Tabs
        onValueChange={(value) => {
          setSelectedTab(value);
        }}
        defaultValue="totals"
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="totals">Totals</TabsTrigger>
          <TabsTrigger value="species">Species</TabsTrigger>
          <TabsTrigger value="blinds">Blinds</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
        </TabsList>

        <TabTotal />

        <TabSpecies timePeriod={timePeriod} />

        <TabBlinds timePeriod={timePeriod} />

        <TabWeather timePeriod={timePeriod} />
      </Tabs>
    </div>
  );
}
